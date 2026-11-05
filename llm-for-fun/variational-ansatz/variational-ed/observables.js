/* Square-lattice frozen-spin observables, matching tools/fixedq_variational/observables.py.
 * Input: flat spin or field indexed by 3*(x*L+y)+component; a=1, periodic x,y.
 * Returned maps are ordinary arrays in [x][y] order. Undefined physical values
 * are null, keeping a true zero distinct from an invalid or absent measurement.
 */
(() => {
  "use strict";
  const TAU = 2 * Math.PI;
  const SPLIT_TOL = 1e-3, SINGULAR_TOL = 1e-10, PERIOD_TOL = 1e-8;
  const COMPONENTS = ["x", "y", "z", "xy", "total"];
  const Q_NAMES = ["Q1", "Q2", "Q1minusQ2", "Q1plusQ2"];
  const mod = (n, L) => ((n % L) + L) % L;
  const matrix = (L, value) =>
    Array.from({length:L}, (_, x) => Array.from({length:L}, (_, y) => value(x,y)));

  function vectorGrid(L, flat, unit) {
    if (!Number.isSafeInteger(L) || L < 1 || !flat || flat.length !== 3*L*L)
      throw new Error("自旋或场需要 L×L×3 个分量。");
    return matrix(L, (x,y) => {
      const i = 3*(x*L+y), v = [flat[i], flat[i+1], flat[i+2]];
      if (!v.every(Number.isFinite)) throw new Error("自旋或场含非有限分量。");
      if (unit && Math.abs(Math.hypot(...v)-1) > 1e-10)
        throw new Error("自旋模长与 1 的最大允许偏差为 1e−10。");
      return v;
    });
  }

  function validateWaves(L, qn) {
    if (!Array.isArray(qn) || qn.length > 2) throw new Error("需给出零、一或两支基础波矢。");
    for (let i=0; i<qn.length; i++) {
      const q = qn[i];
      if (!Array.isArray(q) || q.length!==2 || !q.every(Number.isSafeInteger))
        throw new Error("每支波矢必须是两个整数。");
      if (q.every(n=>mod(n,L)===0)) throw new Error("基础波矢不能等价于零。");
      for (let j=0; j<i; j++) {
        if ([1,-1].some(sign=>q.every((n,k)=>mod(n,L)===mod(sign*qn[j][k],L))))
          throw new Error("两支基础波矢在周期格子上不能相同或反向相同。");
      }
    }
  }

  // Direct, separable DFT on the full L×L grid. No power-of-two assumption.
  // Maps use Sᵅ(q)=|Σ Sᵅ exp(−iq·r)|²/N; the q-table divides by N again.
  function structureFactors(L, s, qn) {
    const N = L*L, middle = Math.floor(L/2);
    const cos = matrix(L,(k,r)=>Math.cos(TAU*k*r/L));
    const sin = matrix(L,(k,r)=>-Math.sin(TAU*k*r/L));
    const axis = Array.from({length:L},(_,i)=>TAU*(i-middle)/L);
    const structure = {qx:axis, qy:axis.slice()};
    for (const component of COMPONENTS) structure[component] = matrix(L,()=>0);
    for (let alpha=0; alpha<3; alpha++) {
      const alongY = matrix(L, (x,ky) => {
        let re=0, im=0;
        for (let y=0; y<L; y++) {
          re += s[x][y][alpha]*cos[ky][y];
          im += s[x][y][alpha]*sin[ky][y];
        }
        return [re, im];
      });
      for (let kx=0; kx<L; kx++) for (let ky=0; ky<L; ky++) {
        let re=0, im=0;
        for (let x=0; x<L; x++) {
          const [ry,iy] = alongY[x][ky];
          re += cos[kx][x]*ry - sin[kx][x]*iy;
          im += cos[kx][x]*iy + sin[kx][x]*ry;
        }
        const ix = mod(kx+middle,L), iy = mod(ky+middle,L);
        const power = (re*re+im*im)/N;
        structure[COMPONENTS[alpha]][ix][iy] = power;
        if (alpha<2) structure.xy[ix][iy] += power;
        structure.total[ix][iy] += power;
      }
    }
    const waves = [qn[0] || null, qn[1] || null, null, null];
    if (qn.length===2) {
      waves[2] = qn[0].map((n,i)=>n-qn[1][i]);
      waves[3] = qn[0].map((n,i)=>n+qn[1][i]);
      if (!waves[2].every(Number.isSafeInteger) || !waves[3].every(Number.isSafeInteger))
        throw new Error("组合波矢超出可精确表示的整数范围。");
    }
    const q_vectors={}, q_values={}, q_values_per_site={};
    for (let j=0; j<Q_NAMES.length; j++) {
      const key=Q_NAMES[j], q=waves[j];
      q_vectors[key] = q ? {
        qn:q.slice(), radians:q.map(n=>TAU*n/L),
        wrapped_radians:q.map(n=>TAU*(mod(mod(n,L)+middle,L)-middle)/L)
      } : null;
      q_values[key]={}; q_values_per_site[key]={};
      for (const c of COMPONENTS) {
        const v = q ? structure[c][mod(mod(q[0],L)+middle,L)][mod(mod(q[1],L)+middle,L)] : null;
        q_values[key][c]=v;
        q_values_per_site[key][c]=v===null ? null : v/N;
      }
    }
    return {structure, q_vectors, q_values, q_values_per_site};
  }

  const dot = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const triple = (a,b,c) => a[0]*(b[1]*c[2]-b[2]*c[1]) +
    a[1]*(b[2]*c[0]-b[0]*c[2]) + a[2]*(b[0]*c[1]-b[1]*c[0]);

  function chiralityMap(L,s) {
    return matrix(L,(x,y)=>{
      let chi=0;
      for (const dx of [-1,1]) for (const dy of [-1,1])
        chi += 0.5*dx*dy*triple(s[x][y],s[mod(x+dx,L)][y],s[x][mod(y+dy,L)]);
      return chi;
    });
  }

  // Square plaquettes A,B,C,D run counterclockwise from site (x,y).
  // AC and BD diagonals give separate sums. Local splits, antipodal edges and
  // branches are tested before the geometric charge can be interpreted.
  function topology(L, directions) {
    const d = {Q_local_tol:SPLIT_TOL, Q_singular_tol:SINGULAR_TOL,
      Q_singular_triangles:0, Q_antipodal_triangles:0, Q_branch_triangles:0,
      Q_A:0, Q_B:0, Q_split:0, Q_local_split_max:0, Q_bad_plaquettes:0,
      Q_ambiguous_plaquettes:0,
      topology_convention:"repository_mean_of_AC_and_BD_triangulations_when_valid",
      topology_map_convention:"mean_of_q_A_and_q_B_per_plaquette",
      validity_scope:"geometric_diagnostic_at_recorded_tolerances_not_stability_or_continuum_proof"};
    function triangle(a,b,c) {
      const ab=dot(a,b), bc=dot(b,c), ca=dot(c,a);
      const num=triple(a,b,c), den=1+ab+bc+ca;
      const singular=Math.hypot(num,den)<=SINGULAR_TOL;
      const antipodal=Math.min(1+ab,1+bc,1+ca)<=SINGULAR_TOL;
      const branch=Math.abs(num)<=SINGULAR_TOL && den<0;
      d.Q_singular_triangles+=Number(singular);
      d.Q_antipodal_triangles+=Number(antipodal);
      d.Q_branch_triangles+=Number(branch);
      return {angle:2*Math.atan2(num,den), bad:singular||antipodal||branch};
    }
    const mask=matrix(L,()=>false);
    let map=matrix(L,(x,y)=>{
      const a=directions[x][y], b=directions[(x+1)%L][y];
      const c=directions[(x+1)%L][(y+1)%L], e=directions[x][(y+1)%L];
      const abc=triangle(a,b,c), acd=triangle(a,c,e);
      const abd=triangle(a,b,e), bcd=triangle(b,c,e);
      const qa=(abc.angle+acd.angle)/(4*Math.PI), qb=(abd.angle+bcd.angle)/(4*Math.PI);
      const split=qa-qb, badSplit=Math.abs(split)>SPLIT_TOL;
      d.Q_A+=qa; d.Q_B+=qb; d.Q_split+=split;
      d.Q_bad_plaquettes+=Number(badSplit);
      d.Q_local_split_max=Math.max(d.Q_local_split_max,Math.abs(split));
      mask[x][y]=badSplit||abc.bad||acd.bad||abd.bad||bcd.bad;
      d.Q_ambiguous_plaquettes+=Number(mask[x][y]);
      return 0.5*(qa+qb);
    });
    d.Q=0.5*(d.Q_A+d.Q_B);
    d.Q_valid=d.Q_ambiguous_plaquettes===0;
    if (!d.Q_valid) map=matrix(L,()=>null);
    return {diagnostics:d, mask, map};
  }

  function magneticPeriod(L,s) {
    const accepted=[], present=matrix(L,()=>false);
    let maxAcceptedError=0;
    for (let dx=0; dx<L; dx++) for (let dy=0; dy<L; dy++) {
      let error=0;
      for (let x=0; x<L && error<=PERIOD_TOL; x++) for (let y=0; y<L; y++) {
        const a=s[x][y], b=s[(x+dx)%L][(y+dy)%L];
        error=Math.max(error, Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]));
        if (error>PERIOD_TOL) break;
      }
      if (error<=PERIOD_TOL) {
        accepted.push([dx,dy]); present[dx][dy]=true;
        maxAcceptedError=Math.max(maxAcceptedError,error);
      }
    }
    const count=accepted.length;
    const closed=accepted.every(([x,y])=>accepted.every(([dx,dy])=>present[(x+dx)%L][(y+dy)%L]));
    const valid=count>0 && closed && (L*L)%count===0;
    return {magnetic_period_valid:valid,
      magnetic_period_reason:valid?"translation_subgroup_verified":"approximate_translations_not_closed",
      period_tol:PERIOD_TOL, max_accepted_translation_error:maxAcceptedError,
      accepted_translations:accepted, n_magnetic_cells:valid?count:null, primitive_sites:valid?L*L/count:null};
  }

  function cellCharges(L, qn, d, period) {
    const tol=Math.max(1e-8,L*L*128*Number.EPSILON);
    period.cell_charge_integer_tol=tol;
    const Q=d.Q_valid ? d.Q : null;
    let latticeQ=null;
    if (d.Q_valid && period.magnetic_period_valid) {
      const proposed=Q/period.n_magnetic_cells;
      if (Math.abs(proposed-Math.round(proposed))<=tol) latticeQ=proposed;
    }
    period.Q_per_magnetic_cell_valid=latticeQ!==null;
    period.cell_charge_reason=latticeQ!==null?"ok":
      (d.Q_valid && period.magnetic_period_valid?"magnetic_cell_charge_not_integer":"topology_or_period_invalid");
    // Rows are the *specified* integer wavevectors, without BZ folding.
    let phaseCells=null;
    if (qn.length===2) {
      const [[a,b],[c,e]]=qn;
      const det=BigInt(a)*BigInt(e)-BigInt(b)*BigInt(c);
      if (det!==0n) {
        phaseCells=Number(det<0n?-det:det);
        if (!Number.isSafeInteger(phaseCells)) throw new Error("相位原胞数超出可精确表示的整数范围。");
      }
    }
    const phaseQ=Q!==null && phaseCells!==null ? Q/phaseCells : null;
    const err=phaseQ===null ? null : Math.abs(phaseQ-Math.round(phaseQ));
    return {Q_total:Q, Q_per_magnetic_cell:latticeQ, abs_Q_per_magnetic_cell:latticeQ===null?null:Math.abs(latticeQ),
      primitive_sites:period.primitive_sites, n_magnetic_cells:period.n_magnetic_cells,
      n_phase_cells:phaseCells, Q_per_phase_cell:phaseQ, Q_per_phase_cell_integer_error:err,
      Q_per_phase_cell_is_integer:err===null?null:err<=tol};
  }

  function calculate(L, spin, qn) {
    const s=vectorGrid(L,spin,true), N=L*L;
    validateWaves(L,qn);
    const lengths=matrix(L,(x,y)=>Math.hypot(...s[x][y]));
    const directions=matrix(L,(x,y)=>s[x][y].map(v=>v/lengths[x][y]));
    const theta=matrix(L,(x,y)=>Math.acos(Math.max(-1,Math.min(1,directions[x][y][2]))));
    const {structure,q_vectors,q_values,q_values_per_site}=structureFactors(L,s,qn);
    const chi=chiralityMap(L,s);
    const top=topology(L,directions), period=magneticPeriod(L,s);
    const Q=cellCharges(L,qn,top.diagnostics,period);
    const M=[0,0,0];
    let sumChi=0, sumAbsChi=0, sumLength=0, sumSquareLength=0, sumPower=0;
    for (let x=0; x<L; x++) for (let y=0; y<L; y++) {
      for (let k=0;k<3;k++) M[k]+=s[x][y][k];
      sumChi+=chi[x][y]; sumAbsChi+=Math.abs(chi[x][y]);
      sumLength+=lengths[x][y]; sumSquareLength+=lengths[x][y]**2;
      sumPower+=structure.total[x][y];
    }
    const [Mx,My,Mz]=M.map(v=>v/N), middle=Math.floor(L/2);
    const scalars={Mx,My,Mz,M_norm:Math.hypot(Mx,My,Mz),M_xy:Math.hypot(Mx,My),
      mean_moment_length:sumLength/N,rms_moment_length:Math.sqrt(sumSquareLength/N),
      chi_mean:sumChi/N,chi_abs_mean:Math.abs(sumChi/N),chi_mean_abs:sumAbsChi/N,
      S_sum_per_site:sumPower/N,S_zero_per_site:structure.total[middle][middle]/N,...Q};
    return {scalars,base_qn:qn.map(q=>q.slice()),q_vectors,q_values,q_values_per_site,
      topology_diagnostics:top.diagnostics, magnetic_period:period,
      arrays:{spin:s,structure,chirality_map:chi,topology_map:top.map,topology_ambiguity_mask:top.mask,
        moment_length:lengths,unit_directions:directions,theta},
      conventions:{chirality:"half_sum_dx_dy_dxdy_S_dot_cross_four_neighbors",
        chi_abs_mean:"abs(mean(chi_i))",chi_mean_abs:"mean(abs(chi_i))",
        Q_per_magnetic_cell:"sampled Q_total / number of verified lattice translation cells",
        Q_per_phase_cell:"sampled Q_total / abs(det(base_qn)); valid two independent waves and lattice Q",
        structure_factor:"abs_DFT_squared_over_N; full shifted grid includes q=0",
        q_values_per_site:"abs_DFT_squared_over_N_squared",q_labels:"candidate-specific; missing Q is undefined",
        axes:"real and reciprocal arrays [x][y]",boundary:"periodic in both lattice axes",spin_units:"dimensionless_unit_vector"}};
  }

  function fields(L, spin, B_el, H, A) {
    const s=vectorGrid(L,spin,true), el=vectorGrid(L,B_el,false), N=L*L;
    if (!Number.isFinite(H)||!Number.isFinite(A)) throw new Error("H 和 A 必须为有限值。");
    let sumZ=0,sumZ2=0,sumTorque=0,sumTorque2=0,sumField2=0,torqueMax=0,fieldMax=0;
    const torque=matrix(L,()=>0);
    const total=matrix(L,(x,y)=>{
      const [sx,sy,sz]=s[x][y], [bx,by,bzEl]=el[x][y];
      const bz=bzEl+H+2*A*sz;
      const b=Math.hypot(bx,by,bz);
      const t=Math.hypot(sy*bz-sz*by,sz*bx-sx*bz,sx*by-sy*bx);
      torque[x][y]=t;
      sumZ+=sz; sumZ2+=sz*sz;
      sumTorque+=t; sumTorque2+=t*t; torqueMax=Math.max(torqueMax,t);
      sumField2+=b*b; fieldMax=Math.max(fieldMax,b);
      return [bx,by,bz];
    });
    const scalars={Kz_per_site:sumZ2/N,torque_rms:Math.sqrt(sumTorque2/N),torque_max:torqueMax,
      torque_mean:sumTorque/N,field_rms:Math.sqrt(sumField2/N),field_max:fieldMax};
    const E_Z=-H*sumZ, E_A=-A*sumZ2;
    if (![E_Z,E_A,...Object.values(scalars)].every(Number.isFinite)) throw new Error("经典能量、有效场或力矩超出数值范围。");
    return {scalars,arrays:{B_el:el,B_total:total,torque_norm:torque},E_Z,E_A};
  }

  globalThis.VariationalObservables=Object.freeze({calculate,fields});
})();
