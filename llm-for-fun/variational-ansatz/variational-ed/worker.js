/* Zero-temperature single-point evaluation on the visitor's CPU.
 * Square L×L torus, a=1. Flat input spins have order [x,y,component].
 * importScripts resolves relative to this worker, including on project Pages.
 */
"use strict";
let lastState = null;
let loaded = false;
const electronicKeys = ["t1", "t2", "t3", "t4", "mu", "J"];

function validateInputs(request, spin) {
  const L = request.L;
  if (!Number.isInteger(L) || L < 4 || L > 36) throw Error("格子尺寸应为 4 到 36 的整数。");
  if (!(spin instanceof Float64Array) || spin.length !== 3 * L * L)
    throw Error("自旋数组需要 L×L 个三分量自旋。");
  for (let site = 0; site < L * L; site++) {
    const index = 3 * site;
    const norm = Math.hypot(spin[index], spin[index + 1], spin[index + 2]);
    if (!Number.isFinite(norm) || Math.abs(norm - 1) > 1e-10)
      throw Error("格点 " + site + " 的自旋未通过单位模长检查。");
  }
  if (![request.H, request.A, ...electronicKeys.map(k => request.electronic[k])].every(Number.isFinite))
    throw Error("电子参数、磁场和各向异性都必须为有限数值。");
}

async function spinHash(spin) {
  if (!self.crypto?.subtle) return null;
  const digest = await crypto.subtle.digest("SHA-256", spin);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function evaluate(request, spin, progress) {
  validateInputs(request, spin);
  const start = performance.now();
  if (!loaded) {
    progress("load");
    // The exported index.html embeds these same scripts in its worker Blob.
    if (!self.VariationalElectrons || !self.VariationalObservables) {
      importScripts("eigen-kernel.js", "electron-solver.js", "periodic-electrons.js", "observables.js");
    }
    loaded = true;
  }
  const {L, electronic, H, A} = request;
  const qn = request.parameters.qn || [];
  const key = JSON.stringify([L, qn, ...electronicKeys.map(k => electronic[k])]);
  const sameState = lastState !== null && key === lastState.key
    && spin.every((v, i) => Object.is(v, lastState.spin[i]));
  if (!sameState) {
    progress("electrons");
    const el = await self.VariationalPeriodicElectrons.evaluate(spin, L, electronic, qn);
    progress("observables");
    const obs = self.VariationalObservables.calculate(L, spin, qn);
    lastState = {key, spin, hash: await spinHash(spin), el, obs};
  }
  const {el, obs, hash} = lastState;
  // H and A couple only to classical spins. For the same electronic state
  // reuse its density, spectrum and site fields even when H or A changes.
  const local = self.VariationalObservables.fields(L, spin, el.B_el, H, A);
  const energies = {Omega_el: el.Omega_el, E_el: el.E_el, E_Z: local.E_Z, E_A: local.E_A,
    Omega_total: el.Omega_el + local.E_Z + local.E_A, E_total: el.E_el + local.E_Z + local.E_A};
  for (const [key, value] of Object.entries(energies)) {
    if (!Number.isFinite(value)) throw Error("能量超出双精度范围，请检查输入参数。");
    energies[key + "_per_site"] = value / (L * L);
  }
  Object.assign(energies, {N_e: el.N_e, N_sites: L * L, electron_density: el.N_e / (L * L)});
  return {request, spin_hash: hash, cache_hit: sameState, elapsed_seconds: (performance.now() - start) / 1000,
    energies, scalars: {...obs.scalars, ...local.scalars}, q_vectors: obs.q_vectors,
    q_values_per_site: obs.q_values_per_site, topology_diagnostics: obs.topology_diagnostics,
    magnetic_period: obs.magnetic_period, occupation_diagnostics: el.occupation_diagnostics,
    spectrum: {lambda: Array.from(el.spectrum.lambda), epsilon: Array.from(el.spectrum.epsilon),
      occupied: Array.from(el.spectrum.occupied, Boolean)},
    arrays: {...obs.arrays, ...local.arrays}, implementation: el.implementation,
    conventions: {...obs.conventions, ensemble: "T_el=0, occupied lambda=epsilon-mu<0",
      energy: "Omega_total=Omega_el-H*sum(Sz)-A*sum(Sz^2); E_total=Omega_total+mu*N_e",
      field: "B_total=B_el+(H+2*A*Sz)*ez", units: "a=1, unit spins, energies and fields in E0",
      precision: "float64, visitor browser"}};
}

self.onmessage = async ({data}) => {
  const {id, request, spin} = data;
  try {
    // `stage` lets the UI translate an in-flight job. Keep the original label
    // as well for clients that already consume the Worker's progress stream.
    const labels = {load:"正在加载浏览器数值程序…",electrons:`正在计算 ${request.L}×${request.L} 构型的零温电子谱和有效场…`,
      observables:"正在计算结构因子、几何荷与平移原胞…"};
    const result = await evaluate(request, spin, stage => self.postMessage({id, type: "progress", stage, L:request.L, label:labels[stage]}));
    self.postMessage({id, type: "result", result});
  } catch (error) {
    self.postMessage({id, type: "error", message: error.message || String(error),
      diagnostics: error.occupation_diagnostics || error.diagnostics || null});
  }
};
