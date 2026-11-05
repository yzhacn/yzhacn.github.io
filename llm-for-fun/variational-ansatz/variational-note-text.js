/* Static note text in [简体中文, 日本語, English] order.
 * Formula bodies in MathML stay in the page. A few captions and paragraphs
 * use sub/sup/code for notation, as in the original Chinese text.
 */
window.VariationalNoteText = Object.freeze({
  "page.title": [
    "变分构型参数手册与单点能量计算",
    "変分スピン配位のパラメータとエネルギー計算",
    "Variational spin configurations and single-point energy calculations"
  ],
  "page.heading": [
    "方格变分自旋构型", "正方格子の変分スピン配位", "Variational spin configurations on a square lattice"
  ],
  "page.language": ["语言", "言語", "Language"],
  "site.back": ["← 返回 LLM for Fun", "← LLM for Fun に戻る", "← Back to LLM for Fun"],
  "site.home": ["主页", "ホーム", "Home"],
  "nav.label": ["页内导航", "ページ内ナビゲーション", "On this page"],
  "nav.preview": ["构型预览", "スピン配位のプレビュー", "Spin preview"],
  "nav.formulas": ["公式与对称性", "数式と対称性", "Formulas and symmetries"],
  "nav.energy": ["单点能量", "指定点のエネルギー", "Single-point energy"],

  "preview.heading": ["构型预览", "スピン配位のプレビュー", "Spin preview"],
  "preview.lead": [
    "选构型并拖动参数，查看实空间自旋和结构因子。",
    "配位を選び、スライダーでパラメータを変えると、実空間のスピンと構造因子を確認できます。",
    "Select a configuration and adjust its parameters to see the real-space spins and the structure factor."
  ],
  "preview.realTitle": ["实空间 · S_z 与面内箭头", "実空間 · S_z と面内スピンの向き", "Real space · S_z and in-plane spin directions"],
  "preview.realCaption": [
    "横轴为 a₁，纵轴 a₂ 向上。底色表示归一化后的 S_z；等长箭头表示 (S_x,S_y) 的方向。",
    "横軸は a₁、縦軸は上向きに a₂ をとります。背景色は規格化後の S_z、一定長の矢印は面内成分 (S_x,S_y) の向きを示します。",
    "The a₁ axis runs horizontally and a₂ increases upward. Color shows S_z after normalization. The equal-length arrows show the direction of (S_x,S_y)."
  ],
  "preview.sfTitle": [
    "结构因子 |S(q)|² · 扩展布里渊区",
    "構造因子 |S(q)|² · 拡張ブリルアンゾーン",
    "Structure factor |S(q)|² · extended Brillouin zone"
  ],
  "preview.sfCaption": [
    "虚线框为第一布里渊区 |q₁|, |q₂| ≤ π，框外为周期复制像。预览将 q=0 置零，色标采用 (v/max)<sup>0.32</sup>。近均匀态的非零波矢谱权重低于显示阈值时，图中留白。",
    "破線の枠は第1ブリルアンゾーン |q₁|, |q₂| ≤ π を示し、枠外には周期像を表示します。プレビューでは q=0 の値をゼロにし、色の強度を (v/max)<sup>0.32</sup> で表示します。一様状態に近く、有限波数の強度が表示閾値を下回る場合は空白になります。",
    "The dashed square marks the first Brillouin zone, |q₁|, |q₂| ≤ π. Outside it, the pattern repeats periodically. The preview sets q=0 to zero and scales color as (v/max)<sup>0.32</sup>. A nearly uniform state gives a blank map when all finite-q intensities fall below the display threshold."
  ],
  "preview.charge": ["晶格几何荷 Q_A / Q_B", "格子の幾何学的電荷 Q_A / Q_B", "Lattice geometric charge Q_A / Q_B"],
  "preview.magnetization": ["平均磁化 ⟨S_z⟩", "平均磁化 ⟨S_z⟩", "Mean magnetization ⟨S_z⟩"],
  "preview.normalized": ["归一化后", "規格化後", "After normalization"],
  "preview.axisRatio": ["面内二阶矩轴比", "面内二次モーメントの軸比", "In-plane second-moment axis ratio"],
  "preview.modePairs": ["显著非零 ±q 模式对", "閾値以上の有限波数 ±q のモード対", "Prominent finite-q mode pairs (±q)"],
  "preview.refine": ["加密核验 · 2L / 4L", "細分格子で検証 · 2L / 4L", "Check finer grids · 2L / 4L"],
  "preview.refinement": [
    "在同一物理环面上加密取样。连续场是否处处非零还需单独核验。",
    "同じ物理的なトーラス上で格子を細分します。連続場のノルムが全点で非零かどうかは別に確認する必要があります。",
    "Refinement samples the same physical torus more densely. Whether the continuous field has nonzero norm everywhere requires a separate check."
  ],

  "controls.familyLegend": ["构型族 · 当前 spin_generator.py", "配位の種類 · 現行の spin_generator.py", "Configuration family · current spin_generator.py"],
  "controls.familyLabel": ["选择参数化", "パラメータ表示を選択", "Choose a parameterization"],
  "family.single": ["单 Q · multiq", "単一 Q · multiq", "Single Q · multiq"],
  "family.double": ["双 Q · multiq", "二重 Q · multiq", "Double Q · multiq"],
  "family.proper_screw": ["竖直 proper-screw", "鉛直面内のプロパースクリュー", "Vertical proper screw"],
  "family.skx2_product": ["乘积谐波 · SkX2", "積型高調波 · SkX2", "Product harmonics · SkX2"],
  "family.gen2q": ["一般双 Q · gen2q", "一般の二重 Q · gen2q", "General double Q · gen2q"],
  "family.conical": ["锥态 · conical", "円錐状態 · conical", "Conical spiral · conical"],
  "family.vc": ["涡旋 · VC", "渦結晶 · VC", "Vortex crystal · VC"],
  "controls.latticeLegend": ["有限周期格子", "周期境界条件の有限格子", "Finite periodic lattice"],
  "controls.latticeLabel": ["L × L，a = 1", "L × L、a = 1", "L × L, a = 1"],
  "controls.latticeHelp": [
    "q = 2π(nₓ,nᵧ)/L。改变 L 时保持整数绕数不变，物理 q 随之改变。“加密核验”则在同一环面上增加取样点数。",
    "q = 2π(nₓ,nᵧ)/L。L を変更すると整数の巻き数は保たれ、物理的な波数 q が変わります。「細分格子で検証」では同じトーラスの格子点数だけを増やします。",
    "q = 2π(nₓ,nᵧ)/L. Changing L keeps the integer windings fixed and changes the physical q. “Check finer grids” adds sample points on the same torus."
  ],
  "controls.reset": ["恢复当前族的示例参数", "この配位のパラメータを初期値に戻す", "Restore this family's example parameters"],
  "controls.request": ["当前 Python 参数", "現在の Python パラメータ", "Current Python parameters"],

  "formula.heading": ["构型公式与对称性", "スピン配位の数式と対称性", "Configuration formulas and symmetries"],
  "formula.lead": [
    "手册取 Q<sub>j</sub>=2π(n<sub>jx</sub>/L<sub>x</sub>, n<sub>jy</sub>/L<sub>y</sub>)，φ<sub>j</sub>(r)=Q<sub>j</sub>·r+θ<sub>j</sub>。网页取 L<sub>x</sub>=L<sub>y</sub>=L，格距为 1。原始场 S̃ 逐点归一化为 S=S̃/|S̃|，要求各格点的 |S̃|&gt;0。",
    "マニュアルでは Q<sub>j</sub>=2π(n<sub>jx</sub>/L<sub>x</sub>, n<sub>jy</sub>/L<sub>y</sub>)、φ<sub>j</sub>(r)=Q<sub>j</sub>·r+θ<sub>j</sub> と書きます。このページでは L<sub>x</sub>=L<sub>y</sub>=L、格子間隔は 1 とします。各格子点で |S̃|&gt;0 を確認し、スピン場を S=S̃/|S̃| と規格化します。",
    "The manual uses Q<sub>j</sub>=2π(n<sub>jx</sub>/L<sub>x</sub>, n<sub>jy</sub>/L<sub>y</sub>) and φ<sub>j</sub>(r)=Q<sub>j</sub>·r+θ<sub>j</sub>. Here L<sub>x</sub>=L<sub>y</sub>=L and the lattice spacing is 1. At each site the raw field must satisfy |S̃|&gt;0 so that the unit spin S=S̃/|S̃| is defined."
  ],
  "formula.common": [
    "整格平移 d 使每支相位同时增加 Q<sub>j</sub>·d。电子项、沿 z 的磁场项和 z 轴单离子各向异性项都保留绕 z 轴的全局自旋转动对称性。",
    "格子ベクトル d だけ平行移動すると、各成分の位相はそれぞれ Q<sub>j</sub>·d だけ進みます。電子項、z 方向の磁場項、z 軸に関する単イオン異方性項は、いずれも z 軸まわりの一様なスピン回転に対して不変です。",
    "A translation by a lattice vector d advances each phase by its corresponding Q<sub>j</sub>·d. The electronic term, the field along z and the single-ion anisotropy about z are all invariant under a global spin rotation about z."
  ],
  "formula.skl.name": ["双 Q 叠加", "二つの Q の重ね合わせ", "Two-wave superposition"],
  "formula.skl.text": [
    "面内振幅均为 1，偏振沿各自的 Q̂<sub>j</sub>，两支共用 a<sub>z</sub>、ψ。m₀ 对应滑块 Mz，是归一化前的偏置。交换两支及其 θ<sub>j</sub> 给出同一构型。zero 固定 ψ=0，generic 改变 ψ，两类都允许 θ₁、θ₂ 变化。",
    "二つの波の面内振幅はいずれも 1 で、偏極方向はそれぞれの Q̂<sub>j</sub> に平行です。a<sub>z</sub> と ψ は共通です。スライダー Mz は規格化前の一様成分 m₀ を表します。二つの波を各 θ<sub>j</sub> とともに入れ替えても配位は同じです。zero では ψ=0 に固定し、generic では ψ を変化させます。θ₁、θ₂ はどちらでも変えられます。",
    "Both waves have unit in-plane amplitude and are polarized along their respective Q̂<sub>j</sub>. They share a<sub>z</sub> and ψ. The Mz slider sets m₀, the uniform offset before normalization. Exchanging the waves along with their θ<sub>j</sub> leaves every spin unchanged. The zero class fixes ψ=0 and the generic class varies ψ. Both allow θ₁ and θ₂ to vary."
  ],
  "formula.vc.name": ["涡旋晶格", "渦結晶", "Vortex crystal"],
  "formula.vc.text": [
    "θ₁→θ₁+δ 对应整体转动 R<sub>z</sub>(δ)，θ₂ 控制 S<sup>z</sup> 和面内包络。两相位同时加 π 使 S→−S，连续相位胞的净拓扑荷为零。",
    "θ₁→θ₁+δ は全スピンの回転 R<sub>z</sub>(δ) に対応します。θ₂ は S<sup>z</sup> と面内成分の包絡を決めます。両方の位相に π を加えると S→−S となり、連続的な位相の単位胞あたりの正味のトポロジカル電荷はゼロです。",
    "Changing θ₁ to θ₁+δ rotates all spins by R<sub>z</sub>(δ). The second phase θ₂ controls S<sup>z</sup> and the in-plane amplitude envelope. Adding π to both phases sends S to −S, so the net topological charge on a continuous phase cell is zero."
  ],
  "formula.conical.name": ["锥态", "円錐状態", "Conical spiral"],
  "formula.conical.text": [
    "m<sub>z</sub> 对应滑块 Mz，等于每个格点的 S<sup>z</sup>。任意 θ→θ+δ 都是全局 R<sub>z</sub>(δ)，在有限格子上也严格等能。",
    "スライダー Mz は m<sub>z</sub> を設定し、すべての格子点で S<sup>z</sup>=m<sub>z</sub> です。任意の位相変化 θ→θ+δ は全スピンの回転 R<sub>z</sub>(δ) に対応し、有限格子上でもエネルギーは厳密に等しくなります。",
    "The Mz slider sets m<sub>z</sub>, equal to S<sup>z</sup> at every site. Any shift θ→θ+δ is a global R<sub>z</sub>(δ) rotation and preserves the energy exactly on a finite lattice."
  ],
  "formula.proper_screw.name": ["竖直螺旋", "鉛直面内のらせん", "Vertical screw spiral"],
  "formula.proper_screw.text": [
    "a<sub>z</sub>=1、m₀=ψ=0 给出圆螺旋。此时改变 θ 是绕 Q̂ 的整体转动。允许的 Q 满足 Q ≢ −Q（模倒格矢），故圆螺旋的 ⟨S<sup>z</sup>⟩=0、⟨(S<sup>z</sup>)²⟩=½，总巨势与 θ 无关。",
    "a<sub>z</sub>=1、m₀=ψ=0 では円らせんとなり、θ の変化は Q̂ まわりの全スピンの回転に対応します。許容される Q は逆格子ベクトルを法として −Q と異なるため、円らせんでは ⟨S<sup>z</sup>⟩=0、⟨(S<sup>z</sup>)²⟩=½ です。全グランドポテンシャルは θ に依存しません。",
    "At a<sub>z</sub>=1 and m₀=ψ=0 the spiral is circular. Changing θ then rotates all spins about Q̂. The allowed Q is distinct from −Q modulo a reciprocal lattice vector, so ⟨S<sup>z</sup>⟩=0 and ⟨(S<sup>z</sup>)²⟩=½ for this spiral. Its total grand potential is independent of θ."
  ],
  "formula.skx2_product.name": ["乘积谐波 SkX2", "積型高調波 SkX2", "Product-harmonic SkX2"],
  "formula.skx2_product.text": [
    "Q₁、Q₂ 正交等长，前两分量沿固定的自旋 x、y 轴。给 φ₁ 或 φ₂ 单独加 π 分别对应 R<sub>y</sub>(π) 或 R<sub>x</sub>(π)，都会翻转 S<sup>z</sup>。同时加 π 对应 R<sub>z</sub>(π)。取物理 x、y 为正向，连续纹理的整环面荷为 2 det n，其中 n 的两行是整数波矢。",
    "Q₁ と Q₂ は直交し、長さが等しいベクトルです。最初の二成分はスピン空間に固定した x、y 軸に沿います。φ₁ または φ₂ の片方に π を加えると、それぞれ R<sub>y</sub>(π)、R<sub>x</sub>(π) により S<sup>z</sup> の符号が反転します。両方に加えると R<sub>z</sub>(π) になります。実空間の x、y の順を正の向きとすると、連続スピン構造のトーラス全体の電荷は 2 det n です。n の各行は整数波数ベクトルです。",
    "Q₁ and Q₂ are orthogonal and have equal length. The first two spin components lie along the fixed spin x and y axes. Adding π to φ₁ alone gives R<sub>y</sub>(π), while adding π to φ₂ alone gives R<sub>x</sub>(π). Each reverses S<sup>z</sup>. Adding π to both gives R<sub>z</sub>(π). With positive real-space orientation (x,y), the continuous texture has charge 2 det n on the full torus, where the rows of n are the integer wavevectors."
  ],
  "formula.gen2q.name": ["一般双 Q", "一般の二重 Q", "General double Q"],
  "formula.gen2q.text": [
    "a=1,2,3 分别对应 x,y,z。网页的六个 θ 滑块对应 ϑ₁…ϑ₆。α₁、α₂ 是两支各自的共同相位，d 是支内相对相位。交换完整波支给出相同自旋。振幅整体乘正数也给出相同自旋，因此固定 Q 生成器取 Σcⱼ²=1。",
    "a=1,2,3 は順に x,y,z を表します。六つの θ スライダーは ϑ₁…ϑ₆ に対応します。α₁、α₂ は各波の三成分に共通する位相、d は同じ波の成分間の相対位相です。パラメータごと二つの波を入れ替えても、全振幅を同じ正の数倍にしても、各スピンは変わりません。このため固定 Q の生成器では Σcⱼ²=1 とします。",
    "a=1,2,3 denotes x,y,z, respectively. The six θ sliders set ϑ₁…ϑ₆. For each wave, α₁ or α₂ sets the common phase of its three components, and the d parameters set their relative phases. Swapping the two waves with all their parameters leaves every spin unchanged. A common positive rescaling of all amplitudes also leaves the spins unchanged, so the fixed-Q generator uses Σcⱼ²=1."
  ],
  "formula.multiq.name": ["交互区的通用单 Q / 双 Q（multiq）", "プレビューで使う一般の単一 Q・二重 Q（multiq）", "General single-Q and double-Q forms in the preview (multiq)"],
  "formula.multiq.text": [
    "n<sub>Q</sub>=1 或 2，ê<sub>j</sub>=R<sub>z</sub>(γ<sub>j</sub>)Q̂<sub>j</sub>。所有 γ<sub>j</sub> 同加 δ 是全局 R<sub>z</sub>(δ)。在“双 Q · multiq”中取 a<sub>⊥j</sub>=1、γ<sub>j</sub>=0，两支共用 a<sub>z</sub> 和 ψ，就得到上面的 skl。固定 Q 库按上述六族采样，另有 S(r)=±e<sub>x</sub>、±e<sub>y</sub>、±e<sub>z</sub> 六个均匀参考态。",
    "n<sub>Q</sub>=1 または 2 で、ê<sub>j</sub>=R<sub>z</sub>(γ<sub>j</sub>)Q̂<sub>j</sub> です。すべての γ<sub>j</sub> に δ を加えると、全スピンが R<sub>z</sub>(δ) だけ回転します。「二重 Q · multiq」で a<sub>⊥j</sub>=1、γ<sub>j</sub>=0 とし、二つの波で同じ a<sub>z</sub>、ψ を使うと上の skl が得られます。固定 Q の候補には上記の六種類に加え、S(r)=±e<sub>x</sub>、±e<sub>y</sub>、±e<sub>z</sub> の六つの一様な参照状態があります。",
    "Here n<sub>Q</sub>=1 or 2 and ê<sub>j</sub>=R<sub>z</sub>(γ<sub>j</sub>)Q̂<sub>j</sub>. Adding δ to every γ<sub>j</sub> rotates all spins by R<sub>z</sub>(δ). To recover skl in “Double Q · multiq”, use a<sub>⊥j</sub>=1 and γ<sub>j</sub>=0 for both waves and give them the same a<sub>z</sub> and ψ. The fixed-Q library samples the six families above and includes six uniform reference states, S(r)=±e<sub>x</sub>, ±e<sub>y</sub>, ±e<sub>z</sub>."
  ],

  "ed.heading": ["单点能量与物理量", "指定点のエネルギーと物理量", "Energy and observables at one parameter point"],
  "ed.lead": [
    "填入参数后点击计算。电子对角化在这台设备的浏览器中运行，36×36 对应 2592 个电子能级。",
    "パラメータを入力して計算ボタンを押すと、この端末のブラウザーで電子ハミルトニアンを対角化します。36×36 の格子には 2,592 個の電子準位があります。",
    "Enter the parameters and click Calculate to diagonalize the electronic Hamiltonian in your browser. A 36×36 lattice has 2,592 electronic levels."
  ],
  "ed.t1": ["t₁ · 最近邻", "t₁ · 最近接", "t₁ · nearest neighbors"],
  "ed.t2": ["t₂ · 距离 √2", "t₂ · 距離 √2", "t₂ · distance √2"],
  "ed.t3": ["t₃ · 距离 2", "t₃ · 距離 2", "t₃ · distance 2"],
  "ed.t4": ["t₄ · 距离 √5", "t₄ · 距離 √5", "t₄ · distance √5"],
  "ed.mu": ["μ · 化学势", "μ · 化学ポテンシャル", "μ · chemical potential"],
  "ed.J": ["J · Hund 耦合", "J · フント結合", "J · Hund coupling"],
  "ed.H": ["H · 沿 +z 的磁场", "H · +z 方向の磁場", "H · field along +z"],
  "ed.A": ["A · 单离子各向异性", "A · 単イオン異方性", "A · single-ion anisotropy"],
  "ed.calculate": ["计算当前构型", "現在の配位を計算", "Calculate this configuration"],
  "ed.download": ["导出本次数值 JSON", "計算結果を JSON で保存", "Export numerical results (JSON)"],
  "ed.stop": ["停止计算", "計算を停止", "Stop calculation"],
  "ed.conventions": ["能量约定", "エネルギーの定義", "Energy conventions"],
  "ed.occupation": [
    "T=0，电子占据 λ=ε−μ&lt;0 的能级。固定 μ 时比较巨势 Ω，每格点量除以 N=L²。",
    "T=0 では λ=ε−μ&lt;0 の準位を占有します。μ を固定した比較にはグランドポテンシャル Ω を用い、格子点あたりの量は N=L² で割って求めます。",
    "At T=0 the occupied levels satisfy λ=ε−μ&lt;0. At fixed μ, compare the grand potential Ω. Divide totals by N=L² for per-site values."
  ],
  "ed.solver": [
    "若自旋在格点上严格周期性重复，程序计算有限环面上全部允许的 Bloch 扇区。否则直接对角化整格矩阵，耗时随格子和设备而变。",
    "スピン配位が格子上で厳密に繰り返す場合は、有限トーラスで許されるすべてのブロッホ波数セクターを計算します。それ以外の場合は格子全体の行列を直接対角化します。計算時間は格子の大きさと端末によって異なります。",
    "If the spins repeat exactly on the lattice, the calculation includes every Bloch sector allowed on the finite torus. Otherwise it diagonalizes the full lattice matrix. Runtime depends on the lattice size and the device."
  ]
});
