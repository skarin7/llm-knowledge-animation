import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, FADE, VW, HAND, HTITLE } from '../constants.js'

export function Stage3Scene({ start: SS, end: SE }) {
  const nodes = [
    {x:35,  y:205,w:260,h:92,label:'Model drafts\na few answers',    stroke:INK},
    {x:490, y:205,w:280,h:92,label:'Humans rank\n& prefer the best', stroke:INK},
    {x:490, y:448,w:280,h:92,label:'Reward signal\ngenerated',        stroke:AMBER},
    {x:35,  y:448,w:260,h:92,label:'Model weights\nupdate',           stroke:GREEN},
  ];
  const nodeT = [SS+0.6,SS+1.6,SS+3.2,SS+4.8];
  const loopArrows = [
    {x1:295,y1:251,x2:490,y2:251,cx:392,cy:205},
    {x1:770,y1:297,x2:770,y2:448,cx:820,cy:372},
    {x1:490,y1:494,x2:295,y2:494,cx:392,cy:540},
    {x1:35, y1:448,x2:35, y2:297,cx:-15,cy:372},
  ];
  const arrowT = [SS+1.4,SS+2.8,SS+4.4,SS+5.8];
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={42} y={50} size={33} font={HTITLE} weight={700} color={INK}>Stage 3 — Reinforcement Learning + Human Feedback</Label>
      <Label start={SS+0.5} end={SE} x={0} y={160} size={17} font={HAND} align="center" width={VW} color={FADE}>Like school / college — applying learned knowledge to new problems, guided by scores and feedback</Label>
      {nodes.map((n, i) => (
        <Draw key={i} start={nodeT[i]} end={SE} dur={0.5}>{(d) =>
          <Box x={n.x} y={n.y} w={n.w} h={n.h} draw={d} stroke={n.stroke} sw={2.8} r={14} labelSize={21}>{n.label}</Box>}
        </Draw>
      ))}
      {loopArrows.map((a, i) => (
        <Draw key={i} start={arrowT[i]} end={SE} dur={0.5}>{(d) =>
          <Arrow x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} cx={a.cx} cy={a.cy} draw={d} color={FADE} sw={2.5}/>}
        </Draw>
      ))}
      <Label start={SS+7.0} end={SE} x={220} y={340} size={24} font={HTITLE} weight={700} color={FADE} align="center" width={220}>RLHF loop</Label>
      <Draw start={SS+8.0} end={SE} dur={0.5}>{(d) =>
        <Box x={840} y={148} w={400} h={122} draw={d} stroke={INK} sw={2.5} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'10px 16px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:20,fontWeight:600,marginBottom:4}}>Reward Model</div>
            <div style={{fontSize:17,color:FADE}}>A separate model trained to predict human preference scores — "which answer is better?"</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+9.5} end={SE} dur={0.5}>{(d) =>
        <Box x={840} y={284} w={400} h={108} draw={d} stroke={GREEN} fill={LGREEN} sw={2.5} r={14} labelSize={18} childStyle={{alignItems:'flex-start',padding:'10px 16px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:18,fontWeight:600,color:GREEN,marginBottom:4}}>DPO — Modern Alternative</div>
            <div style={{fontSize:16,color:FADE}}>Direct Preference Optimization: no separate reward model, train directly on preference pairs. Simpler, more stable.</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+11.0} end={SE} dur={0.55}>{(d) =>
        <Box x={840} y={406} w={400} h={145} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={22} childStyle={{alignItems:'flex-start',padding:'12px 16px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:22,fontWeight:700,color:GREEN,marginBottom:5}}>More intelligent,{'\n'}aligned model ✓</div>
            <div style={{fontSize:16,color:FADE}}>Safe · helpful · honest · follows instructions · reduced bias &amp; harmful outputs</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+8.0} end={SE} dur={0.4}>{(d) => <Arrow x1={770} y1={300} x2={840} y2={210} draw={d} color={INK} sw={2}/>}</Draw>
      <Label start={SS+13.5} end={SE} x={0} y={628} size={21} font={HAND} align="center" width={VW} color={FADE}>Learns not just what to say — but which answers humans actually prefer, making it safe and aligned</Label>
    </Scene>
  );
}
