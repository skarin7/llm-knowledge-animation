import { Scene, Label, Draw, Box, Arrow, Sprite, LogitBar, Easing, clamp } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function TokenScene({ start: SS, end: SE }) {
  const tokens = ['The','capital','of','France','is'];
  const TBX = i => 28+i*115, TBY = 90, TBW = 105, TBH = 55;
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={48} size={36} font={HTITLE} weight={700} align="center" width={VW} color={INK}>How text is generated: one token at a time</Label>
      {tokens.map((tok, i) => (
        <Draw key={i} start={SS+0.7+i*0.22} end={SE} dur={0.45}>{(d) =>
          <Box x={TBX(i)} y={TBY} w={TBW} h={TBH} draw={d} stroke={INK} fill='none' sw={2.5} r={10} labelSize={19}>{tok}</Box>}
        </Draw>
      ))}
      <Label start={SS+1.8} end={SS+14.5} x={28} y={TBY+TBH+4} size={15} font={HAND} color={FADE}>current context →</Label>
      <Draw start={SS+1.5} end={SS+13.5} dur={0.5}>{(d) =>
        <Box x={TBX(5)} y={TBY} w={TBW} h={TBH} draw={d} stroke={FADE} sw={1.8} r={10} labelSize={22} childStyle={{color:FADE}}>?</Box>}
      </Draw>
      <Draw start={SS+2.0} end={SE} dur={0.4}>{(d) => <Arrow x1={368} y1={TBY+TBH} x2={368} y2={193} draw={d} color={FADE} sw={2.5}/>}</Draw>
      <Draw start={SS+2.5} end={SE} dur={0.6}>{(d) =>
        <Box x={35} y={196} w={1210} h={118} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={22} childStyle={{alignItems:'flex-start',padding:'8px 24px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:23,fontWeight:700,color:GREEN,marginBottom:3}}>TRANSFORMER (32–96 attention layers)</div>
            <div style={{fontSize:18,color:FADE}}>Every token attends to every other — self-attention learns meaning from context relationships</div>
            <div style={{fontSize:17,color:FADE,marginTop:2}}>Output: a raw score (logit) for each of the ~100k words in vocabulary</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+4.5} end={SE} dur={0.4}>{(d) => <Arrow x1={175} y1={314} x2={175} y2={362} draw={d} color={AMBER} sw={2.5}/>}</Draw>
      <Label start={SS+5.0} end={SE} x={35} y={368} size={19} font={HAND} weight={600} color={AMBER}>Top vocabulary candidates (logits → probabilities via softmax):</Label>
      {[
        {label:'Paris', barMaxW:210,score:'4.2',prob:'58%',color:GREEN},
        {label:'London',barMaxW:105,score:'2.1',prob:'16%',color:FADE},
        {label:'Berlin',barMaxW: 88,score:'1.8',prob:'13%',color:FADE},
        {label:'Rome',  barMaxW: 70,score:'1.4',prob: '9%',color:FADE},
        {label:'Tokyo', barMaxW: 46,score:'0.9',prob: '4%',color:FADE},
      ].map((b, i) => (
        <Draw key={i} start={SS+5.5+i*0.55} end={SE} dur={0.5}>{(d) =>
          <LogitBar x={35} y={396+i*38} label={b.label} barMaxW={b.barMaxW} score={b.score} prob={b.prob} color={b.color} draw={d}/>}
        </Draw>
      ))}
      <Label start={SS+8.0} end={SS+11.5} x={635} y={366} size={19} font={HAND} weight={600} color={INK}>Apply controls before sampling:</Label>
      <Draw start={SS+8.4} end={SS+11.5} dur={0.55}>{(d) =>
        <Box x={635} y={390} w={612} h={148} draw={d} stroke={AMBER} fill={LAMBER} sw={2} r={13} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'10px 14px'}}>
          <div style={{textAlign:'left',width:'100%',lineHeight:1.45}}>
            <div style={{fontSize:13,color:'#c0392b',marginBottom:6}}>
              Greedy (always pick highest prob) → same boring output every time
            </div>
            <div style={{fontSize:14,fontWeight:600,color:AMBER,marginBottom:2}}>① Temperature — scales logits before softmax</div>
            <div style={{fontFamily:MONO,fontSize:12,color:FADE,paddingLeft:10}}>
              T &lt; 1  → more deterministic  (T=0.2 for factual tasks)<br/>
              T &gt; 1  → more creative, random (T=1.5 for brainstorming)<br/>
              T = 0   → greedy, always same output (no randomness at all)
            </div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+14.8} end={SE} x={635} y={366} size={19} font={HAND} weight={600} color={INK}>Apply controls before sampling:</Label>
      <Draw start={SS+14.8} end={SE} dur={0.55}>{(d) =>
        <Box x={635} y={390} w={612} h={235} draw={d} stroke={AMBER} fill={LAMBER} sw={2} r={13} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'10px 14px'}}>
          <div style={{textAlign:'left',width:'100%',lineHeight:1.4}}>
            <div style={{fontSize:14,fontWeight:600,color:AMBER,marginBottom:1}}>② Top-K — keep top K tokens sorted by probability</div>
            <div style={{fontFamily:MONO,fontSize:11.5,color:FADE,marginBottom:5,paddingLeft:10}}>
              Paris 58%, London 16%, Berlin 13%, Rome 9%, Tokyo 4%, 'a' 2%, 'the' 1%<br/>
              K=7 → all kept. Mediocre tokens ('a','the') pollute the pool
            </div>
            <div style={{fontSize:14,fontWeight:600,color:AMBER,marginBottom:1}}>③ Top-P (nucleus) — cumulative prob until sum &gt; P</div>
            <div style={{fontFamily:MONO,fontSize:11.5,color:FADE,marginBottom:6,paddingLeft:10}}>
              P=0.9: Paris 58%+London 16%+Berlin 13%+Rome 9% = 96% → crosses<br/>
              Tokyo+'a'+'the'+'Europe' all skipped. Adapts to distribution shape!
            </div>
            <div style={{fontSize:13,color:GREEN,fontWeight:600,marginBottom:5}}>
              ★ Ask same question again? Model samples from top-P pool →<br/>
              &nbsp;&nbsp;Paris most times, sometimes London/Berlin. That's why same<br/>
              &nbsp;&nbsp;prompt gives different answers each time!
            </div>
            <div style={{fontSize:12.5,fontWeight:600,color:INK}}>
              ④ Order applied: Temperature → Top-K → Top-P → sample
            </div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+11.5} end={SS+14.5} x={635} y={570} size={34} font={HTITLE} weight={700} color={GREEN}>→ Sampled: 'Paris' ✓</Label>
      <Sprite start={SS+13.0} end={SE}>
        {({localTime}) => {
          const prog = Easing.easeInOutCubic(clamp((localTime-0.15)/2.0,0,1));
          const bx = 635+(TBX(5)-635)*prog;
          const by = 570+(TBY-570)*prog;
          const op = clamp(localTime/0.4,0,1);
          return (
            <div style={{position:'absolute',left:bx,top:by,width:TBW,height:TBH,opacity:op}}>
              <Box x={0} y={0} w={TBW} h={TBH} draw={1} stroke={GREEN} fill={LGREEN} sw={2.5} r={10} labelSize={19}>Paris</Box>
            </div>
          );
        }}
      </Sprite>
      <Label start={SS+15.5} end={SE} x={0} y={TBY+TBH+4} size={15} font={HAND} color={GREEN} align="center" width={VW}>
        [The][capital][of][France][is][Paris] → now 6 tokens, fed back as new input for next step ↺
      </Label>
      <Label start={SS+17.5} end={SE} x={0} y={632} size={22} font={HAND} align="center" width={VW} color={INK} weight={600}>
        Output is built ONE TOKEN AT A TIME — that's why you see text streaming live as it generates
      </Label>
    </Scene>
  );
}
