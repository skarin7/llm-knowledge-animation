import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function Stage1MainScene({ start: SS, end: SE }) {
  const PY = 222;
  const pipeline = [
    {x:28,  w:185,h:108,dy:0,  label:'Clean corpus\n~15 TB filtered',          stroke:INK,  fill:'none'},
    {x:268, w:200,h:108,dy:0,  label:'Tokenize\n(BPE)',                         stroke:AMBER,fill:LAMBER},
    {x:523, w:248,h:108,dy:0,  label:'Train: predict\nnext token\n×1 trillion', stroke:AMBER,fill:LAMBER},
    {x:836, w:410,h:138,dy:-15,label:'Base / Foundation Model\n8B params · ~16 GB GPU memory\nNot an assistant — just a\nnext-token predictor', stroke:GREEN,fill:LGREEN},
  ];
  const pipeT = [SS+0.55,SS+1.35,SS+2.2,SS+3.1];
  const arrows = [{x1:213,y1:PY+54,x2:268,y2:PY+54},{x1:468,y1:PY+54,x2:523,y2:PY+54},{x1:771,y1:PY+54,x2:836,y2:PY+54}];
  const arrowT = [SS+1.1,SS+1.9,SS+2.8];
  const boxB = PY+108;
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={42} y={52} size={34} font={HTITLE} weight={700} color={GREEN}>Stage 1 — Pre-training → Base Model</Label>
      <Label start={SS+0.5} end={SE} x={0} y={96} size={17} font={HAND} align="center" width={VW} color={FADE}>Childhood analogy — model absorbs vast text like a child learning language, facts &amp; the world</Label>
      {pipeline.map((b, i) => (
        <Draw key={i} start={pipeT[i]} end={SE} dur={0.5}>{(d) =>
          <Box x={b.x} y={PY+b.dy} w={b.w} h={b.h} draw={d} stroke={b.stroke} fill={b.fill} sw={2.8} labelSize={i===3?17:20}>{b.label}</Box>}
        </Draw>
      ))}
      {arrows.map((a, i) => (
        <Draw key={i} start={arrowT[i]} end={SE} dur={0.4}>{(d) =>
          <Arrow x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} draw={d} color={FADE} sw={2.5}/>}
        </Draw>
      ))}
      <Draw start={SS+5.0} end={SE} dur={0.4}>{(d) => <Arrow x1={368} y1={boxB} x2={265} y2={405} draw={d} color={AMBER} sw={2} cx={315} cy={365}/>}</Draw>
      <Draw start={SS+5.3} end={SE} dur={0.55}>{(d) =>
        <Box x={30} y={410} w={468} h={218} draw={d} stroke={AMBER} sw={2.3} r={14} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
          <div style={{textAlign:'left',lineHeight:1.4,width:'100%'}}>
            <div style={{fontFamily:MONO,fontSize:13,color:AMBER,marginBottom:2}}>"What is the capital of France?"</div>
            <div style={{fontSize:12,color:FADE,marginBottom:5}}>↓ tokenizer maps each piece of text → integer ID</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>① Vocab lookup — 100k entries in GPT-4</div>
            <div style={{fontFamily:MONO,fontSize:11.5,color:GREEN,marginBottom:4,paddingLeft:8}}>
              "France"→4881 · "capital"→3139 · "?"→30
            </div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>② Unknown text → BPE splits into subwords</div>
            <div style={{fontFamily:MONO,fontSize:11.5,color:FADE,marginBottom:5,paddingLeft:8}}>
              "ChatGPT" → [Chat][G][PT] → 3 separate IDs
            </div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>Output: sequence of integer IDs fed to model</div>
            <div style={{fontFamily:MONO,fontSize:11.5,color:GREEN,marginBottom:5,paddingLeft:8}}>
              [What][is][the][capital][of][France][?] = 7 tokens
            </div>
            <div style={{fontSize:12,fontWeight:600,color:'#c0392b',marginBottom:2}}>⚠ Non-English / non-text costs more tokens:</div>
            <div style={{fontFamily:MONO,fontSize:11.5,color:FADE}}>
              Emoji 🌍→3–4 · Chinese 你好→2–6/char · Image→256–1024+
            </div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+5.8} end={SE} dur={0.4}>{(d) => <Arrow x1={647} y1={boxB} x2={780} y2={405} draw={d} color={AMBER} sw={2} cx={713} cy={365}/>}</Draw>
      <Draw start={SS+6.1} end={SE} dur={0.55}>{(d) =>
        <Box x={508} y={410} w={742} h={218} draw={d} stroke={AMBER} sw={2.3} r={14} labelSize={20} childStyle={{alignItems:'flex-start',padding:'12px 18px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:20,fontWeight:600,color:AMBER,marginBottom:6}}>How training works:</div>
            <div style={{fontSize:18,marginBottom:2}}>① Feed token sequence into transformer</div>
            <div style={{fontSize:18,marginBottom:2}}>② Model predicts next token (often wrong at first!)</div>
            <div style={{fontSize:18,marginBottom:2}}>③ Compute error → backprop → <b>Adam optimizer</b></div>
            <div style={{fontSize:18,marginBottom:3}}>④ Each weight nudged: adaptive lr × gradient</div>
            <div style={{fontSize:14,color:FADE,marginBottom:3}}>Adam = momentum (direction history) + RMSprop (per-weight lr) — 10× faster than vanilla SGD</div>
            <div style={{fontSize:15,color:FADE}}>Repeat 1 trillion+ times → model learns language, facts, reasoning</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+8.5} end={SE} x={35} y={638} size={15} font={HAND} color={GREEN}>Token → embedding: "France" → [0.82, 0.31, -0.14, 0.67, ...] — a learned 4096-dimentions coordinate in vector-meaning-space</Label>
      <Label start={SS+10.5} end={SE} x={35} y={660} size={14} font={MONO} color={AMBER}>Adam: m = β₁m+(1-β₁)g · v = β₂v+(1-β₂)g² · w -= lr×m/√v  (β₁=0.9, β₂=0.999)</Label>
    </Scene>
  );
}
