/* Static note text in [简体中文, 日本語, English] order.
 * Formula bodies in MathML stay in the page. A few captions and paragraphs
 * use sub/sup/code for notation, as in the original Chinese text.
 */
window.VariationalNoteText = Object.freeze({
  "page.title": [
    "变分构型参数手册与单点能量计算",
    "スピン配置の変分パラメータとエネルギー計算",
    "Variational spin configurations and single-point energy calculations"
  ],
  "page.heading": [
    "方格变分自旋构型", "正方格子上のスピン配置と変分計算", "Variational spin configurations on a square lattice"
  ],
  "page.language": ["语言", "言語", "Language"],
  "site.back": ["← 返回 LLM for Fun", "← LLM for Fun に戻る", "← Back to LLM for Fun"],
  "site.home": ["主页", "ホーム", "Home"],
  "nav.label": ["页内导航", "目次", "On this page"],
  "nav.preview": ["构型预览", "スピン配置", "Spin preview"],
  "nav.formulas": ["公式与对称性", "数式と対称性", "Formulas and symmetries"],
  "nav.energy": ["单点能量", "エネルギー計算", "Single-point energy"],

  "preview.heading": ["构型预览", "スピン配置のプレビュー", "Spin preview"],
  "preview.lead": [
    "选构型并拖动参数，查看实空间自旋和结构因子。",
    "スピン配置を選び、スライダーで変分パラメータを動かすと、実空間のスピンの向きとスピン構造因子が変化します。",
    "Select a configuration and adjust its parameters to see the real-space spins and the structure factor."
  ],
  "preview.realTitle": ["实空间 · S_z 与面内箭头", "実空間のスピン配置（S_z と面内成分）", "Real space · S_z and in-plane spin directions"],
  "preview.realCaption": [
    "横轴为 a₁，纵轴 a₂ 向上。底色表示归一化后的 S_z；等长箭头表示 (S_x,S_y) 的方向。",
    "横軸は a₁ 方向、縦軸は a₂ 方向で、上向きが正です。色は規格化後の S_z を、長さをそろえた矢印は面内成分 (S_x,S_y) の向きを表します。",
    "The a₁ axis runs horizontally and a₂ increases upward. Color shows S_z after normalization. The equal-length arrows show the direction of (S_x,S_y)."
  ],
  "preview.sfTitle": [
    "结构因子 |S(q)|² · 扩展布里渊区",
    "スピン構造因子 |S(q)|²（拡張ゾーン表示）",
    "Structure factor |S(q)|² · extended Brillouin zone"
  ],
  "preview.sfCaption": [
    "虚线框为第一布里渊区 |q₁|, |q₂| ≤ π，框外为周期重复。预览隐藏 q=0 分量，色标采用 (v/max)<sup>0.32</sup>。当所有 q≠0 分量的谱权重之和不超过全谱权重的 10⁻¹² 时，图中不显示谱强度。",
    "破線で囲んだ領域が第1ブリルアンゾーン |q₁|, |q₂| ≤ π です。枠の外では同じ分布が周期的に繰り返されます。図では q=0 の成分を除き、強度を (v/max)<sup>0.32</sup> で色の濃さに換算します。q≠0 の全成分の強度の和が全波数での強度の和の 10⁻¹² 倍以下なら、強度分布は表示しません。",
    "The dashed square marks the first Brillouin zone, |q₁|, |q₂| ≤ π. The pattern repeats outside it. The preview hides q=0 and scales color as (v/max)<sup>0.32</sup>. It shows no intensity when the summed weight at q≠0 is at most 10⁻¹² of the total weight over all q."
  ],
  "preview.charge": ["晶格几何荷 Q_A / Q_B", "格子上のトポロジカル電荷 Q_A / Q_B", "Lattice geometric charge Q_A / Q_B"],
  "preview.magnetization": ["平均磁化 ⟨S_z⟩", "磁化の z 成分 ⟨S_z⟩", "Mean magnetization ⟨S_z⟩"],
  "preview.normalized": ["归一化后", "規格化後", "After normalization"],
  "preview.axisRatio": ["面内二阶矩轴比", "面内スピンの二次モーメントから求めた軸比", "In-plane second-moment axis ratio"],
  "preview.modePairs": ["显著非零 ±q 模式对", "強度の大きい ±q モード対の数", "Prominent finite-q mode pairs (±q)"],
  "preview.refine": ["加密核验 · 2L / 4L", "格子を細かくして再計算（2L / 4L）", "Check finer grids · 2L / 4L"],
  "preview.refinement": [
    "在同一物理环面上加密取样。连续场是否处处非零还需单独核验。",
    "トーラスの大きさを保ったまま、格子点を増やして再計算します。格子点の間も含めてスピン場がどこでもゼロにならないかは、別途確認が必要です。",
    "Refinement samples the same physical torus more densely. Whether the continuous field has nonzero norm everywhere requires a separate check."
  ],

  "controls.familyLegend": ["构型族 · 当前 spin_generator.py", "スピン配置の種類（spin_generator.py）", "Configuration family · current spin_generator.py"],
  "controls.familyLabel": ["选择参数化", "スピン配置を選択", "Choose a parameterization"],
  "family.single": ["单 Q · multiq", "シングルQ（multiq）", "Single Q · multiq"],
  "family.double": ["双 Q · multiq", "ダブルQ（multiq）", "Double Q · multiq"],
  "family.proper_screw": ["竖直 proper-screw", "プロパースクリュー", "Vertical proper screw"],
  "family.skx2_product": ["乘积谐波 · SkX2", "SkX2（余弦の積）", "Product harmonics · SkX2"],
  "family.gen2q": ["一般双 Q · gen2q", "一般のダブルQ配置（gen2q）", "General double Q · gen2q"],
  "family.conical": ["锥态 · conical", "円錐らせん（conical）", "Conical spiral · conical"],
  "family.vc": ["涡旋 · VC", "渦結晶（VC）", "Vortex crystal · VC"],
  "controls.latticeLegend": ["有限周期格子", "有限格子（周期境界条件）", "Finite periodic lattice"],
  "controls.latticeLabel": ["L × L，a = 1", "格子サイズ L × L（格子間隔 a = 1）", "L × L, a = 1"],
  "controls.latticeHelp": [
    "q = 2π(nₓ,nᵧ)/L。改变 L 时保持整数绕数不变，物理 q 随之改变。“加密核验”则在同一环面上增加取样点数。",
    "波数ベクトルは q = 2π(nₓ,nᵧ)/L です。L を変えると、各方向の巻き数 (nₓ,nᵧ) はそのままで、波数ベクトル q が変わります。一方、「格子を細かくして再計算」では、トーラスの大きさも q も変えずに格子点だけを増やします。",
    "q = 2π(nₓ,nᵧ)/L. Changing L keeps the integer windings fixed and changes the physical q. “Check finer grids” adds sample points on the same torus."
  ],
  "controls.reset": ["恢复当前族的示例参数", "選択した配置のパラメータを初期値に戻す", "Restore this family's example parameters"],
  "controls.request": ["当前 Python 参数", "spin_generator.py の入力パラメータ", "Current Python parameters"],

  "formula.heading": ["构型公式与对称性", "スピン配置の表式と対称性", "Configuration formulas and symmetries"],
  "formula.lead": [
    "手册取 Q<sub>j</sub>=2π(n<sub>jx</sub>/L<sub>x</sub>, n<sub>jy</sub>/L<sub>y</sub>)，φ<sub>j</sub>(r)=Q<sub>j</sub>·r+θ<sub>j</sub>。网页取 L<sub>x</sub>=L<sub>y</sub>=L，格距为 1。原始场 S̃ 逐点归一化为 S=S̃/|S̃|，要求各格点的 |S̃|&gt;0。",
    "波数ベクトルを Q<sub>j</sub>=2π(n<sub>jx</sub>/L<sub>x</sub>, n<sub>jy</sub>/L<sub>y</sub>)、位相を φ<sub>j</sub>(r)=Q<sub>j</sub>·r+θ<sub>j</sub> と書きます。ここでは L<sub>x</sub>=L<sub>y</sub>=L、格子間隔は 1 です。各格子点で S=S̃/|S̃| と規格化するため、すべての格子点で |S̃|&gt;0 が必要です。",
    "The manual uses Q<sub>j</sub>=2π(n<sub>jx</sub>/L<sub>x</sub>, n<sub>jy</sub>/L<sub>y</sub>) and φ<sub>j</sub>(r)=Q<sub>j</sub>·r+θ<sub>j</sub>. Here L<sub>x</sub>=L<sub>y</sub>=L and the lattice spacing is 1. At each site the raw field must satisfy |S̃|&gt;0 so that the unit spin S=S̃/|S̃| is defined."
  ],
  "formula.common": [
    "整格平移 d 使每支相位同时增加 Q<sub>j</sub>·d。电子项、沿 z 的磁场项和 z 轴单离子各向异性项都保留绕 z 轴的全局自旋转动对称性。",
    "格子ベクトル d だけ座標をずらすと、各波の位相に Q<sub>j</sub>·d が加わります。電子項、z 方向の磁場項、z 軸を異方性軸とする単イオン異方性項は、いずれも全スピンを z 軸まわりに一斉に回転しても変わりません。",
    "A translation by a lattice vector d advances each phase by its corresponding Q<sub>j</sub>·d. The electronic term, the field along z and the single-ion anisotropy about z are all invariant under a global spin rotation about z."
  ],
  "formula.skl.name": ["双 Q 叠加", "二つの変調波の重ね合わせ", "Two-wave superposition"],
  "formula.skl.text": [
    "面内振幅均为 1，偏振沿各自的 Q̂<sub>j</sub>，两支共用 a<sub>z</sub>、ψ。m₀ 对应滑块 Mz，是归一化前的偏置。交换两支及其 θ<sub>j</sub> 给出同一构型。zero 固定 ψ=0，generic 改变 ψ，两类都允许 θ₁、θ₂ 变化。",
    "各波の面内成分は Q̂<sub>j</sub> に沿い、その振幅はどちらも 1 です。a<sub>z</sub> と ψ は二つの波に共通です。スライダー Mz で指定する m₀ は、規格化前の一様な z 成分です。位相 θ<sub>j</sub> ごと二つの波を入れ替えても、スピン配置は同じです。zero では ψ=0 に固定し、generic では ψ も変分パラメータに含めます。θ₁ と θ₂ はどちらの場合も独立に選べます。",
    "Both waves have unit in-plane amplitude and are polarized along their respective Q̂<sub>j</sub>. They share a<sub>z</sub> and ψ. The Mz slider sets m₀, the uniform offset before normalization. Exchanging the waves along with their θ<sub>j</sub> leaves every spin unchanged. The zero class fixes ψ=0 and the generic class varies ψ. Both allow θ₁ and θ₂ to vary."
  ],
  "formula.vc.name": ["涡旋晶格", "渦結晶", "Vortex crystal"],
  "formula.vc.text": [
    "θ₁→θ₁+δ 对应整体转动 R<sub>z</sub>(δ)，θ₂ 控制 S<sup>z</sup> 和面内包络。两相位同时加 π 使 S→−S，连续相位胞的净拓扑荷为零。",
    "θ₁→θ₁+δ は、すべてのスピンを R<sub>z</sub>(δ) で回転することに相当します。θ₂ は S<sup>z</sup> と面内成分の振幅を決めます。二つの位相をともに π ずらすと S→−S となるため、各位相を連続的に1周期ずつ動かした領域全体では、トポロジカル電荷はゼロです。",
    "Changing θ₁ to θ₁+δ rotates all spins by R<sub>z</sub>(δ). The second phase θ₂ controls S<sup>z</sup> and the in-plane amplitude envelope. Adding π to both phases sends S to −S, so the net topological charge on a continuous phase cell is zero."
  ],
  "formula.conical.name": ["锥态", "円錐らせん", "Conical spiral"],
  "formula.conical.text": [
    "m<sub>z</sub> 对应滑块 Mz，等于每个格点的 S<sup>z</sup>。任意 θ→θ+δ 都是全局 R<sub>z</sub>(δ)，在有限格子上也严格等能。",
    "スライダー Mz で m<sub>z</sub> を指定します。すべての格子点で S<sup>z</sup>=m<sub>z</sub> です。位相を θ→θ+δ とずらすと、すべてのスピンが R<sub>z</sub>(δ) で回転します。したがって、有限格子でもエネルギーは θ に依存しません。",
    "The Mz slider sets m<sub>z</sub>, equal to S<sup>z</sup> at every site. Any shift θ→θ+δ is a global R<sub>z</sub>(δ) rotation and preserves the energy exactly on a finite lattice."
  ],
  "formula.proper_screw.name": ["竖直螺旋", "プロパースクリュー", "Vertical screw spiral"],
  "formula.proper_screw.text": [
    "a<sub>z</sub>=1、m₀=ψ=0 给出圆螺旋。此时改变 θ 是绕 Q̂ 的整体转动。允许的 Q 满足 Q ≢ −Q（模倒格矢），故圆螺旋的 ⟨S<sup>z</sup>⟩=0、⟨(S<sup>z</sup>)²⟩=½，总巨势与 θ 无关。",
    "a<sub>z</sub>=1、m₀=ψ=0 のとき、スピンは Q̂ に垂直な面内で円を描き、θ の変化は Q̂ まわりのスピンの一斉回転に相当します。ここでは Q と −Q は逆格子ベクトルを法として異なるので、格子平均は ⟨S<sup>z</sup>⟩=0、⟨(S<sup>z</sup>)²⟩=½ となります。したがって、系全体のグランドポテンシャルは θ に依存しません。",
    "At a<sub>z</sub>=1 and m₀=ψ=0 the spiral is circular. Changing θ then rotates all spins about Q̂. The allowed Q is distinct from −Q modulo a reciprocal lattice vector, so ⟨S<sup>z</sup>⟩=0 and ⟨(S<sup>z</sup>)²⟩=½ for this spiral. Its total grand potential is independent of θ."
  ],
  "formula.skx2_product.name": ["乘积谐波 SkX2", "余弦の積を含む SkX2", "Product-harmonic SkX2"],
  "formula.skx2_product.text": [
    "Q₁、Q₂ 正交等长，前两分量沿固定的自旋 x、y 轴。给 φ₁ 或 φ₂ 单独加 π 分别对应 R<sub>y</sub>(π) 或 R<sub>x</sub>(π)，都会翻转 S<sup>z</sup>。同时加 π 对应 R<sub>z</sub>(π)。取物理 x、y 为正向，连续纹理的整环面荷为 2 det n，其中 n 的两行是整数波矢。",
    "Q₁ と Q₂ は長さが等しく、互いに直交します。式の第1、第2成分はスピン空間の固定した x 軸と y 軸に沿います。φ₁ だけを π ずらすと R<sub>y</sub>(π)、φ₂ だけを π ずらすと R<sub>x</sub>(π) の回転に相当し、いずれも S<sup>z</sup> の符号が反転します。両方を π ずらすと R<sub>z</sub>(π) の回転になります。実空間の向きを (x,y) の順に取ると、連続場のトポロジカル電荷はトーラス全体で 2 det n です。行列 n の各行は、Q₁、Q₂ を表す整数の組です。",
    "Q₁ and Q₂ are orthogonal and have equal length. The first two spin components lie along the fixed spin x and y axes. Adding π to φ₁ alone gives R<sub>y</sub>(π), while adding π to φ₂ alone gives R<sub>x</sub>(π). Each reverses S<sup>z</sup>. Adding π to both gives R<sub>z</sub>(π). With positive real-space orientation (x,y), the continuous texture has charge 2 det n on the full torus, where the rows of n are the integer wavevectors."
  ],
  "formula.gen2q.name": ["一般双 Q", "一般のダブルQ配置", "General double Q"],
  "formula.gen2q.text": [
    "a=1,2,3 分别对应 x,y,z。网页的六个 θ 滑块对应 ϑ₁…ϑ₆。α₁、α₂ 是两支各自的共同相位，d 是支内相对相位。交换完整波支给出相同自旋。振幅整体乘正数也给出相同自旋，因此固定 Q 生成器取 Σcⱼ²=1。",
    "添字 a=1,2,3 は順に x,y,z 成分を表します。六つの θ スライダーは ϑ₁…ϑ₆ に対応します。α₁ と α₂ は各波の三成分に共通の位相、d は同じ波の成分間の位相差です。二つの波をパラメータごと入れ替えても、スピン配置は変わりません。また、すべての振幅を同じ正の定数倍にしても、規格化後のスピンは同じです。このため、Q を固定して候補を生成する際は Σcⱼ²=1 とします。",
    "a=1,2,3 denotes x,y,z, respectively. The six θ sliders set ϑ₁…ϑ₆. For each wave, α₁ or α₂ sets the common phase of its three components, and the d parameters set their relative phases. Swapping the two waves with all their parameters leaves every spin unchanged. A common positive rescaling of all amplitudes also leaves the spins unchanged, so the fixed-Q generator uses Σcⱼ²=1."
  ],
  "formula.multiq.name": ["交互区的通用单 Q / 双 Q（multiq）", "プレビューで用いるシングルQ・ダブルQの変分式（multiq）", "General single-Q and double-Q forms in the preview (multiq)"],
  "formula.multiq.text": [
    "n<sub>Q</sub>=1 或 2，ê<sub>j</sub>=R<sub>z</sub>(γ<sub>j</sub>)Q̂<sub>j</sub>。所有 γ<sub>j</sub> 同加 δ 是全局 R<sub>z</sub>(δ)。在“双 Q · multiq”中取 a<sub>⊥j</sub>=1、γ<sub>j</sub>=0，两支共用 a<sub>z</sub> 和 ψ，就得到上面的 skl。固定 Q 库按上述六族采样，另有 S(r)=±e<sub>x</sub>、±e<sub>y</sub>、±e<sub>z</sub> 六个均匀参考态。",
    "波の数は n<sub>Q</sub>=1 または 2 で、ê<sub>j</sub>=R<sub>z</sub>(γ<sub>j</sub>)Q̂<sub>j</sub> とします。すべての γ<sub>j</sub> に同じ δ を加えると、全スピンが R<sub>z</sub>(δ) で回転します。「ダブルQ（multiq）」で各波の a<sub>⊥j</sub>=1、γ<sub>j</sub>=0 とし、二つの波に共通の a<sub>z</sub> と ψ を使うと、上の skl に帰着します。Q を固定した変分計算では、上記の6種類に加えて、S(r)=±e<sub>x</sub>、±e<sub>y</sub>、±e<sub>z</sub> の6通りの一様なスピン配置を比較に用います。",
    "Here n<sub>Q</sub>=1 or 2 and ê<sub>j</sub>=R<sub>z</sub>(γ<sub>j</sub>)Q̂<sub>j</sub>. Adding δ to every γ<sub>j</sub> rotates all spins by R<sub>z</sub>(δ). To recover skl in “Double Q · multiq”, use a<sub>⊥j</sub>=1 and γ<sub>j</sub>=0 for both waves and give them the same a<sub>z</sub> and ψ. The fixed-Q library samples the six families above and includes six uniform reference states, S(r)=±e<sub>x</sub>, ±e<sub>y</sub>, ±e<sub>z</sub>."
  ],

  "ed.heading": ["单点能量与物理量", "選択したスピン配置のエネルギーと物理量", "Energy and observables at one parameter point"],
  "ed.lead": [
    "填入参数后点击计算。电子对角化在这台设备的浏览器中运行，36×36 对应 2592 个电子能级。",
    "パラメータを入力して計算ボタンを押すと、この端末のブラウザで電子ハミルトニアンを対角化します。36×36 格子の場合、電子のエネルギー準位は 2,592 個です。",
    "Enter the parameters and click Calculate to diagonalize the electronic Hamiltonian in your browser. A 36×36 lattice has 2,592 electronic levels."
  ],
  "ed.t1": ["t₁ · 最近邻", "t₁（最近接ホッピング）", "t₁ · nearest neighbors"],
  "ed.t2": ["t₂ · 距离 √2", "t₂（距離 √2 のホッピング）", "t₂ · distance √2"],
  "ed.t3": ["t₃ · 距离 2", "t₃（距離 2 のホッピング）", "t₃ · distance 2"],
  "ed.t4": ["t₄ · 距离 √5", "t₄（距離 √5 のホッピング）", "t₄ · distance √5"],
  "ed.mu": ["μ · 化学势", "μ（化学ポテンシャル）", "μ · chemical potential"],
  "ed.J": ["J · Hund 耦合", "J（フント結合）", "J · Hund coupling"],
  "ed.H": ["H · 磁场的 z 分量", "H（磁場の z 成分）", "H · z component of the magnetic field"],
  "ed.A": ["A · 单离子各向异性", "A（単イオン異方性）", "A · single-ion anisotropy"],
  "ed.calculate": ["计算当前构型", "この配置のエネルギーを計算", "Calculate this configuration"],
  "ed.download": ["导出本次数值 JSON", "計算結果を JSON 形式で保存", "Export numerical results (JSON)"],
  "ed.stop": ["停止计算", "計算を停止", "Stop calculation"],
  "ed.conventions": ["能量约定", "エネルギーの定義", "Energy conventions"],
  "ed.occupation": [
    "T=0 时，电子占据 λ=ε−μ&lt;0 的能级。固定 μ 时，用巨势 Ω 比较构型。总量除以格点数 N=L² 得到每格点量。",
    "T=0 では、電子は λ=ε−μ&lt;0 の準位を占有します。μ を固定してスピン配置を比較するときは、グランドポテンシャル Ω を用います。格子点あたりの値は、系全体の値を格子点数 N=L² で割って求めます。",
    "At T=0 the occupied levels satisfy λ=ε−μ&lt;0. At fixed μ, compare configurations using the grand potential Ω. Divide each total by the number of sites N=L² to obtain its per-site value."
  ],
  "ed.solver": [
    "程序根据输入波矢寻找沿格轴的较小矩形胞。若该胞逐点重复后与整格自旋完全一致，就对角化有限环面的全部 Bloch 扇区；否则直接对角化整格矩阵。",
    "入力した波数ベクトルから、格子軸に沿った小さな長方形の単位胞を求めます。その単位胞を繰り返して各格子点のスピンが厳密に再現される場合は、周期境界条件で許されるすべてのブロッホ波数について対角化します。それ以外は格子全体を対角化します。",
    "The input wavevectors determine a candidate rectangular cell aligned with the lattice axes. If this cell is smaller than the lattice and its repetitions match every spin exactly, the solver diagonalizes all Bloch sectors allowed on the finite torus. Otherwise it diagonalizes the full lattice Hamiltonian."
  ]
});
