import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function ContextWindowScene({ start: SS, end: SE }) {
  const inWin  = ['T-8','T-7','T-6','T-5','T-4','T-3','T-2','T-1'];
  const outWin = ['T-11','T-10','T-9'];
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={50} size={34} font={HTITLE} weight={700} align="center" width={VW} color={GREEN}>Context Window — The Model's Attention Limit</Label>
      <Label start={SS+0.5} end={SE} x={0} y={96} size={18} font={HAND} align="center" width={VW} color={FADE}>Every model has a max token limit — beyond it, tokens are invisible to the model</Label>
      <Label start={SS+1.5} end={SE} x={35} y={132} size={18} font={HAND} weight={600} color={GREEN}>Tokens inside context window — model attends to ALL of them:</Label>
      {inWin.map((tok, i) => (
        <Draw key={i} start={SS+2.0+i*0.18} end={SE} dur={0.35}>{(d) =>
          <Box x={35+i*72} y={154} w={68} h={44} draw={d} stroke={GREEN} fill={LGREEN} sw={1.8} r={8} labelSize={13}>{tok}</Box>}
        </Draw>
      ))}
      <Label start={SS+4.0} end={SE} x={35} y={212} size={15} font={HAND} color={GREEN} style={{fontStyle:'italic'}}>← within context window: full attention across all tokens →</Label>
      <Draw start={SS+4.5} end={SE} dur={0.3}>{(d) => <Arrow x1={200} y1={234} x2={200} y2={258} draw={d} color={'#c0392b'} sw={2}/>}</Draw>
      <Label start={SS+5.0} end={SE} x={35} y={262} size={18} font={HAND} weight={600} color={'#c0392b'}>Older tokens pushed out — model CANNOT attend to them:</Label>
      {outWin.map((tok, i) => (
        <Draw key={i} start={SS+5.5+i*0.18} end={SE} dur={0.35}>{(d) =>
          <Box x={35+i*72} y={286} w={68} h={44} draw={d} stroke={'rgba(42,47,43,0.22)'} fill={'rgba(42,47,43,0.05)'} sw={1.5} r={8} labelSize={13} childStyle={{color:FADE}}>{tok}</Box>}
        </Draw>
      ))}
      <Label start={SS+7.0} end={SE} x={35} y={346} size={16} font={HAND} color={FADE}>These tokens are gone — any facts or context stored in them are invisible to the model</Label>
      <Draw start={SS+8.0} end={SE} dur={0.55}>{(d) =>
        <Box x={35} y={372} w={580} h={110} draw={d} stroke={'#c0392b'} fill={'rgba(192,57,43,0.08)'} sw={2} r={12} childStyle={{alignItems:'flex-start',padding:'12px 16px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:18,fontWeight:600,color:'#c0392b',marginBottom:6}}>Consequence: Hallucinations &amp; Lost Context</div>
            <div style={{fontSize:14,color:FADE,marginBottom:4}}>Long conversation: model forgets what was said many turns ago → invents details confidently.</div>
            <div style={{fontSize:14,color:FADE}}>Long document: can't cross-reference the beginning while reading the end → wrong summaries &amp; missed reasoning.</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+11.0} end={SE} x={35} y={498} size={17} font={HAND} weight={600} color={AMBER}>Key insight: attention is O(n²) in context length — bigger window = 4× more compute per 2× tokens</Label>
      <Draw start={SS+4.5} end={SE} dur={0.55}>{(d) =>
        <Box x={645} y={108} w={590} h={270} draw={d} stroke={GREEN} fill={LGREEN} sw={2.3} r={14} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:19,fontWeight:600,color:GREEN,marginBottom:10}}>Context window sizes (2024–2025)</div>
            <div style={{fontFamily:MONO,fontSize:14,marginBottom:6}}><span style={{color:AMBER}}>GPT-3.5    </span><span style={{color:INK}}>    4K tokens   </span><span style={{color:FADE}}>(~3K words)</span></div>
            <div style={{fontFamily:MONO,fontSize:14,marginBottom:6}}><span style={{color:AMBER}}>GPT-4o     </span><span style={{color:INK}}>  128K tokens   </span><span style={{color:FADE}}>(~96K words)</span></div>
            <div style={{fontFamily:MONO,fontSize:14,marginBottom:6}}><span style={{color:GREEN,fontWeight:600}}>Claude 3.5 </span><span style={{color:INK}}>  200K tokens   </span><span style={{color:FADE}}>(~150K words)</span></div>
            <div style={{fontFamily:MONO,fontSize:14,marginBottom:6}}><span style={{color:AMBER}}>Gemini 1.5 </span><span style={{color:INK}}> 1000K tokens   </span><span style={{color:FADE}}>(~750K words)</span></div>
            <div style={{fontSize:13,color:FADE,marginTop:8}}>1 token ≈ ¾ word (English). A full novel ≈ 100K tokens.</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+9.5} end={SE} dur={0.55}>{(d) =>
        <Box x={645} y={398} w={590} h={240} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 18px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:18,fontWeight:600,color:AMBER,marginBottom:8}}>Why not just make it infinite?</div>
            <div style={{fontSize:14,marginBottom:5}}>Attention is O(n²): double context = 4× compute. 1M tokens = 1 trillion ops per layer.</div>
            <div style={{fontSize:14,marginBottom:5}}>KV cache memory = n × layers × head_dim — at 1M tokens: tens of GB RAM just for the cache.</div>
            <div style={{fontSize:14,marginBottom:5}}>Research tricks: sliding-window attention, RoPE scaling, FlashAttention — push limits without full O(n²) cost.</div>
            <div style={{fontSize:13,color:FADE,marginTop:5}}>Bigger context = slower generation + more GPU RAM = higher cost per query.</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+13.0} end={SE} x={0} y={656} size={19} font={HAND} align="center" width={VW} color={FADE}>Context window = model's working memory. Past the limit: out of sight, out of accuracy.</Label>
    </Scene>
  );
}
