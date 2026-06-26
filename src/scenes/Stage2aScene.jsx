import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function Stage2aScene({ start: SS, end: SE }) {
  const PY = 122;
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={42} y={50} size={34} font={HTITLE} weight={700} color={AMBER}>Stage 2 — Supervised Fine-Tuning (SFT)</Label>
      <Label start={SS+0.5} end={SE} x={0} y={94} size={17} font={HAND} align="center" width={VW} color={FADE}>Like teaching specific skills — walking, talking, responding properly. Vague at first, gets sharper with examples.</Label>
      <Draw start={SS+0.6} end={SE} dur={0.5}>{(d) =>
        <Box x={32} y={PY} w={215} h={105} draw={d} stroke={GREEN} fill={LGREEN} sw={2.8} labelSize={21}>{'Base Model\n(16 GB brain)'}</Box>}
      </Draw>
      <Draw start={SS+1.2} end={SE} dur={0.4}>{(d) => <Arrow x1={247} y1={PY+52} x2={340} y2={PY+52} draw={d} color={FADE} sw={2.5}/>}</Draw>
      <Draw start={SS+1.6} end={SE} dur={0.55}>{(d) =>
        <Box x={340} y={PY-14} w={295} h={132} draw={d} stroke={AMBER} fill={LAMBER} sw={2.8} r={14} labelSize={21}>
          <div>
            <div style={{fontSize:22,fontWeight:600,color:AMBER}}>SFT Training</div>
            <div style={{fontSize:18,marginTop:4}}>Show example Q&amp;A pairs<br/>(prompt → ideal answer)</div>
            <div style={{fontSize:14,color:FADE,marginTop:2}}>"supervised" = we know the right answer</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+2.4} end={SE} dur={0.4}>{(d) => <Arrow x1={635} y1={PY+52} x2={730} y2={PY+52} draw={d} color={FADE} sw={2.5}/>}</Draw>
      <Draw start={SS+2.8} end={SE} dur={0.55}>{(d) =>
        <Box x={730} y={PY-8} w={510} h={118} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={23}>
          <div><div style={{fontSize:26,fontWeight:700,color:GREEN}}>Instruct Model</div><div style={{fontSize:20,marginTop:4}}>→ Helpful Assistant ✓</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+3.8} end={SE} dur={0.55}>{(d) =>
        <Box x={32} y={268} w={590} h={210} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'12px 18px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:20,fontWeight:600,color:AMBER,marginBottom:8}}>Chat template (instruction format):</div>
            <div style={{fontFamily:MONO,fontSize:14,color:INK,marginBottom:3}}>[SYSTEM] You are a helpful assistant</div>
            <div style={{fontFamily:MONO,fontSize:14,color:GREEN,marginBottom:3}}>[USER] What is the capital of France?</div>
            <div style={{fontFamily:MONO,fontSize:14,color:INK,marginBottom:8}}>[ASSISTANT] The capital of France is Paris.</div>
            <div style={{fontSize:16,color:FADE}}>SFT trains the model to respond in this exact format — trained on thousands of such examples to learn WHEN and HOW to answer</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+5.0} end={SE} dur={0.5}>{(d) =>
        <Box x={643} y={268} w={325} h={100} draw={d} stroke={INK} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
          <div><div style={{fontSize:20,fontWeight:600,marginBottom:3}}>Human Labellers</div><div style={{fontSize:17,color:FADE}}>Hired pros write ideal Q&amp;A<br/>e.g. OpenAssistant oasst1</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+6.0} end={SE} dur={0.5}>{(d) =>
        <Box x={643} y={382} w={325} h={100} draw={d} stroke={INK} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
          <div><div style={{fontSize:20,fontWeight:600,marginBottom:3}}>Synthetic Data</div><div style={{fontSize:17,color:FADE}}>Ask Claude/GPT to generate<br/>Q&amp;A at scale (UltraChat)</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+7.5} end={SE} dur={0.5}>{(d) =>
        <Box x={986} y={268} w={258} h={215} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={18} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:18,fontWeight:600,color:AMBER,marginBottom:5}}>⚠ Amnesia risk</div>
            <div style={{fontSize:17,color:FADE}}>Over-train on your domain data → model forgets general capabilities (math, coding, etc.)</div>
            <div style={{fontSize:16,color:AMBER,marginTop:6}}>Solution: mix domain data with general data</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+9.5} end={SE} x={0} y={628} size={20} font={HAND} align="center" width={VW} color={FADE}>Goal: the base model predicts text → SFT teaches it to be a helpful, responsive assistant</Label>
    </Scene>
  );
}
