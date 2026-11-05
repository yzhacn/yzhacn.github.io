/* Explicit-button ED. All results belong to an immutable request snapshot. */
(function () {
  "use strict";
  const byId = id => document.getElementById(id);
  // DOM strings and Worker messages are rendered on the main thread, so a
  // language switch also translates a running calculation or a saved error.
  const messages = {
    "未定义": ["未定義", "Undefined"],
    "不适用": ["該当なし", "Not applicable"],
    "构型面板尚未准备好，请刷新页面。": ["スピン配置の設定画面を読み込めませんでした。ページを再読み込みしてください。", "The configuration panel is not ready. Reload the page."],
    "请检查上方构型面板的参数与诊断。": ["ページ上部でスピン配置のパラメータと判定結果を確認してください。", "Check the parameters and diagnostics in the configuration panel above."],
    "{key} 必须为有限数值。": ["{key} には有限の数値を入力してください。", "Enter a finite value for {key}."],
    "下列结果对应当前参数。": ["現在のパラメータでの計算結果です。", "These results match the current parameters."],
    "参数已改变：下列结果仍属于上次计算快照，请点击计算更新。": ["パラメータが変更されています。以下に表示しているのは変更前の結果です。現在の値で再計算してください。", "The parameters have changed. The previous result is shown below. Calculate again to update it."],
    "计算快照：{family}，{L}×{L}；H={H}，A={A}；{electronic}": ["計算条件：{family}、{L}×{L}、H={H}、A={A}、{electronic}", "Calculation snapshot: {family}, {L}×{L}; H={H}, A={A}; {electronic}"],
    "自旋模长": ["スピンの長さ", "Spin length"],
    "实空间自旋方向": ["実空間のスピン配置", "Spin directions in real space"],
    "单位球面上的自旋方向": ["単位球面上で見たスピンの向き", "Spin directions on the unit sphere"],
    "球面侧视图 2": ["単位球を横から見た図（2）", "Unit sphere: side view 2"],
    "球面侧视图 3": ["単位球を横から見た図（3）", "Unit sphere: side view 3"],
    "球面俯视图": ["単位球を上から見た図", "Unit sphere: top view"],
    "总结构因子 S(q)": ["スピン構造因子の全成分の和 S(q)", "Total structure factor S(q)"],
    "四邻居标量手性 χᵢ": ["最近接4サイトから求めたスカラースピンカイラリティ χᵢ", "Four-neighbor scalar chirality χᵢ"],
    "每格方几何荷（未通过诊断时未定义）": ["各プラケットのトポロジカル電荷（三角形分割で一意に定まらない場合は未定義）", "Geometric charge per plaquette (undefined if the diagnostic fails)"],
    "固定构型的电子谱 λ = ε − μ，λ < 0 占据。H、A 仅进入经典自旋项。": ["スピン配置を固定して求めた電子スペクトル λ = ε − μ。λ < 0 の準位を占有する。H と A は古典スピンのエネルギーにのみ寄与する。", "Frozen-spin electronic spectrum λ = ε − μ. Levels with λ < 0 are occupied. H and A enter only the classical spin terms."],
    "有效场 B_z": ["有効場 B_z", "Effective field B_z"],
    "有效场模长 |B|": ["有効場の大きさ |B|", "Effective field magnitude |B|"],
    "力矩模长 |S × B|": ["トルクの大きさ |S × B|", "Torque magnitude |S × B|"],
    "点击下载原图": ["クリックして画像を保存", "Click to download the image"],
    "巨势 Ω/N": ["1サイト当たりのグランドポテンシャル Ω/N", "Grand potential Ω/N"],
    "总能量 E/N": ["1サイト当たりの全エネルギー E/N", "Total energy E/N"],
    "电子密度 nₑ": ["電子密度 nₑ", "Electron density nₑ"],
    "净磁化 ⟨S_z⟩": ["磁化の z 成分 ⟨S_z⟩", "Net magnetization ⟨S_z⟩"],
    "能量分解": ["エネルギーの内訳", "Energy contributions"],
    "量": ["物理量", "Quantity"],
    "总量": ["系全体", "Total"],
    "每格点": ["1サイト当たり", "Per site"],
    "数值": ["値", "Value"],
    "电子巨势 Ω_el": ["電子のグランドポテンシャル Ω_el", "Electronic grand potential Ω_el"],
    "电子能量 E_el": ["電子エネルギー E_el", "Electronic energy E_el"],
    "Zeeman −HΣS_z": ["ゼーマン項 −HΣS_z", "Zeeman term −HΣS_z"],
    "各向异性 −AΣS_z²": ["一軸異方性 −AΣS_z²", "Anisotropy −AΣS_z²"],
    "总巨势 Ω": ["系全体のグランドポテンシャル Ω", "Total grand potential Ω"],
    "总能量 E": ["全エネルギー E", "Total energy E"],
    "电子数 Nₑ": ["電子数 Nₑ", "Electron count Nₑ"],
    "当前构型的物理量": ["このスピン配置での物理量", "Observables for this configuration"],
    "净手性 ⟨χᵢ⟩": ["スカラースピンカイラリティの平均 ⟨χᵢ⟩", "Net chirality ⟨χᵢ⟩"],
    "平均局部手性幅值 ⟨|χᵢ|⟩": ["局所カイラリティの絶対値の平均 ⟨|χᵢ|⟩", "Mean local chirality magnitude ⟨|χᵢ|⟩"],
    "Σq S(q)/N（应为 1）": ["Σq S(q)/N（規格化により 1）", "Σq S(q)/N (expected value 1)"],
    "力矩 RMS / max": ["トルクの実効値 / 最大値", "Torque RMS / maximum"],
    "有效场 RMS / max": ["有効場の実効値 / 最大値", "Effective field RMS / maximum"],
    "每晶格平移原胞的格点数": ["磁気単位胞内のサイト数", "Sites per lattice translation cell"],
    "整体诊断通过的 Q_A / Q_B": ["二通りの三角形分割による Q_A / Q_B（判定成立時）", "Q_A / Q_B when the global check passes"],
    "歧义格方数": ["電荷を一意に定められないプラケットの数", "Ambiguous plaquettes"],
    "同一个格点总荷的两种原胞归一化": ["二種類の単位胞で見たトポロジカル電荷", "Two cell normalizations of the same total lattice charge"],
    "区域": ["領域", "Region"],
    "归一化分母": ["格子全体に含まれる単位胞の数", "Divisor"],
    "格点几何荷": ["トポロジカル電荷", "Lattice geometric charge"],
    "整个周期格子": ["周期格子全体", "Entire periodic lattice"],
    "每个晶格平移原胞": ["磁気単位胞（格子並進）当たり", "Per lattice translation cell"],
    "每个连续相位原胞": ["位相の周期で定まる単位胞当たり", "Per continuous phase cell"],
    "双剖分诊断未通过。总荷、按原胞归一化的荷和拓扑密度均未定义。原始三角形和保存在数值诊断中。": ["二通りの三角形分割からはトポロジカル電荷を一意に定められません。格子全体の電荷、単位胞当たりの電荷、および電荷密度は未定義です。各分割で求めた和は計算の詳細で確認できます。", "The two-triangulation check failed. The total charge, both cell averages and the topological charge density are undefined. The original triangle sums are retained in the numerical diagnostics."],
    "相位胞读数在容差内接近整数。": ["位相の周期で定まる単位胞当たりの電荷は、許容誤差の範囲内で整数に一致します。", "The phase-cell value is within tolerance of an integer."],
    "相位胞读数超出整数容差，建议用页首的 2L、4L 加密检查取样密度。": ["位相の周期で定まる単位胞当たりの電荷は、最も近い整数から許容誤差を超えてずれています。ページ上部で格子を 2L、4L に細分化し、電荷が収束するか確認してください。", "The phase-cell value differs from an integer beyond tolerance. Check the sampling density with the 2L and 4L refinements at the top of the page."],
    "与最近整数相差 {distance}，容差 {tolerance}。": ["最も近い整数との差は {distance}、許容誤差は {tolerance} です。", "Distance to the nearest integer: {distance}. Tolerance: {tolerance}."],
    "连续相位原胞需要两支线性独立的整数波矢。": ["位相の周期から単位胞を定めるには、波数を指定する二つの整数ベクトルが一次独立である必要があります。", "A continuous phase cell requires two linearly independent integer wavevectors."],
    "选定波矢处的结构因子 Sᵅ(q)/N": ["指定した波数でのスピン構造因子 Sᵅ(q)/N", "Structure factors Sᵅ(q)/N at the selected wavevectors"],
    "波矢": ["波数ベクトル", "Wavevector"],
    "整数 (nₓ,nᵧ)": ["整数成分 (nₓ,nᵧ)", "Integer pair (nₓ,nᵧ)"],
    "总计": ["合計", "Total"],
    "保留 Q₁/Q₂ 的实际身份，不按强弱互换。表中为 |ΣᵢSᵢᵅ exp(−iq·rᵢ)|²/N²；下方结构因子图片沿用 plot_results.py 的 Sᵅ(q)=|FFT|²/N 归一化。": ["Q₁ と Q₂ の番号は入力順とし、ピーク強度による並べ替えは行わない。表には |ΣᵢSᵢᵅ exp(−iq·rᵢ)|²/N² を示す。下の図では plot_results.py と同じ規格化 Sᵅ(q)=|FFT|²/N を用いる。", "Q₁ and Q₂ keep their input identities regardless of intensity. The table uses |ΣᵢSᵢᵅ exp(−iq·rᵢ)|²/N². The plots below use the plot_results.py normalization Sᵅ(q)=|FFT|²/N."],
    "实空间构型与局部手性 / 拓扑": ["実空間のスピン配置・局所カイラリティ・トポロジカル電荷", "Real-space texture, local chirality and topology"],
    "结构因子分量": ["スピン構造因子の各成分", "Structure-factor components"],
    "自旋单位球面": ["単位球面上のスピン分布", "Spin directions on the unit sphere"],
    "电子能谱、有效场与力矩": ["電子スペクトル・有効場・トルク", "Electronic spectrum, effective field and torque"],
    "计算快照与数值诊断": ["計算条件と判定の詳細", "Calculation snapshot and numerical diagnostics"],
    "本次计算未完成。{reason}": ["計算を完了できませんでした。{reason}", "Calculation did not finish. {reason}"],
    "无法启动计算程序，请检查页面所需的静态文件。": ["計算プログラムを起動できませんでした。必要なファイルがすべてそろっているか確認してください。", "Could not start the calculation. Check that the required static files are available."],
    "浏览器未能读取计算结果。": ["計算結果を読み込めませんでした。", "The browser could not read the result."],
    "正在准备 {L}×{L} 的单点计算…": ["{L}×{L} 格子での計算を準備しています…", "Preparing a single-point calculation on a {L}×{L} lattice…"],
    "正在加载浏览器数值程序…": ["固有値計算に必要なプログラムを読み込んでいます…", "Loading the browser eigensolver…"],
    "正在计算 {L}×{L} 构型的零温电子谱和有效场…": ["{L}×{L} 格子のスピン配置について、絶対零度での電子スペクトルと有効場を計算しています…", "Computing the zero-temperature spectrum and effective field for the {L}×{L} configuration…"],
    "正在计算结构因子、几何荷与平移原胞…": ["スピン構造因子、トポロジカル電荷、磁気単位胞を求めています…", "Computing structure factors, geometric charge and translation cells…"],
    "本机数值计算完成，用时 {seconds} s。": ["この端末での計算が完了しました（所要時間 {seconds} 秒）。", "Calculation completed on this device in {seconds} s."],
    "已复用相同自旋和电子参数的谱与电子场。": ["スピン配置と電子系のパラメータが前回と同じため、電子スペクトルと電子系がつくる有効場には前回の計算結果を使用しました。", "Reused the spectrum and electronic field for the same spins and electronic parameters."],
    "本次计算已停止。": ["計算を停止しました。", "Calculation stopped."],
    "当前打开的是源码文件。请打开导出的 index.html 或从静态站点运行 ED。": ["ソースファイルを直接開いています。厳密対角化を実行するには、書き出した index.html または公開版のページを開いてください。", "This is the source file. Open the exported index.html or the static site to run ED."],
    "本浏览器缺少后台计算或 WebAssembly 支持，请用现代浏览器打开。": ["このブラウザは Web Worker または WebAssembly に対応していません。対応ブラウザで開いてください。", "This browser lacks Web Worker or WebAssembly support. Open the page in a browser that supports both."],
    "就绪。首次计算将加载静态数值程序。": ["計算できます。初回のみ、対角化に必要なプログラムを読み込みます。", "Ready. The eigensolver will load on the first calculation."],
    "占据边界不可分辨：{count} 个能级满足 |ε−μ| ≤ {threshold}。": ["化学ポテンシャル近傍で占有・非占有を判別できません。{count} 個の準位が |ε−μ| ≤ {threshold} を満たします。", "Unresolved occupation boundary: {count} levels satisfy |ε−μ| ≤ {threshold}."],
    "min|λ|={minimum}，判定容差={threshold}。": ["min|λ| = {minimum}、判定の許容誤差は {threshold} です。", "min|λ|={minimum}; resolution tolerance={threshold}."],
    "请检查浏览器的 WebAssembly 支持和可用内存。": ["ブラウザの WebAssembly 対応状況と空きメモリを確認してください。", "Check WebAssembly support and available browser memory."],
    "格子尺寸应为 4 到 36 的整数。": ["格子サイズは 4 以上 36 以下の整数で指定してください。", "The lattice size must be an integer from 4 to 36."],
    "自旋数组需要 L×L 个三分量自旋。": ["各格子点に3成分のスピンが必要です（計 L×L 個）。", "Expected L×L three-component spins."],
    "格点 {site} 的自旋未通过单位模长检查。": ["格子点 {site} ではスピンの長さと 1 との差が許容誤差を超えています。", "The spin at site {site} failed the unit-length check."],
    "电子参数、磁场和各向异性都必须为有限数值。": ["電子系のパラメータ、磁場、異方性定数にはいずれも有限の値を指定してください。", "Electronic parameters, field and anisotropy must all be finite."],
    "能量超出双精度范围，请检查输入参数。": ["エネルギーが倍精度の表現範囲を超えました。入力パラメータを確認してください。", "Energy exceeds the double-precision range. Check the input parameters."],
    "电子能量或有效场超出双精度范围。": ["電子エネルギーまたは有効場が倍精度の表現範囲を超えました。", "Electronic energy or effective field exceeds the double-precision range."],
    "自旋或场需要 L×L×3 个分量。": ["スピン配列と場の配列には、それぞれ L×L×3 個の成分が必要です。", "Expected L×L×3 spin or field components."],
    "自旋或场含非有限分量。": ["スピンまたは場の成分に有限でない値が含まれています。", "A spin or field component is not finite."],
    "自旋模长与 1 的最大允许偏差为 1e−10。": ["スピンの長さと 1 との差は 1e−10 以下でなければなりません。", "The allowed departure from unit spin length is 1e−10."],
    "需给出零、一或两支基础波矢。": ["基本波数ベクトルは最大2本まで指定できます。", "Supply zero, one or two base wavevectors."],
    "每支波矢必须是两个整数。": ["波数ベクトルは整数の組 (nₓ, nᵧ) で指定してください。", "Each wavevector must be a pair of integers."],
    "基础波矢不能等价于零。": ["逆格子ベクトルを法としてゼロに等しい基本波数ベクトルは指定できません。", "A base wavevector must not be equivalent to zero."],
    "两支基础波矢在周期格子上不能相同或反向相同。": ["逆格子ベクトルの違いを除いて Q₂ = ±Q₁ となる組み合わせは指定できません。", "Base wavevectors cannot be identical or opposite on the periodic lattice."],
    "组合波矢超出可精确表示的整数范围。": ["波数の和または差の成分が、整数として厳密に表せる範囲を超えました。", "A combination wavevector exceeds the exactly representable integer range."],
    "相位原胞数超出可精确表示的整数范围。": ["位相の周期で定まる単位胞の数が、整数として厳密に表せる範囲を超えました。", "The phase-cell count exceeds the exactly representable integer range."],
    "H 和 A 必须为有限值。": ["H と A には有限の値を指定してください。", "H and A must be finite."],
    "经典能量、有效场或力矩超出数值范围。": ["古典スピンのエネルギー、有効場、またはトルクが数値の表現範囲を超えました。", "Classical energy, effective field or torque exceeds the numerical range."],
    "绘图需要有限、已排序的单粒子能级。": ["スペクトルを描くには、有限の一粒子エネルギーが昇順に並んでいる必要があります。", "Plotting requires finite, sorted single-particle levels."],
    "电子本征值非有限或顺序不正确": ["電子の固有エネルギーに有限でない値が含まれているか、値が昇順に並んでいません。", "Electronic eigenvalues are nonfinite or out of order."],
    "浏览器可用内存不足以容纳当前尺寸的哈密顿量": ["このサイズのハミルトニアンを格納するには、ブラウザの空きメモリが足りません。", "The browser has insufficient memory for a Hamiltonian of this size."],
    "哈密顿矩阵超出双精度数值范围": ["ハミルトニアンの要素が倍精度の表現範囲を超えました。", "A Hamiltonian matrix element exceeds the double-precision range."],
    "厄米矩阵本征求解未收敛 (Eigen status {info})": ["エルミート行列の固有値計算が収束しませんでした（Eigen status {info}）。", "The Hermitian eigensolver failed to converge (Eigen status {info})."],
    "厄米矩阵需要有限的复数数组（实虚交错，按列排列）": ["エルミート行列の要素には有限の複素数を指定し、列優先で実部と虚部を交互に格納してください。", "The Hermitian matrix must be a finite column-major array of interleaved real and imaginary parts."],
    "电子计算需要 1 ≤ L ≤ 36 的方形周期晶格": ["電子スペクトルの計算には、周期境界条件を課した 1 ≤ L ≤ 36 の正方格子を指定してください。", "Electronic calculations require a square periodic lattice with 1 ≤ L ≤ 36."],
    "自旋数组应按 [L,L,3] 展平": ["形状 [L,L,3] のスピン配列を1次元に展開してください。", "Flatten the spin array in [L,L,3] order."],
    "当前构型含非法或未归一化自旋": ["スピン配置に無効な値、または長さが 1 に規格化されていないスピンが含まれています。", "The configuration contains invalid or unnormalized spins."],
    "电子参数 {key} 必须是有限数": ["電子パラメータ {key} に有限の数値を指定してください。", "Electronic parameter {key} must be finite."],
    "电子能量或有效场非有限": ["電子エネルギーまたは有効場が有限ではありません。", "Electronic energy or effective field is not finite."],
    "均匀态": ["一様状態", "Uniform state"],
  };
  function tr(zh, fields = {}) {
    const row = messages[zh];
    const localized = row && window.NoteI18n ? window.NoteI18n.pick(zh, row[0], row[1]) : zh;
    return String(localized).replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(fields,name) ? fields[name] : match);
  }
  const electronicKeys = ["t1", "t2", "t3", "t4", "mu", "J"];
  const inputKeys = electronicKeys.concat(["H", "A"]);
  let lastResult = null, lastSignature = "", active = null, worker = null, nextId = 0;
  let statusText = null;
  // Keep only the latest snapshot. Localized PNGs contain baked-in axis and
  // caption text, so reuse them by language when switching back and forth.
  let figureOwner = null;
  const localizedFigures = new Map();
  const status = byId("ed-status"), button = byId("ed-evaluate");
  const stopButton = byId("ed-stop");
  // Resolve against the delivered script, not the hostname root. This also
  // works when a GitHub Pages project is nested under /repo/subdirectory/.
  const embeddedWorker = byId("ed-worker-source");
  let workerUrl = embeddedWorker ? null : new URL("variational-ed/worker.js", document.currentScript.src);

  function number(value) {
    if (value === null || value === undefined || !Number.isFinite(value)) return tr("未定义");
    if (value === 0) return "0";
    return Math.abs(value) < 1e-5 || Math.abs(value) >= 1e6 ? value.toExponential(7) : Number(value.toPrecision(10)).toString();
  }
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = tr(text);
    if (className) node.className = className;
    return node;
  }
  function request() {
    if (!window.variationalLab) throw new Error("构型面板尚未准备好，请刷新页面。");
    const reason = window.variationalLab.validate();
    // The configuration panel displays its detailed, localized validation.
    if (reason) throw new Error("请检查上方构型面板的参数与诊断。");
    const value = window.variationalLab.getRequest();
    const p = {};
    for (const key of inputKeys) {
      const input = byId("ed-" + key);
      if (!input.value.trim() || !Number.isFinite(input.valueAsNumber)) throw new Error(key + " 必须为有限数值。");
      p[key] = input.valueAsNumber;
    }
    value.electronic = Object.fromEntries(electronicKeys.map(key => [key, p[key]]));
    value.H = p.H; value.A = p.A;
    return value;
  }
  function setStatus(message, state) {
    statusText = typeof message === "function" ? message : () => tr(message);
    status.textContent = statusText(); status.dataset.state = state || "";
  }
  function markChanged() {
    if (!lastResult) return;
    let equal = false;
    try { equal = JSON.stringify(request()) === lastSignature; } catch (_) { /* Invalid current controls are also stale. */ }
    const node = byId("ed-snapshot-status");
    node.textContent = tr(equal ? "下列结果对应当前参数。" : "参数已改变：下列结果仍属于上次计算快照，请点击计算更新。");
    node.className = equal ? "ed-small" : "ed-small ed-stale";
  }
  function table(headers, rows) {
    const wrap = element("div", undefined, "ed-table-wrap");
    const t = element("table", undefined, "ed-table"), head = element("thead"), body = element("tbody");
    const tr = element("tr"); headers.forEach(label => tr.append(element("th", label))); head.append(tr);
    rows.forEach(row => { const r = element("tr"); row.forEach(cell => r.append(element("td", String(cell)))); body.append(r); });
    t.append(head, body); wrap.append(t); return wrap;
  }
  function gallery(title, images, open) {
    if (!images.length) return null;
    const detail = element("details"); detail.open = open;
    detail.append(element("summary", title));
    const grid = element("div", undefined, "ed-gallery");
    const labels = {
      spin_x: "Sₓ", spin_y: "Sᵧ", spin_z: "S_z", spin_length: "自旋模长", spin_directions: "实空间自旋方向",
      unit_sphere: "单位球面上的自旋方向", unit_sphere_side2: "球面侧视图 2", unit_sphere_side3: "球面侧视图 3", unit_sphere_top: "球面俯视图",
      structure_factor_x: "Sˣˣ(q)", structure_factor_y: "Sʸʸ(q)", structure_factor_z: "Sᶻᶻ(q)", structure_factor_xy: "Sˣˣ(q) + Sʸʸ(q)", structure_factor_total: "总结构因子 S(q)",
      local_chirality: "四邻居标量手性 χᵢ", topological_charge_density: "每格方几何荷（未通过诊断时未定义）",
      electronic_spectrum: "固定构型的电子谱 λ = ε − μ，λ < 0 占据。H、A 仅进入经典自旋项。", field_z: "有效场 B_z", field_norm: "有效场模长 |B|", torque_norm: "力矩模长 |S × B|"
    };
    for (const item of images) {
      if (typeof item.data_url !== "string" || !item.data_url.startsWith("data:image/png;base64,")) continue;
      const figure = element("figure"), img = element("img"), caption = tr(labels[item.name] || item.name);
      img.src = item.data_url; img.alt = caption; img.loading = open ? "eager" : "lazy";
      const link = element("a"); link.href = item.data_url; link.download = item.name + ".png"; link.append(img);
      figure.append(link, element("figcaption", caption + " · " + tr("点击下载原图"))); grid.append(figure);
    }
    detail.append(grid); return detail;
  }
  function render(result) {
    if (result !== figureOwner) { localizedFigures.clear(); figureOwner = result; }
    const lang = window.NoteI18n?.lang || "zh-CN";
    if (!localizedFigures.has(lang)) localizedFigures.set(lang, window.VariationalFigures.render(result));
    result.images = localizedFigures.get(lang);
    const root = document.createDocumentFragment();
    const e = result.energies, s = result.scalars, top = result.topology_diagnostics, period = result.magnetic_period;
    const stale = element("p", "", "ed-small"); stale.id = "ed-snapshot-status"; root.append(stale);
    const frozen = result.request;
    const kind=frozen.family==="multiq" ? (frozen.parameters.qn.length===1 ? "single" : "double") : frozen.family;
    const namesForFamily=window.VariationalNoteText?.["family."+kind];
    const family=namesForFamily ? (window.NoteI18n?.pick(...namesForFamily) || namesForFamily[0]) :
      (kind==="uniform" ? tr("均匀态") : frozen.family);
    root.append(element("p", tr("计算快照：{family}，{L}×{L}；H={H}，A={A}；{electronic}",{
      family,
      L: frozen.L, H: number(frozen.H), A: number(frozen.A), electronic: electronicKeys.map(k => k + "=" + number(frozen.electronic[k])).join(", ")
    }), "ed-small"));
    const readouts = element("div", undefined, "readouts");
    [["巨势 Ω/N", e.Omega_total_per_site], ["总能量 E/N", e.E_total_per_site], ["电子密度 nₑ", e.electron_density], ["净磁化 ⟨S_z⟩", s.Mz]].forEach(([label, value]) => {
      const dl = element("dl", undefined, "ro"); dl.append(element("dt", label), element("dd", number(value))); readouts.append(dl);
    }); root.append(readouts);
    const tables = element("div", undefined, "ed-tables");
    const energy = element("div"); energy.append(element("h3", "能量分解"));
    energy.append(table(["量", "总量", "每格点"], [
      ["电子巨势 Ω_el", number(e.Omega_el), number(e.Omega_el_per_site)],
      ["电子能量 E_el", number(e.E_el), number(e.E_el_per_site)],
      ["Zeeman −HΣS_z", number(e.E_Z), number(e.E_Z_per_site)],
      ["各向异性 −AΣS_z²", number(e.E_A), number(e.E_A_per_site)],
      ["总巨势 Ω", number(e.Omega_total), number(e.Omega_total_per_site)],
      ["总能量 E", number(e.E_total), number(e.E_total_per_site)],
      ["电子数 Nₑ", number(e.N_e), number(e.electron_density)]
    ]));
    const observable = element("div"); observable.append(element("h3", "当前构型的物理量"));
    observable.append(table(["量", "数值"], [
      ["⟨Sₓ⟩, ⟨Sᵧ⟩", number(s.Mx) + ", " + number(s.My)], ["|⟨S⟩|", number(s.M_norm)],
      ["⟨S_z²⟩", number(s.Kz_per_site)], ["净手性 ⟨χᵢ⟩", number(s.chi_mean)],
      ["平均局部手性幅值 ⟨|χᵢ|⟩", number(s.chi_mean_abs)],
      ["Σq S(q)/N（应为 1）", number(s.S_sum_per_site)], ["力矩 RMS / max", number(s.torque_rms) + " / " + number(s.torque_max)],
      ["有效场 RMS / max", number(s.field_rms) + " / " + number(s.field_max)],
      ["每晶格平移原胞的格点数", number(period.primitive_sites)],
      ["整体诊断通过的 Q_A / Q_B", top.Q_valid ? number(top.Q_A) + " / " + number(top.Q_B) : "—"],
      ["歧义格方数", number(top.Q_ambiguous_plaquettes)]
    ])); tables.append(energy, observable); root.append(tables);
    root.append(element("h3", "同一个格点总荷的两种原胞归一化"));
    const hasPhaseCell = s.n_phase_cells > 0;
    root.append(table(["区域", "归一化分母", "格点几何荷"], [
      ["整个周期格子", "1", number(s.Q_total)],
      ["每个晶格平移原胞", number(period.n_magnetic_cells), number(s.Q_per_magnetic_cell)],
      ["每个连续相位原胞", hasPhaseCell ? "|det n| = " + number(s.n_phase_cells) : "不适用", hasPhaseCell ? number(s.Q_per_phase_cell) : "不适用"]
    ]));
    if (!top.Q_valid) {
      root.append(element("p", "双剖分诊断未通过。总荷、按原胞归一化的荷和拓扑密度均未定义。原始三角形和保存在数值诊断中。", "ed-small ed-stale"));
    } else if (hasPhaseCell) {
      const nearestError = number(s.Q_per_phase_cell_integer_error);
      const tol = number(period.cell_charge_integer_tol);
      const diagnosis = s.Q_per_phase_cell_is_integer
        ? "相位胞读数在容差内接近整数。"
        : "相位胞读数超出整数容差，建议用页首的 2L、4L 加密检查取样密度。";
      root.append(element("p", tr(diagnosis) + " " + tr("与最近整数相差 {distance}，容差 {tolerance}。",{distance:nearestError,tolerance:tol}), s.Q_per_phase_cell_is_integer ? "ed-small" : "ed-small ed-stale"));
    }
    if (!hasPhaseCell) root.append(element("p", "连续相位原胞需要两支线性独立的整数波矢。", "ed-small"));
    root.append(element("h3", "选定波矢处的结构因子 Sᵅ(q)/N"));
    const names = ["Q1", "Q2", "Q1minusQ2", "Q1plusQ2"], qLabels = ["Q₁", "Q₂", "Q₁−Q₂", "Q₁+Q₂"];
    root.append(table(["波矢", "整数 (nₓ,nᵧ)", "x", "y", "z", "xy", "总计"], names.map((key, i) => {
      const q = result.q_vectors[key], v = result.q_values_per_site[key];
      return [qLabels[i], q ? "(" + q.qn.join(", ") + ")" : "未定义", ...["x", "y", "z", "xy", "total"].map(c => number(v[c]))];
    })));
    root.append(element("p", "保留 Q₁/Q₂ 的实际身份，不按强弱互换。表中为 |ΣᵢSᵢᵅ exp(−iq·rᵢ)|²/N²；下方结构因子图片沿用 plot_results.py 的 Sᵅ(q)=|FFT|²/N 归一化。", "ed-small"));
    const images = result.images || [];
    const groups = [
      ["实空间构型与局部手性 / 拓扑", x => /^(spin_|local_chirality|topological_charge)/.test(x.name), true],
      ["结构因子分量", x => x.name.startsWith("structure_factor_"), false],
      ["自旋单位球面", x => x.name.startsWith("unit_sphere"), false],
      ["电子能谱、有效场与力矩", x => /^(electronic_|field_|torque_)/.test(x.name), false]
    ];
    groups.forEach(([title, accept, open]) => { const g = gallery(title, images.filter(accept), open); if (g) root.append(g); });
    const details = element("details"); details.append(element("summary", "计算快照与数值诊断"));
    const audit = {...result}; delete audit.images; delete audit.spectrum; delete audit.arrays;
    details.append(element("pre", JSON.stringify(audit, null, 2), "ed-code")); root.append(details);
    const output = byId("ed-result");
    output.replaceChildren(root); output.hidden = false;
    byId("ed-download").disabled = false;
  }
  function finishJob() {
    active = null;
    button.disabled = false;
    stopButton.disabled = true;
  }
  function destroyWorker() {
    if (worker) worker.terminate();
    worker = null;
  }
  function errorText(message, diagnostics) {
    const diag = Array.isArray(diagnostics) ? diagnostics[0] : diagnostics;
    if (diag && diag.resolved === false) {
      return tr("占据边界不可分辨：{count} 个能级满足 |ε−μ| ≤ {threshold}。",{
        count:diag.unresolved_shell_size, threshold:number(diag.resolution_tolerance)}) + " " +
        tr("min|λ|={minimum}，判定容差={threshold}。",{minimum:number(diag.minimum_abs_eigenvalue),threshold:number(diag.resolution_tolerance)});
    }
    if (Object.hasOwn(messages,message)) return tr(message);
    let m = /^格点 (\d+) 的自旋未通过单位模长检查。$/.exec(message);
    if (m) return tr("格点 {site} 的自旋未通过单位模长检查。",{site:m[1]});
    m = /^厄米矩阵本征求解未收敛 \(Eigen status (.+)\)$/.exec(message);
    if (m) return tr("厄米矩阵本征求解未收敛 (Eigen status {info})",{info:m[1]});
    m = /^电子参数 (\w+) 必须是有限数$/.exec(message);
    if (m) return tr("电子参数 {key} 必须是有限数",{key:m[1]});
    m = /^(\w+) 必须为有限数值。$/.exec(message);
    if (m) return tr("{key} 必须为有限数值。",{key:m[1]});
    // Native JavaScript/WASM failures can depend on the browser. Retain the
    // original diagnostic in the console and display actionable local text.
    return tr("请检查浏览器的 WebAssembly 支持和可用内存。");
  }
  function failJob(message, diagnostics) {
    finishJob();
    if (message) console.warn("ED:", message);
    setStatus(() => tr("本次计算未完成。{reason}",{reason:errorText(message,diagnostics)}), "error");
    markChanged();
  }
  function startWorker() {
    if (embeddedWorker && !workerUrl) {
      workerUrl = URL.createObjectURL(new Blob([embeddedWorker.textContent], {type: "text/javascript"}));
    }
    const instance = new Worker(workerUrl);
    instance.onerror = event => {
      if (worker !== instance) return;
      destroyWorker();
      if (event.message) console.warn("Worker:",event.message);
      failJob("无法启动计算程序，请检查页面所需的静态文件。");
    };
    instance.onmessageerror = () => {
      if (worker !== instance) return;
      destroyWorker(); failJob("浏览器未能读取计算结果。");
    };
    instance.onmessage = ({data}) => {
      if (worker !== instance || !active || data.id !== active.id) return;
      if (data.type === "progress") {
        const stages = {load:"正在加载浏览器数值程序…",electrons:"正在计算 {L}×{L} 构型的零温电子谱和有效场…",
          observables:"正在计算结构因子、几何荷与平移原胞…"};
        setStatus(() => tr(stages[data.stage],{L:data.L}), "busy"); return;
      }
      if (data.type === "error") {
        failJob(data.message,data.diagnostics); return;
      }
      if (data.type !== "result") return;
      try {
        const result = data.result;
        render(result);
        lastResult = result; lastSignature = active.signature;
        finishJob(); markChanged();
        setStatus(() => tr("本机数值计算完成，用时 {seconds} s。",{seconds:number(result.elapsed_seconds)}) +
          (result.cache_hit ? " " + tr("已复用相同自旋和电子参数的谱与电子场。") : ""));
      } catch (error) { failJob(error.message); }
    };
    return instance;
  }
  function calculate(event) {
    event.preventDefault();
    if (active) return;
    try {
      const value = request();
      const spin = new Float64Array(window.variationalLab.getSpin());
      if (!worker) worker = startWorker();
      active = {id: ++nextId, signature: JSON.stringify(value)};
      button.disabled = true; stopButton.disabled = false;
      setStatus(() => tr("正在准备 {L}×{L} 的单点计算…",{L:value.L}), "busy");
      worker.postMessage({id: active.id, request: value, spin}, [spin.buffer]);
    } catch (error) { failJob(error.message); }
  }
  stopButton.addEventListener("click", () => {
    if (!active) return;
    destroyWorker(); finishJob(); markChanged();
    setStatus("本次计算已停止。");
  });
  byId("ed-form").addEventListener("submit", calculate);
  inputKeys.forEach(key => byId("ed-" + key).addEventListener("input", markChanged));
  window.addEventListener("ansatz-change", markChanged);
  window.addEventListener("note-language", () => {
    if (statusText) status.textContent = statusText();
    if (!lastResult) return;
    const output=byId("ed-result"), previous=[...output.querySelectorAll("details")];
    const opened=previous.map(d=>d.open), focused=previous.findIndex(d=>d.querySelector("summary")===document.activeElement);
    const children=[...output.children], anchor=children.findIndex(n=>n.getBoundingClientRect().bottom>0);
    const inView=output.getBoundingClientRect().top<0 && output.getBoundingClientRect().bottom>0;
    const before=inView && anchor>=0 ? children[anchor].getBoundingClientRect().top : null;
    render(lastResult); markChanged();
    const current=[...output.querySelectorAll("details")];
    current.forEach((d,i)=>{ if (i<opened.length) d.open=opened[i]; });
    if (focused>=0) current[focused]?.querySelector("summary")?.focus({preventScroll:true});
    if (before!==null && output.children[anchor]) window.scrollBy(0,output.children[anchor].getBoundingClientRect().top-before);
  });
  byId("ed-download").addEventListener("click", () => {
    if (!lastResult) return;
    const data = {...lastResult}; delete data.images;
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: "application/json"}));
    const link = element("a"); link.href = url; link.download = "variational-single-point.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  if (location.protocol === "file:" && !embeddedWorker) {
    setStatus("当前打开的是源码文件。请打开导出的 index.html 或从静态站点运行 ED。");
  } else if (typeof Worker !== "function" || typeof WebAssembly !== "object") {
    setStatus("本浏览器缺少后台计算或 WebAssembly 支持，请用现代浏览器打开。", "error");
  } else {
    button.disabled = false;
    setStatus("就绪。首次计算将加载静态数值程序。");
  }
})();
