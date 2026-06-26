import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function KVCacheScene({ start: SS, end: SE }) {
  const toks1 = ['What',' is',' the',' capital',' of',' France','?'];
  const toks2 = ['What',' is',' the',' capital',' of',' France','?',' Paris'];
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={50} size={34} font={HTITLE} weight={700} align="center" width={VW} color={GREEN}>KV Cache — Efficient Token Generation</Label>
      <Label start={SS+0.5} end={SE} x={0} y={96} size={18} font={HAND} align="center" width={VW} color={FADE}>Why the model doesn't redo all the work after each new token</Label>
      <Label start={SS+1.5} end={SE} x={35} y={132} size={18} font={HAND} weight={600} color={INK}>Input before prediction — 7 tokens:</Label>
      {toks1.map((tok, i) => (
        <Draw key={i} start={SS+2.0+i*0.18} end={SE} dur={0.35}>{(d) =>
          <Box x={35+i*84} y={154} w={80} h={44} draw={d} stroke={AMBER} fill={LAMBER} sw={1.8} r={8} labelSize={13}>{tok}</Box>}
        </Draw>
      ))}
      <Draw start={SS+3.8} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={198} x2={200} y2={222} draw={d} color={GREEN} sw={2}/>}</Draw>
      <Label start={SS+4.0} end={SE} x={35} y={224} size={16} font={HAND} color={GREEN}>model predicts "Paris" → appended to input (8 tokens now):</Label>
      {toks2.map((tok, i) => (
        <Draw key={i} start={SS+4.5+i*0.15} end={SE} dur={0.35}>{(d) =>
          <Box x={35+i*72} y={248} w={68} h={44} draw={d}
            stroke={i===7?GREEN:AMBER}
            fill={i===7?LGREEN:LAMBER}
            sw={i===7?2.5:1.5} r={8} labelSize={12}>{tok}</Box>}
        </Draw>
      ))}
      <Label start={SS+6.5} end={SE} x={35} y={308} size={18} font={HAND} weight={600} color={'#c0392b'}>Naïve: recalculate attention for ALL 8 tokens from scratch</Label>
      <Label start={SS+7.0} end={SE} x={35} y={332} size={15} font={HAND} color={FADE}>8 tokens → 64 attention pairs. 100 tokens → 10,000 pairs. 1000 tokens → 1M pairs. O(n²) growth.</Label>
      <Draw start={SS+8.0} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={356} x2={200} y2={380} draw={d} color={GREEN} sw={2.5}/>}</Draw>
      <Label start={SS+8.3} end={SE} x={35} y={382} size={18} font={HAND} weight={600} color={GREEN}>KV Cache: save Key &amp; Value matrices from previous steps</Label>
      <Draw start={SS+9.0} end={SE} dur={0.55}>{(d) =>
        <Box x={35} y={408} w={375} h={64} draw={d} stroke={GREEN} fill={LGREEN} sw={2} r={10} childStyle={{alignItems:'flex-start',padding:'8px 14px'}}>
          <div><div style={{fontSize:16,fontWeight:600,color:GREEN}}>Cached K, V for tokens 1–7 ✓</div><div style={{fontSize:13,color:FADE}}>Computed once, reused every future step</div></div>
        </Box>}
      </Draw>
      <Draw start={SS+10.0} end={SE} dur={0.55}>{(d) =>
        <Box x={425} y={408} w={185} h={64} draw={d} stroke={AMBER} fill={LAMBER} sw={2} r={10} childStyle={{padding:'8px 10px'}}>
          <div><div style={{fontSize:15,fontWeight:600,color:AMBER}}>New: "Paris"</div><div style={{fontSize:12,color:FADE}}>Compute K, V once</div></div>
        </Box>}
      </Draw>
      <Label start={SS+11.0} end={SE} x={35} y={484} size={17} font={HAND} weight={600} color={GREEN}>→ New token attends against cached K,V. Only 1 new row computed.</Label>
      <Label start={SS+12.0} end={SE} x={35} y={510} size={15} font={HAND} color={FADE}>Each generation step: O(n) work, not O(n²). Crucial for fast long-context inference.</Label>
      <Draw start={SS+7.5} end={SE} dur={0.55}>{(d) =>
        <Box x={645} y={108} w={590} h={295} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:19,fontWeight:600,color:AMBER,marginBottom:8}}>What are Keys and Values?</div>
            <div style={{fontSize:14,marginBottom:6}}>In each attention layer, every token produces 3 vectors:</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:4,color:GREEN}}>Q (Query)  — "what am I looking for?"</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:4,color:AMBER}}>K (Key)    — "what do I contain?"</div>
            <div style={{fontFamily:MONO,fontSize:13,marginBottom:8,color:INK}}>V (Value)  — "what info do I pass on?"</div>
            <div style={{fontSize:13,marginBottom:5}}>Attention = softmax(Q × Kᵀ / √d) × V</div>
            <div style={{fontSize:13,marginBottom:5,color:FADE}}>K and V depend only on each token's content &amp; position — fixed after first computation. Only Q changes each step (new token asks a new question).</div>
            <div style={{fontSize:13,color:FADE}}>Cache K,V for all previous tokens. New token just adds 1 new row to attend against.</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+14.0} end={SE} dur={0.55}>{(d) =>
        <Box x={645} y={423} w={590} h={220} draw={d} stroke={GREEN} fill={LGREEN} sw={2.3} r={14} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:18,fontWeight:600,color:GREEN,marginBottom:8}}>Real-world impact</div>
            <div style={{fontSize:14,marginBottom:5}}>• Without cache: 1000-token output ≈ 500M attention computations</div>
            <div style={{fontSize:14,marginBottom:5}}>• With KV cache: ~500K — <b>1000× fewer calculations</b></div>
            <div style={{fontSize:14,marginBottom:5}}>• Tradeoff: GPU memory grows with context (n × layers × dim)</div>
            <div style={{fontSize:13,color:FADE,marginTop:6}}>Why longer contexts cost more — not just more tokens to process, but larger KV cache held in GPU RAM throughout generation.</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+18.0} end={SE} x={0} y={628} size={19} font={HAND} align="center" width={VW} color={FADE}>KV cache: trade GPU memory for speed — the trick that makes real-time LLM inference possible</Label>
    </Scene>
  );
}
