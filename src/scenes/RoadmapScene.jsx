import React from 'react'
import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, FADE, VW, HTITLE } from '../constants.js'

export function RoadmapScene({ start: SS, end: SE }) {
  const nodes = [
    {x:22,  label:'① Pre-training', sub:'base model',    color:GREEN},
    {x:328, label:'② SFT',          sub:'instruct model', color:AMBER},
    {x:634, label:'③ RL + HF',      sub:'aligned model',  color:INK},
    {x:940, label:'④ Inference',     sub:'generation',     color:GREEN},
  ];
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.1} end={SE} x={0} y={195} size={40} font={HTITLE} weight={700} align="center" width={VW} color={INK}>The 4-stage journey of an LLM</Label>
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          <Draw start={SS+0.45+i*0.45} end={SE} dur={0.5}>{(d) =>
            <Box x={n.x} y={285} w={278} h={130} draw={d} stroke={n.color} sw={3} fill={i===0?LGREEN:i===3?LGREEN:'none'} r={18} labelSize={22}>
              <div><div style={{fontSize:26,fontFamily:'Caveat, cursive',color:n.color,fontWeight:700}}>{n.label}</div><div style={{fontSize:16,color:FADE,marginTop:3}}>{n.sub}</div></div>
            </Box>}
          </Draw>
          {i < 3 && <Draw start={SS+0.9+i*0.45} end={SE} dur={0.4}>{(d) => <Arrow x1={n.x+278} y1={350} x2={nodes[i+1].x} y2={350} draw={d} color={FADE} sw={2.5}/>}</Draw>}
        </React.Fragment>
      ))}
    </Scene>
  );
}
