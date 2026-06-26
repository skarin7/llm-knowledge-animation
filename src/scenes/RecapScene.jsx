import { Scene, Label, Draw, Box, Squiggle } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, FADE, VW, HAND, HTITLE } from '../constants.js'

export function RecapScene({ start: SS, end: SE }) {
  const rows = [
    {n:'①',title:'Pre-training',                    analogy:'Childhood — absorbs language, facts & the world',
     sub:'Petabytes of text → tokenize → train transformer → next-token-predicting brain',                           color:GREEN},
    {n:'②',title:'Fine-Tuning (SFT)',               analogy:'Learning specific skills — how to talk, respond properly',
     sub:'Q&A examples → base model becomes a helpful assistant · LoRA for custom domains',                          color:AMBER},
    {n:'③',title:'RL + Human Feedback (Post Training)', analogy:'School / college — applying knowledge, guided by feedback',
     sub:'Humans rank answers → reward loop → DPO → safer, smarter, aligned model',                                  color:INK},
    {n:'④',title:'Inference',                        analogy:'The exam — recalling everything learned to answer',
     sub:'Prompt → tokenize → embed → attention → logits → sample token → repeat',                                  color:GREEN},
  ];
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={52} size={46} font={HTITLE} weight={700} align="center" width={VW} color={INK}>Four stages, one intelligent assistant.</Label>
      <Draw start={SS+0.8} end={SE} dur={0.55}>{(d) => <Squiggle x={210} y={92} len={860} draw={d} color={GREEN} sw={4}/>}</Draw>
      {rows.map((r, i) => (
        <Draw key={i} start={SS+1.3+i*0.9} end={SE} dur={0.55}>{(d) =>
          <Box x={90} y={112+i*140} w={1100} h={122} draw={d} stroke={r.color} fill={i===0?LGREEN:i===3?LGREEN:'none'} sw={2.8} r={18} labelSize={22} childStyle={{justifyContent:'flex-start',padding:'10px 22px'}}>
            <div style={{display:'flex',alignItems:'center',gap:18,textAlign:'left'}}>
              <div style={{fontSize:40,fontFamily:HTITLE,fontWeight:700,color:r.color,minWidth:48}}>{r.n}</div>
              <div>
                <div style={{display:'flex',alignItems:'baseline',gap:10}}>
                  <div style={{fontSize:22,fontWeight:600,color:r.color,lineHeight:1.1}}>{r.title}</div>
                  <div style={{fontSize:14,color:r.color,fontStyle:'italic',opacity:0.8}}>{r.analogy}</div>
                </div>
                <div style={{fontSize:16,color:FADE,marginTop:3}}>{r.sub}</div>
              </div>
            </div>
          </Box>}
        </Draw>
      ))}
      <Label start={SS+6.0} end={SE} x={0} y={690} size={19} font={HAND} align="center" width={VW} color={FADE}>Raw text → tokens → a brain → an assistant → an aligned model → your answer</Label>
    </Scene>
  );
}
