import { Scene, Label, Draw, Box } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE } from '../constants.js'

export function LLMDefScene({ start: SS, end: SE }) {
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={55} size={42} font={HTITLE} weight={700} align="center" width={VW} color={INK}>What exactly IS a Large Language Model?</Label>
      <Draw start={SS+0.8} end={SE} dur={0.6}>{(d) =>
        <Box x={75} y={128} w={1130} h={162} draw={d} stroke={GREEN} fill={LGREEN} sw={2.8} r={18} labelSize={22} childStyle={{alignItems:'flex-start',padding:'16px 26px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:23,fontWeight:600,color:GREEN,marginBottom:8}}>A neural network with billions of adjustable numbers called <b>parameters</b> (or weights)</div>
            <div style={{fontSize:19,color:FADE}}>These weights encode everything learned — language patterns, world facts, reasoning — all as floating-point numbers. Pre-training builds them. SFT shapes them. RL aligns them.</div>
          </div>
        </Box>}
      </Draw>
      {[
        {x:75,  label:'Llama 3',  detail:'8B – 405B parameters\nopen-source · Meta',       color:AMBER},
        {x:457, label:'GPT-4',    detail:'~1.8 trillion parameters\nproprietary · OpenAI',   color:AMBER},
        {x:839, label:'Claude 3', detail:'Trillions of parameters\nproprietary · Anthropic', color:GREEN},
      ].map((m, i) => (
        <Draw key={i} start={SS+1.8+i*0.55} end={SE} dur={0.5}>{(d) =>
          <Box x={m.x} y={325} w={360} h={118} draw={d} stroke={m.color} fill={i<2?LAMBER:LGREEN} sw={2.5} r={14} labelSize={20}>
            <div><div style={{fontSize:23,fontWeight:700,color:m.color}}>{m.label}</div><div style={{fontSize:16,marginTop:4,color:FADE}}>{m.detail}</div></div>
          </Box>}
        </Draw>
      ))}
      <Label start={SS+3.5} end={SE} x={0} y={482} size={19} font={HAND} align="center" width={VW} color={FADE}>More parameters ≠ always better — architecture, data quality, and fine-tuning matter just as much</Label>
    </Scene>
  );
}
