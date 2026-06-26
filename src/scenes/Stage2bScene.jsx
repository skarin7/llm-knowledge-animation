import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, HAND, HTITLE } from '../constants.js'

export function Stage2bScene({ start: SS, end: SE }) {
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={42} y={52} size={34} font={HTITLE} weight={700} color={AMBER}>Stage 2 — Fine-tune on YOUR Data (LoRA)</Label>
      <Draw start={SS+0.6} end={SE} dur={0.55}>{(d) =>
        <Box x={55} y={210} w={280} h={185} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={22}>
          <div><div style={{fontSize:24,fontWeight:700,color:GREEN}}>Base Model</div><div style={{fontSize:38,margin:'4px 0'}}>❄</div><div style={{fontSize:18,color:FADE}}>16 GB — frozen weights</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+1.5} end={SE} dur={0.5}>{(d) =>
        <Box x={292} y={293} w={162} h={115} draw={d} stroke={AMBER} fill={LAMBER} sw={2.8} r={12} labelSize={21}>
          <div><div style={{fontSize:22,fontWeight:600,color:AMBER}}>LoRA</div><div style={{fontSize:19}}>+100 MB</div><div style={{fontSize:14,color:FADE}}>adapter</div></div>
        </Box>}
      </Draw>
      <Label start={SS+1.5} end={SE} x={332} y={240} size={44} font={HTITLE} weight={700} color={AMBER}>+</Label>
      <Draw start={SS+2.3} end={SE} dur={0.45}>{(d) => <Arrow x1={462} y1={314} x2={580} y2={314} draw={d} color={FADE} sw={2.5}/>}</Draw>
      <Draw start={SS+2.7} end={SE} dur={0.55}>{(d) =>
        <Box x={580} y={208} w={400} h={152} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={23}>
          <div><div style={{fontSize:25,fontWeight:700,color:GREEN}}>Your Fine-tuned Model</div><div style={{fontSize:18,marginTop:5}}>base model + tiny adapter layer</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+3.4} end={SE} dur={0.45}>{(d) => <Arrow x1={780} y1={495} x2={780} y2={362} draw={d} color={AMBER} sw={2} cx={780} cy={430}/>}</Draw>
      <Label start={SS+3.6} end={SE} x={655} y={502} size={19} font={HAND} color={AMBER}>your business PDFs / docs</Label>
      {[
        '• Unsloth + LoRA: freeze the 16 GB base, train only a tiny add-on',
        '• Base model never changes — you patch a smart 100 MB layer on top',
        '• 4-bit quantization shrinks further — same quality, much less memory',
      ].map((txt, i) => (
        <Label key={i} start={SS+4.8+i*1.1} end={SE} x={55} y={460+i*52} size={21} font={HAND} color={INK}>{txt}</Label>
      ))}
    </Scene>
  );
}
