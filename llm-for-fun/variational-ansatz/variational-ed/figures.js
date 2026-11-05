/* Single-point PNGs corresponding to tools/fixedq_variational/plot_render.py.
 * Numerical inputs stay in [x][y] order. Only the rendered FFT image repeats
 * its periodic edge. All coordinates below are logical canvas pixels. */
(() => {
  "use strict";
  const tr=(zh,ja,en)=>window.NoteI18n ? window.NoteI18n.pick(zh,ja,en) : zh;

  const W = 720, H = 630, dpiScale = 1.4;
  const plot = {left: 80, top: 72, side: 444};
  const ink = "#27364b", muted = "#59677b", rule = "#8894a3", missing = [230, 235, 240];
  const stops = {
    signed: ["#053061","#2166ac","#4393c3","#92c5de","#d1e5f0","#f7f7f7","#fddbc7","#f4a582","#d6604d","#b2182b","#67001f"],
    positive: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],
    length: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],
    angle: ["#cf3030","#ed7043","#f5b65a","#c7d969","#90ce98","#46a5c4","#3d5fa9"]
  };
  function palette(hexColors) {
    const stopsRGB = hexColors.map(hex => [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)));
    return Array.from({length:256}, (_, i) => {
      const p = i*(stopsRGB.length-1)/255, left = Math.floor(p), right = Math.min(left+1,stopsRGB.length-1);
      return stopsRGB[left].map((x,k) => Math.round(x+(p-left)*(stopsRGB[right][k]-x)));
    });
  }
  const colors = Object.fromEntries(Object.entries(stops).map(([key,stops]) => [key,palette(stops)]));
  const clamp = (value, lo, hi) => Math.min(hi,Math.max(lo,value));
  const rgb = color => "rgb("+color.join(",")+")";
  const fmt = n => {
    if (!Number.isFinite(n)) return tr("未定义","未定義","Undefined");
    if (n===0) return "0";
    return Math.abs(n)<1e-3 || Math.abs(n)>=1e4 ? n.toExponential(2) : String(Number(n.toPrecision(4)));
  };
  function text(ctx, value, x, y, size=17, align="left", color=ink, bold=false) {
    ctx.fillStyle=color; ctx.font=(bold?"600 ":"")+size+"px Arial, 'Yu Gothic', 'Microsoft YaHei', sans-serif";
    ctx.textAlign=align; ctx.textBaseline="middle"; ctx.fillText(String(value),x,y);
  }
  // Render captions by measured width. English wraps at spaces; CJK
  // captions can break between characters. Keep every line inside the PNG.
  function footer(ctx,value,x,y=600,size=15) {
    ctx.font=size+"px Arial, 'Yu Gothic', 'Microsoft YaHei', sans-serif";
    const lines=[]; let line="";
    for(const char of value) {
      if(line && ctx.measureText(line+char).width>W-x-18) {
        const space=line.lastIndexOf(" ");
        if(space>line.length*.65) {lines.push(line.slice(0,space));line=line.slice(space+1);}
        else {lines.push(line.trimEnd());line="";}
      }
      line+=char;
    }
    lines.push(line);
    lines.forEach((s,i)=>text(ctx,s,x,y+(i-lines.length+1)*(size+4),size,"left",muted));
  }
  function line(ctx,x1,y1,x2,y2,color=rule,width=1) {
    ctx.strokeStyle=color; ctx.lineWidth=width;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  function figure(title) {
    const canvas=document.createElement("canvas");
    canvas.width=Math.round(W*dpiScale); canvas.height=Math.round(H*dpiScale);
    const ctx=canvas.getContext("2d");
    ctx.scale(dpiScale,dpiScale); ctx.fillStyle="white"; ctx.fillRect(0,0,W,H);
    text(ctx,title,plot.left,35,23,"left",ink,true);
    return {ctx,canvas};
  }
  function limits(values, signed) {
    let greatest=-Infinity, bound=0;
    for (const col of values) for (const value of col) if (Number.isFinite(value)) {
      greatest=Math.max(greatest,value); bound=Math.max(bound,Math.abs(value));
    }
    if (greatest===-Infinity) return null;
    return signed ? [-Math.max(1e-15,bound),Math.max(1e-15,bound)] : [0,greatest>0?greatest:1e-12];
  }
  function colorAt(value, range, ramp) {
    if (!Number.isFinite(value) || !range) return missing;
    // Signed maps have symmetric limits. Form the fraction before adding
    // the offset so that a finite field never needs the full width 2|max B|.
    const fraction = range[0] < 0 ? (1+value/range[1])/2 : value/range[1];
    return ramp[Math.round(255*clamp(fraction,0,1))];
  }
  function colorbar(ctx, range, ramp, label, angle=false) {
    const x=553, y=88, height=411, width=16;
    for (let i=0;i<height;i++) {
      ctx.fillStyle=rgb(ramp[Math.round(255*(1-i/(height-1)))]);
      ctx.fillRect(x,y+i,width,1.1);
    }
    ctx.strokeStyle=rule; ctx.lineWidth=.8; ctx.strokeRect(x,y,width,height);
    const labels=angle ? ["0","π/2","π"] : [fmt(range[0]),fmt((range[0]+range[1])/2),fmt(range[1])];
    for (let k=0;k<3;k++) {
      const tickY=y+height*(1-k/2);
      line(ctx,x+width,tickY,x+width+5,tickY);
      text(ctx,labels[k],x+width+9,tickY,14,"left",muted);
    }
    text(ctx,label,x-2,63,16,"left",ink);
  }
  function axes(ctx, extent, ticksX, ticksY, labelX, labelY) {
    const {left,top,side}=plot, [xMin,xMax,yMin,yMax]=extent;
    ctx.strokeStyle=rule; ctx.lineWidth=1; ctx.strokeRect(left,top,side,side);
    for (const n of ticksX) {
      const x=left+side*(n-xMin)/(xMax-xMin);
      line(ctx,x,top+side,x,top+side+5);
      text(ctx,fmt(n),x,top+side+20,14,"center",muted);
    }
    for (const n of ticksY) {
      const y=top+side-side*(n-yMin)/(yMax-yMin);
      line(ctx,left-5,y,left,y); text(ctx,fmt(n),left-10,y,14,"right",muted);
    }
    text(ctx,labelX,left+side/2,top+side+48,18,"center");
    ctx.save(); ctx.translate(21,top+side/2); ctx.rotate(-Math.PI/2);
    text(ctx,labelY,0,0,18,"center"); ctx.restore();
  }
  function ticks(max) {
    const spacing=Math.max(1,Math.ceil(max/5));
    const ticks=[];
    for (let i=0;i<=max;i+=spacing) ticks.push(i);
    return ticks;
  }
  // Map raster pixel (x,ny-1-y) to lattice site (x,y), with +y pointing up.
  // structure contains |FFT|²/N at already FFT-shifted q, not the per-site table.
  function mapFigure(title, values, label, mode="signed", geometry="sites", qaxes=null, caption="") {
    const {ctx,canvas}=figure(title), nx=values.length, ny=values[0].length;
    const sf=geometry==="reciprocal", plaquette=geometry==="plaquettes";
    const extent=sf?[-1,1,-1,1]:plaquette?[0,nx,0,ny]:[-.5,nx-.5,-.5,ny-.5];
    const ramp=colors[mode], range=limits(values,mode==="signed");
    const raster=document.createElement("canvas");
    raster.width=nx+(sf?1:0); raster.height=ny+(sf?1:0);
    const rc=raster.getContext("2d"), image=rc.createImageData(raster.width,raster.height);
    for (let x=0;x<raster.width;x++) for (let y=0;y<raster.height;y++) {
      const index=(x+(raster.height-1-y)*raster.width)*4;
      const color=colorAt(values[x%nx][y%ny],range,ramp);
      image.data.set(color,index); image.data[index+3]=255;
    }
    rc.putImageData(image,0,0);
    let imageExtent=extent;
    if(sf) {
      const qx0=qaxes.qx[0]/Math.PI, qy0=qaxes.qy[0]/Math.PI;
      imageExtent=[qx0-1/nx,qx0+2+1/nx,qy0-1/ny,qy0+2+1/ny];
    }
    const [xMin,xMax,yMin,yMax]=extent, {left,top,side}=plot;
    const px=x=>left+side*(x-xMin)/(xMax-xMin), py=y=>top+side-side*(y-yMin)/(yMax-yMin);
    ctx.save(); ctx.beginPath(); ctx.rect(left,top,side,side); ctx.clip();
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(raster,px(imageExtent[0]),py(imageExtent[3]),
                  px(imageExtent[1])-px(imageExtent[0]),py(imageExtent[2])-py(imageExtent[3]));
    ctx.restore();
    const qticks=[-1,-.5,0,.5,1];
    axes(ctx,extent,sf?qticks:ticks(plaquette?nx:nx-1),sf?qticks:ticks(plaquette?ny:ny-1),
         sf?"qₓ / π":"x / a",sf?"qᵧ / π":"y / a");
    if(range) colorbar(ctx,range,ramp,label);
    else text(ctx,tr("未定义","未定義","Undefined"),left+side/2,top+side/2,22,"center",muted,true);
    if(caption) footer(ctx,caption,left);
    return canvas;
  }
  function arrow(ctx,x1,y1,x2,y2,color,width,head) {
    const dx=x2-x1, dy=y2-y1, length=Math.hypot(dx,dy);
    if (length<1) {
      ctx.fillStyle=color; ctx.beginPath(); ctx.arc((x1+x2)/2,(y1+y2)/2,Math.max(1,width*.65),0,2*Math.PI); ctx.fill();
      return;
    }
    const size=Math.min(head,length*.4), ux=dx/length, uy=dy/length;
    line(ctx,x1,y1,x2-size*.5*ux,y2-size*.5*uy,color,width);
    ctx.fillStyle=color; ctx.beginPath(); ctx.moveTo(x2,y2);
    ctx.lineTo(x2-size*ux-size*.42*uy,y2-size*uy+size*.42*ux);
    ctx.lineTo(x2-size*ux+size*.42*uy,y2-size*uy-size*.42*ux); ctx.closePath(); ctx.fill();
  }
  function polarColor(sz) {
    const theta=Math.acos(clamp(sz,-1,1));
    return rgb(colorAt(theta,[0,Math.PI],colors.angle));
  }
  function directionsFigure(unit) {
    const {ctx,canvas}=figure(tr("实空间自旋方向","実空間のスピン配置","Spin directions in real space")), nx=unit.length, ny=unit[0].length;
    const {left,top,side}=plot, cell=side/nx;
    for (let x=0;x<nx;x++) for(let y=0;y<ny;y++) {
      const [sx,sy,sz]=unit[x][y], cx=left+(x+.5)*cell, cy=top+(ny-y-.5)*side/ny;
      const halfX=sx*cell/(2*1.15), halfY=-sy*(side/ny)/(2*1.15);
      arrow(ctx,cx-halfX,cy-halfY,cx+halfX,cy+halfY,polarColor(sz),cell*.085,cell*.36);
    }
    axes(ctx,[-.5,nx-.5,-.5,ny-.5],ticks(nx-1),ticks(ny-1),"x / a","y / a");
    colorbar(ctx,[0,Math.PI],colors.angle,"θᵢ",true);
    footer(ctx,tr("箭头给出面内分量；颜色为 θᵢ = arccos(Sᵢᶻ)。","矢印はスピンの面内成分を、色は z 軸からの傾き θᵢ = arccos(Sᵢᶻ) を表す。","Arrows show the in-plane components. Color gives θᵢ = arccos(Sᵢᶻ)."),left);
    return canvas;
  }
  // Orthographic axes at the same elev/azim as the four plot_render.py views.
  function sphereFigure(unit,elevation,azimuth) {
    const {ctx,canvas}=figure(tr("单位球面上的自旋方向","単位球面上で見たスピンの向き","Spin directions on the unit sphere")), cx=298,cy=309,r=185;
    const el=elevation*Math.PI/180, az=azimuth*Math.PI/180;
    const ca=Math.cos(az), sa=Math.sin(az), ce=Math.cos(el), se=Math.sin(el);
    function project(x,y,z) {
      return [cx+r*(-sa*x+ca*y),cy-r*(-se*ca*x-se*sa*y+ce*z),ce*ca*x+ce*sa*y+se*z];
    }
    function wire(points) {
      ctx.beginPath();
      for(let i=0;i<points.length;i++) {
        const [x,y]=project(...points[i]); if(i) ctx.lineTo(x,y); else ctx.moveTo(x,y);
      }
      ctx.strokeStyle="#d5dde4"; ctx.lineWidth=.7; ctx.stroke();
    }
    const xyz=(lon,lat)=>[Math.cos(lon)*Math.cos(lat),Math.sin(lon)*Math.cos(lat),Math.sin(lat)];
    for(let k=0;k<24;k++) wire(Array.from({length:33},(_,i)=>xyz(k*Math.PI/12,(i/32-.5)*Math.PI)));
    for(let k=1;k<12;k++) wire(Array.from({length:65},(_,i)=>xyz(i*Math.PI/32,(k/12-.5)*Math.PI)));
    const arrows=unit.flat().map(s=>({point:project(...s),color:polarColor(s[2])}));
    arrows.sort((a,b)=>a.point[2]-b.point[2]);
    ctx.globalAlpha=.9;
    for(const {point,color} of arrows) {
      const length=Math.hypot(point[0]-cx,point[1]-cy);
      arrow(ctx,cx,cy,point[0],point[1],color,1.1,length*.13);
    }
    ctx.globalAlpha=1;
    for(const [title,s] of [["Sₓ",[1.13,0,0]],["Sᵧ",[0,1.13,0]],["S_z",[0,0,1.13]]]) {
      if(elevation===90 && title==="S_z") continue;
      const [x,y]=project(...s); text(ctx,title,x,y,17,"center");
    }
    colorbar(ctx,[0,Math.PI],colors.angle,"θᵢ",true);
    footer(ctx,tr(`正交投影   仰角 ${elevation}°，方位角 ${azimuth}°`,`正投影　仰角 ${elevation}°、方位角 ${azimuth}°`,`Orthographic projection: elevation ${elevation}°, azimuth ${azimuth}°`),plot.left,580,16);
    return canvas;
  }
  function spectrumFigure(levels) {
    const {ctx,canvas}=figure(tr("固定构型的电子谱","スピン配置を固定したときの電子スペクトル","Electronic spectrum of the frozen configuration")), left=90,top=100,width=548,height=390;
    if (!levels.length || !Array.from(levels).every((n,i)=>Number.isFinite(n)&&(i===0||n>=levels[i-1]))) {
      throw new Error("绘图需要有限、已排序的单粒子能级。");
    }
    const low=Math.min(0,levels[0]), high=Math.max(0,levels[levels.length-1]);
    // Work in units of the largest |λ| on the ordinate. Even when each λ
    // is finite, multiplying its distance from a tick by a pixel height
    // or computing high-low in energy units can overflow.
    const scale=Math.max(-low,high) || 1;
    const lower=low/scale, upper=high/scale, pad=.06*(upper-lower || 1);
    const yMin=lower-pad, yMax=upper+pad;
    const px=i=>left+width*(i-1)/Math.max(1,levels.length-1);
    const py=y=>top+height*((yMax-y/scale)/(yMax-yMin));
    for(let i=0;i<=4;i++) {
      // Convex interpolation stays inside the representable energy range.
      const fraction=i/4, tick=(1-fraction)*low+fraction*high;
      if(low===high && i>0) break;
      line(ctx,left,py(tick),left+width,py(tick),"#dce3eb");
      text(ctx,fmt(tick),left-9,py(tick),14,"right",muted);
    }
    line(ctx,left,top,left,top+height); line(ctx,left,top+height,left+width,top+height);
    const levelTicks=Array.from({length:5},(_,i)=>1+Math.round(i*(levels.length-1)/4));
    for(const i of new Set(levelTicks)) {
      line(ctx,px(i),top+height,px(i),top+height+5);
      text(ctx,i,px(i),top+height+20,14,"center",muted);
    }
    ctx.save(); ctx.setLineDash([6,4]); line(ctx,left,py(0),left+width,py(0),muted); ctx.restore();
    ctx.beginPath();
    levels.forEach((value,i)=>{if(i) ctx.lineTo(px(i+1),py(value)); else ctx.moveTo(px(i+1),py(value));});
    ctx.strokeStyle=rule; ctx.lineWidth=1; ctx.stroke();
    levels.forEach((value,i)=>{
      ctx.fillStyle=value<0?"#3974aa":"#dc8a31";
      ctx.beginPath();ctx.arc(px(i+1),py(value),1.8,0,2*Math.PI);ctx.fill();
    });
    text(ctx,tr("● 占据 λ < 0","● 占有準位（λ < 0）","● Occupied λ < 0"),left,73,17,"left","#3974aa");
    text(ctx,tr("● 未占据 λ ≥ 0","● 非占有準位（λ ≥ 0）","● Empty λ ≥ 0"),left+180,73,17,"left","#b36b1b");
    text(ctx,tr("单粒子能级编号（按 λ 升序）","一粒子準位の番号（λ が小さい順）","Single-particle level index (ascending λ)"),left+width/2,top+height+56,17,"center");
    ctx.save(); ctx.translate(22,top+height/2);ctx.rotate(-Math.PI/2);text(ctx,"λ = ε − μ",0,0,18,"center");ctx.restore();
    footer(ctx,tr("电子谱取自该构型的固定 μ 计算；H 和 A 仅进入经典自旋项。","化学ポテンシャル μ を固定して求めた電子スペクトル。H と A は古典スピンのエネルギーにのみ寄与する。","Spectrum at fixed μ for this configuration. H and A enter only the classical spin terms."),left);
    return canvas;
  }
  function render(result) {
    const {spin,B_total,torque_norm,structure,chirality_map,topology_map}=result.arrays;
    const lengths=spin.map(row=>row.map(s=>Math.hypot(...s)));
    const unit=spin.map((row,x)=>row.map((s,y)=>s.map(value=>value/lengths[x][y])));
    const images=[];
    function add(name,canvas) { images.push({name,data_url:canvas.toDataURL("image/png")}); }
    ["x","y","z"].forEach((axis,k)=>{
      add("spin_"+axis,mapFigure(tr("自旋分量 S","スピン成分 S","Spin component S")+axis,unit.map(row=>row.map(s=>s[k])),"S"+axis));
    });
    add("spin_length",mapFigure(tr("局部自旋模长","各格子点でのスピンの長さ","Local spin length"),lengths,"|Sᵢ|","length"));
    add("spin_directions",directionsFigure(unit));
    for(const [name,el,az] of [["unit_sphere",24,-55],["unit_sphere_side2",24,65],
                              ["unit_sphere_side3",24,185],["unit_sphere_top",90,-90]]) {
      add(name,sphereFigure(unit,el,az));
    }
    const sfLabels={x:"Sˣˣ(q)",y:"Sʸʸ(q)",z:"Sᶻᶻ(q)",xy:"Sˣˣ(q) + Sʸʸ(q)",total:"S(q)"};
    for(const [component,label] of Object.entries(sfLabels)) {
      add("structure_factor_"+component,mapFigure(tr("结构因子 ","スピン構造因子 ","Structure factor ")+label,structure[component],"|FFT|² / N",
          "positive","reciprocal",structure,tr("图中权重取 |Σᵢ Sᵢᵅ exp(−iq·rᵢ)|²/N，组合分量为对应分量之和。","各成分の強度は |Σᵢ Sᵢᵅ exp(−iq·rᵢ)|²/N。面内成分は x と y の和、全成分は x、y、z の和を示す。","Intensity is |Σᵢ Sᵢᵅ exp(−iq·rᵢ)|²/N. Combined channels sum the corresponding components.")));
    }
    add("local_chirality",mapFigure(tr("四邻居标量手性","最近接4サイトから求めたスカラースピンカイラリティ","Four-neighbor scalar chirality"),chirality_map,"χᵢ"));
    const s=result.scalars, valid=result.topology_diagnostics.Q_valid;
    const chargeText=tr("每晶格平移原胞 Q：","磁気単位胞当たりの Q：","Q per lattice translation cell: ")+
      (valid?fmt(s.Q_per_magnetic_cell):fmt(null))+"   "+tr("每连续相位原胞 Q：","位相の周期で定まる単位胞当たりの Q：","Q per continuous phase cell: ")+
      (s.n_phase_cells>0?(valid?fmt(s.Q_per_phase_cell):fmt(null)):tr("不适用","該当なし","N/A"))+
      (valid&&s.n_phase_cells>0&&s.Q_per_phase_cell_is_integer===false?tr("（非整数）","（非整数）"," (noninteger)"):"");
    const density=valid?topology_map:spin.map(row=>row.map(()=>null));
    add("topological_charge_density",mapFigure(tr("每格方的几何荷","各プラケットのトポロジカル電荷","Geometric charge per plaquette"),density,tr("Q / 格方","Q / プラケット","Q / plaquette"),"signed","plaquettes",null,chargeText));
    add("electronic_spectrum",spectrumFigure(result.spectrum.lambda));
    add("field_z",mapFigure(tr("有效场 z 分量","有効場の z 成分","Effective field: z component"),B_total.map(row=>row.map(b=>b[2])),"B_z [E₀]"));
    add("field_norm",mapFigure(tr("有效场模长","有効場の大きさ","Effective field magnitude"),B_total.map(row=>row.map(b=>Math.hypot(...b))),"|B| [E₀]","positive"));
    add("torque_norm",mapFigure(tr("自旋力矩模长","スピントルクの大きさ","Spin torque magnitude"),torque_norm,"|S × B| [E₀]","positive"));
    return images;
  }
  window.VariationalFigures={render};
})();
