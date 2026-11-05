/* Exact reduction on the original finite L×L square torus (a=1). Include every
 * Bloch sector of a repeated rectangle. Other spins use the full real-space ED.
 */
(() => {
  "use strict";
  function gcd(a, b) {
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }
  function axialCell(spin, L, waves) {
    let gx = L, gy = L;
    for (const [nx, ny] of waves) { gx = gcd(gx, nx); gy = gcd(gy, ny); }
    const px = L / gx, py = L / gy;
    if (px * py === L * L) return null;
    // A plotting tolerance cannot justify changing an electronic Hamiltonian.
    for (let x = 0; x < L; x++) for (let y = 0; y < L; y++) {
      const i = 3 * (x * L + y), j = 3 * ((x % px) * L + y % py);
      for (let a = 0; a < 3; a++) if (spin[i+a] !== spin[j+a]) return null;
    }
    return [px, py];
  }

  function buildBlock(A, spin, L, px, py, kx, ky, p) {
    // psi(r + cx*px ex + cy*py ey) = exp(i(kx*cx+ky*cy)) u(r).
    // k are radians per cell; u has 2*px*py components.
    const n = 2 * px * py;
    const at = (row, col) => 2 * (col * n + row);
    const bonds = [[1,0,p.t1],[0,1,p.t1],[1,1,p.t2],[1,-1,p.t2],
      [2,0,p.t3],[0,2,p.t3],[2,1,p.t4],[2,-1,p.t4],[1,2,p.t4],[1,-2,p.t4]];
    A.fill(0);
    for (let x = 0; x < px; x++) for (let y = 0; y < py; y++) {
      const up = 2 * (x * py + y), down = up + 1, s = 3 * (x * L + y);
      A[at(up,up)] += -p.J * spin[s+2] / 2;
      A[at(down,down)] += p.J * spin[s+2] / 2;
      A[at(up,down)] += -p.J * spin[s] / 2; A[at(up,down)+1] += p.J * spin[s+1] / 2;
      A[at(down,up)] += -p.J * spin[s] / 2; A[at(down,up)+1] -= p.J * spin[s+1] / 2;
      for (const [dx, dy, t] of bonds) {
        if (t === 0) continue;
        const xx = x + dx, yy = y + dy;
        const cx = Math.floor(xx / px), cy = Math.floor(yy / py);
        const neighbor = 2 * ((xx - cx * px) * py + yy - cy * py);
        const angle = kx * cx + ky * cy;
        const re = -t * Math.cos(angle), im = -t * Math.sin(angle);
        for (let channel = 0; channel < 2; channel++) {
          const ab = at(up+channel,neighbor+channel), ba = at(neighbor+channel,up+channel);
          A[ab] += re; A[ab+1] += im;
          A[ba] += re; A[ba+1] -= im;
        }
      }
    }
  }

  async function evaluate(spin, L, electronic, waves) {
    const solver = self.VariationalElectrons, cell = axialCell(spin, L, waves);
    if (!cell) return solver.evaluateElectrons(spin, L, electronic);
    const [px, py] = cell, Kx = L / px, Ky = L / py, sectors = Kx * Ky;
    const n = 2 * px * py, A = new Float64Array(2 * n * n);
    const eigenvalues = new Float64Array(2 * L * L), cellField = new Float64Array(3 * px * py);
    for (let ix = 0; ix < Kx; ix++) for (let iy = 0; iy < Ky; iy++) {
      buildBlock(A, spin, L, px, py, 2*Math.PI*ix/Kx, 2*Math.PI*iy/Ky, electronic);
      const {lambda:epsilon, vectors} = await solver.diagonalizeHermitian(A, n);
      eigenvalues.set(epsilon, n * (ix * Ky + iy));
      // The full normalized wave has a 1/sqrt(sectors) prefactor.
      // Discard these provisional sums if the global occupation is unresolved.
      // A fully occupied sector contributes zero local spin at every site.
      if (epsilon[n-1] < electronic.mu) continue;
      for (let level = 0; level < n && epsilon[level] < electronic.mu; level++) {
        for (let site = 0; site < px * py; site++) {
          const u = 2 * (level * n + 2 * site);
          const ur = vectors[u], ui = vectors[u+1], dr = vectors[u+2], di = vectors[u+3];
          cellField[3*site] += electronic.J * (ur * dr + ui * di);
          cellField[3*site+1] += electronic.J * (ur * di - ui * dr);
          cellField[3*site+2] += .5 * electronic.J * (ur*ur + ui*ui - dr*dr - di*di);
        }
      }
    }
    eigenvalues.sort();
    const el = solver.occupiedSpectrum(eigenvalues, L, electronic);
    const field = new Float64Array(3 * L * L);
    for (let x = 0; x < L; x++) for (let y = 0; y < L; y++) {
      const source = 3 * ((x % px) * py + y % py);
      for (let a = 0; a < 3; a++) field[3*(x*L+y)+a] = cellField[source+a] / sectors;
    }
    if (!field.every(Number.isFinite)) throw Error("电子能量或有效场超出双精度范围。");
    return {...el, B_el:field,
      implementation:{method:"finite-torus Bloch sectors", cell, k_grid:[Kx,Ky],
        eigensolver:"Eigen 3.4.0 SelfAdjointEigenSolver complex128", wasm_sha256:self.VariationalEigenSHA256}};
  }
  self.VariationalPeriodicElectrons = {evaluate};
})();
