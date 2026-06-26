import { Scene, Label, Draw, Box, Arrow, LogitBar } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function InferenceScene({ start: SS, end: SE }) {
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={50} size={34} font={HTITLE} weight={700} align="center" width={VW} color={GREEN}>Stage 4 — Inference: Answering a Question</Label>
      <Label start={SS+0.5} end={SE} x={0} y={96} size={18} font={HAND} align="center" width={VW} color={FADE}>The exam — recalling everything learned to produce an answer, token by token</Label>
      <Draw start={SS+1.5} end={SE} dur={0.55}>{(d) =>
        <Box x={35} y={122} w={582} h={58} draw={d} stroke={GREEN} fill={LGREEN} sw={2.5} r={12} labelSize={20} childStyle={{padding:'6px 14px',alignItems:'flex-start'}}>
          <div style={{fontFamily:MONO,fontSize:18,color:GREEN}}>User: "What is the capital of France?"</div>
        </Box>}
      </Draw>
      <Draw start={SS+2.8} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={180} x2={200} y2={210} draw={d} color={AMBER} sw={2}/>}</Draw>
      <Label start={SS+3.0} end={SE} x={35} y={213} size={17} font={HAND} weight={600} color={AMBER}>① Tokenize → split into subwords:</Label>
      {['What',' is',' the',' capital',' of',' France','?'].map((tok, i) => (
        <Draw key={i} start={SS+3.5+i*0.18} end={SE} dur={0.35}>{(d) =>
          <Box x={35+i*84} y={235} w={80} h={44} draw={d} stroke={AMBER} fill={LAMBER} sw={1.8} r={8} labelSize={14}>{tok}</Box>}
        </Draw>
      ))}
      <Draw start={SS+5.5} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={279} x2={200} y2={307} draw={d} color={AMBER} sw={2}/>}</Draw>
      <Label start={SS+5.8} end={SE} x={35} y={311} size={17} font={HAND} weight={600} color={AMBER}>② Each token → embedding vector (learned during pre-training):</Label>
      <Label start={SS+6.3} end={SE} x={35} y={335} size={14} font={MONO} color={GREEN}>"France"  →  [0.82, 0.31, -0.14, 0.67, ...]  (4096 dims in real models)</Label>
      <Label start={SS+7.0} end={SE} x={35} y={357} size={15} font={HAND} color={FADE}>~100k vocab tokens each have their own learned coordinate in meaning-space</Label>
      <Draw start={SS+7.5} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={381} x2={200} y2={409} draw={d} color={FADE} sw={2}/>}</Draw>
      <Draw start={SS+7.8} end={SE} dur={0.55}>{(d) =>
        <Box x={35} y={412} w={582} h={68} draw={d} stroke={GREEN} fill={LGREEN} sw={2.5} r={12} labelSize={18} childStyle={{alignItems:'flex-start',padding:'8px 14px'}}>
          <div><div style={{fontSize:18,fontWeight:700,color:GREEN}}>③ Transformer: Q × K attention → context vector</div><div style={{fontSize:13,color:FADE,marginTop:2}}>All tokens attend to each other — builds context-aware representation via self-attention</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+9.5} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={480} x2={200} y2={508} draw={d} color={FADE} sw={2}/>}</Draw>
      <Label start={SS+9.8} end={SE} x={35} y={511} size={17} font={HAND} weight={600} color={AMBER}>④ Logits → softmax → sample next token:</Label>
      {[
        {label:'Paris',    barMaxW:200,score:'4.2',prob:'61%',color:GREEN},
        {label:'Lyon',     barMaxW: 90,score:'2.1',prob:'14%',color:FADE},
        {label:'Nice',     barMaxW: 72,score:'1.8',prob:' 9%',color:FADE},
        {label:'Marseille',barMaxW: 50,score:'1.4',prob:' 6%',color:FADE},
      ].map((b, i) => (
        <Draw key={i} start={SS+10.3+i*0.38} end={SE} dur={0.4}>{(d) =>
          <LogitBar x={35} y={538+i*34} label={b.label} barMaxW={b.barMaxW} score={b.score} prob={b.prob} color={b.color} draw={d}/>}
        </Draw>
      ))}
      <Label start={SS+13.5} end={SE} x={35} y={682} size={26} font={HTITLE} weight={700} color={GREEN}>→ Sampled output: "Paris" ✓</Label>
      <Draw start={SS+7.5} end={SS+18.5} dur={0.55}>{(d) =>
        <Box x={645} y={108} w={590} h={262} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:19,fontWeight:600,color:AMBER,marginBottom:8}}>How attention finds relevant info — cosine similarity</div>
            <div style={{fontSize:14,marginBottom:4}}>Simplified 2×2 example (real models: thousands of dims):</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:2,color:INK}}>Query q (capital of France):  [0.8,  0.6]</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:2,color:GREEN}}>Key  k₁ ("Paris" knowledge):  [0.7,  0.7]</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:6,color:FADE}}>Key  k₂ ("weather" token):    [0.1,  0.9]</div>
            <div style={{fontSize:13,marginBottom:2}}>cos(q,k₁) = (0.8×0.7 + 0.6×0.7) / (1.0 × 0.99)</div>
            <div style={{fontFamily:MONO,fontSize:13,color:GREEN,marginBottom:4}}>         = 0.98/0.99 ≈ <b>0.99</b>  ← high match!</div>
            <div style={{fontSize:13,marginBottom:2}}>cos(q,k₂) = (0.8×0.1 + 0.6×0.9) / (1.0 × 0.91)</div>
            <div style={{fontFamily:MONO,fontSize:13,color:FADE}}>         = 0.62/0.91 ≈ <b>0.68</b>  ← weaker match</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+13.0} end={SE} dur={0.55}>{(d) =>
        <Box x={645} y={385} w={590} h={268} draw={d} stroke={GREEN} fill={LGREEN} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:19,fontWeight:600,color:GREEN,marginBottom:8}}>Why same question → different answers?</div>
            <div style={{fontSize:15,marginBottom:6}}>Temperature scales the logits before softmax:</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:3,color:GREEN}}>T=0.1  Paris 99%            (deterministic)</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:3,color:AMBER}}>T=1.0  Paris 61%, Lyon 14%  (natural variation)</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:8,color:'#c0392b'}}>T=2.0  Paris 41%, Lyon 27%  (creative/risky)</div>
            <div style={{fontSize:14,marginBottom:3}}>Each run independently samples from this distribution.</div>
            <div style={{fontSize:13,color:FADE}}>Same prompt + different sampled token = different output.<br/>ChatGPT default ≈ T=1.0 · coding assistants often use T=0.2.</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+18.5} end={SE} dur={0.55}>{(d) =>
        <Box x={645} y={108} w={590} h={262} draw={d} stroke={INK} sw={2.3} r={14} labelSize={18} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:18,fontWeight:600,marginBottom:8}}>Knowledge came from all 3 training stages:</div>
            <div style={{fontSize:15,marginBottom:5}}>• <b style={{color:GREEN}}>Pre-training</b> — learned "France", "capital", "Paris" &amp; their relationships from raw text</div>
            <div style={{fontSize:15,marginBottom:5}}>• <b style={{color:AMBER}}>SFT</b> — learned to give clean, direct answers in the right format</div>
            <div style={{fontSize:15,marginBottom:5}}>• <b style={{color:INK}}>RL+HF</b> — calibrated to be accurate, safe &amp; helpful</div>
            <div style={{fontSize:13,color:FADE,marginBottom:10}}>The model is frozen during inference — no new learning happens.</div>
            <div style={{fontSize:14,color:FADE,marginBottom:3}}>Full transformer architecture (interactive 3D visualisation):</div>
            <div style={{fontFamily:MONO,fontSize:15,color:GREEN,fontWeight:600}}>bbycroft.net/llm</div>
          </div>
        </Box>}
      </Draw>
    </Scene>
  );
}
