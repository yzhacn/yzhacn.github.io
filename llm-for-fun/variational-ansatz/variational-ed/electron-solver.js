/* Exact square-lattice electronic energy and Hellmann–Feynman field.
 * Load eigen-kernel.js before this script in a classic Web Worker. Everything
 * runs locally. Energy parameters t1,t2,t3,t4,J,mu have one common unit E0.
 */
(function (global) {
  'use strict';
  let kernelPromise;
  async function loadKernel() {
    if (!kernelPromise) {
      const bytes = Uint8Array.from(atob(global.VariationalEigenBase64), c => c.charCodeAt(0));
      kernelPromise = WebAssembly.instantiate(bytes, {}).then(({instance}) => {
        instance.exports._initialize();
        return instance.exports;
      }).catch(error => {
        kernelPromise=null;
        throw error;
      });
    }
    return kernelPromise;
  }

  // x,y are periodic. Basis (site,↑/↓), site=x*L+y. Complex128 matrix in
  // column-major order, with adjacent real and imaginary float64 components.
  function buildHamiltonian(A, spin, L, p) {
    const n = 2*L*L;
    A.fill(0);
    function entry(row, col) { return 2*(row + n*col); }
    const shells = [
      [p.t1, [[1,0],[0,1]]], [p.t2, [[1,1],[1,-1]]],
      [p.t3, [[2,0],[0,2]]], [p.t4, [[2,1],[2,-1],[1,2],[1,-2]]]
    ];
    for (let x=0; x<L; x++) for (let y=0; y<L; y++) {
      const site=x*L+y, up=2*site, down=up+1;
      const sx=spin[3*site], sy=spin[3*site+1], sz=spin[3*site+2];
      // −J/2 S·σ − µ: fill onsite entries before adding periodic image bonds.
      A[entry(up,up)] += -p.mu-p.J*sz/2;
      A[entry(down,down)] += -p.mu+p.J*sz/2;
      A[entry(up,down)] += -p.J*sx/2; A[entry(up,down)+1] += p.J*sy/2;
      A[entry(down,up)] += -p.J*sx/2; A[entry(down,up)+1] += -p.J*sy/2;
      for (const [t,bonds] of shells) {
        if (t===0) continue;
        for (const [dx,dy] of bonds) {
          const j=2*(((x+dx+2*L)%L)*L+(y+dy+2*L)%L);
          // Retain every forward bond and reverse, including coincident bonds.
          for (let s=0; s<2; s++) {
            A[entry(up+s,j+s)] -= t;
            A[entry(j+s,up+s)] -= t;
          }
        }
      }
    }
  }

  function occupation(lambda) {
    let maxAbs=0, minAbs=Infinity, nOccupied=0;
    for (let j=0;j<lambda.length;j++) {
      const e=lambda[j];
      if (!Number.isFinite(e) || (j>0 && e<lambda[j-1])) throw Error('电子本征值非有限或顺序不正确');
      maxAbs=Math.max(maxAbs,Math.abs(e)); minAbs=Math.min(minAbs,Math.abs(e));
      if (e<0) nOccupied++;
    }
    // Same occupation resolution rule as exact._occupation_diagnostics. The
    // threshold screens unresolved zero levels. It is not a broadening.
    const delta=8*lambda.length*Number.EPSILON*maxAbs;
    const unresolved=lambda.reduce((count,e)=>count+(Math.abs(e)<=delta ? 1 : 0),0);
    const diag={sample:0,resolved:unresolved===0,occupation_policy:'lambda<0',
      electron_temperature:0,n_levels:lambda.length,n_occupied:nOccupied,
      resolution_tolerance:delta,boundary_energy:0,
      occupation_gap:nOccupied>0 && nOccupied<lambda.length ? lambda[nOccupied]-lambda[nOccupied-1] : null,
      minimum_abs_eigenvalue:minAbs,unresolved_shell_size:unresolved};
    if (unresolved) {
      const error=Error(`占据边界不可分辨：${unresolved} 个能级满足 |ε−μ| ≤ ${delta.toExponential(5)}。`);
      error.name='ElectronicDegeneracyError'; error.occupation_diagnostics=[diag];
      throw error;
    }
    return diag;
  }

  // Fill and consume the dense matrix in WASM memory so the L=36 reference
  // does not need another 102.5 MiB copy of the whole eigenvector matrix.
  async function withEigenvectors(n, fillMatrix, consume) {
    const wasm=await loadKernel();
    let matrix=0, levels=0;
    try {
      matrix=wasm.ed_alloc(16*n*n); levels=wasm.ed_alloc(8*n);
      if (!matrix || !levels) throw Error('浏览器可用内存不足以容纳当前尺寸的哈密顿量');
      const input=new Float64Array(wasm.memory.buffer,matrix,2*n*n);
      fillMatrix(input);
      if (!input.every(Number.isFinite)) throw Error('哈密顿矩阵超出双精度数值范围');
      const info=wasm.ed_diagonalize(n,matrix,levels);
      if (info!==0) throw Error(`厄米矩阵本征求解未收敛 (Eigen status ${info})`);
      // The solver may grow WASM memory: reacquire views after the call.
      const lambda=new Float64Array(wasm.memory.buffer,levels,n).slice();
      const vectors=new Float64Array(wasm.memory.buffer,matrix,2*n*n);
      return consume(lambda,vectors);
    } catch (error) {
      // An abort may leave the allocator inconsistent. A later click starts a
      // fresh instance instead of using memory owned by an interrupted solve.
      if (error instanceof WebAssembly.RuntimeError) kernelPromise=null;
      throw error;
    } finally {
      if (kernelPromise) { if (matrix) wasm.ed_free(matrix); if (levels) wasm.ed_free(levels); }
    }
  }

  // For a smaller twisted Bloch sector; arrays returned here are owned by JS.
  async function diagonalizeHermitian(A,n) {
    if (!Number.isInteger(n) || n<1 || n>2*36*36 || A.length!==2*n*n) {
      throw Error('厄米矩阵需要有限的复数数组（实虚交错，按列排列）');
    }
    return withEigenvectors(n, M=>M.set(A), (lambda,V)=>({lambda,vectors:V.slice()}));
  }

  async function evaluateElectrons(spin,L,p) {
    if (!Number.isInteger(L) || L<1 || L>36) throw Error('电子计算需要 1 ≤ L ≤ 36 的方形周期晶格');
    const N=L*L,n=2*N;
    if (!spin || spin.length!==3*N) throw Error('自旋数组应按 [L,L,3] 展平');
    for (let i=0;i<N;i++) {
      const length=Math.hypot(spin[3*i],spin[3*i+1],spin[3*i+2]);
      if (!Number.isFinite(length) || Math.abs(length-1)>1e-10) throw Error('当前构型含非法或未归一化自旋');
    }
    for (const key of ['t1','t2','t3','t4','J','mu']) {
      if (!Number.isFinite(p[key])) throw Error(`电子参数 ${key} 必须是有限数`);
    }
    return withEigenvectors(n,A=>buildHamiltonian(A,spin,L,p),(lambda,vectors)=>{
      const diag=occupation(lambda), N_e=diag.n_occupied;
      let Omega_el=0;
      const B_el=new Float64Array(3*N);
      for (let k=0;k<N_e;k++) {
        Omega_el+=lambda[k];
        // Each column is one occupied eigenvector. At site i the two amplitudes
        // u,d contribute (J Re(u* d), J Im(u* d), J (|u|²−|d|²)/2).
        for (let i=0,j=2*n*k;i<N;i++,j+=4) {
          const ur=vectors[j],ui=vectors[j+1],dr=vectors[j+2],di=vectors[j+3];
          B_el[3*i]+=p.J*(ur*dr+ui*di);
          B_el[3*i+1]+=p.J*(ur*di-ui*dr);
          B_el[3*i+2]+=(p.J/2)*(ur*ur+ui*ui-dr*dr-di*di);
        }
      }
      const E_el=Omega_el+p.mu*N_e;
      if (!Number.isFinite(E_el) || !B_el.every(Number.isFinite)) throw Error('电子能量或有效场非有限');
      return {spectrum:{lambda,epsilon:lambda.map(e=>e+p.mu),occupied:Uint8Array.from(lambda,e=>Number(e<0))},
        B_el,Omega_el,E_el,N_e,occupation_diagnostics:diag,
        implementation:`Eigen 3.4.0 SelfAdjointEigenSolver, complex128, WASM SHA-256 ${global.VariationalEigenSHA256}`};
    });
  }
  global.VariationalElectrons={evaluateElectrons,diagonalizeHermitian,occupation};
})(globalThis);
