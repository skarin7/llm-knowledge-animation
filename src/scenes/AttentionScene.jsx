import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE, MONO } from '../constants.js'

export function AttentionScene({ start: SS, end: SE }) {
  const tokens = ['What','is','the','capital','of','France','?'];
  const tw = 82, th = 44, tx = i => 28+i*tw, ty = 130;
  const attnWeights = [
    [0.5,0.1,0.05,0.25,0.05,0.04,0.01],
    [0.1,0.5,0.05,0.2, 0.05,0.09,0.01],
    [0.05,0.05,0.4,0.3,0.1,0.09,0.01],
    [0.08,0.12,0.2,0.4,0.08,0.1, 0.02],
    [0.05,0.05,0.1,0.2,0.5,0.08,0.02],
    [0.05,0.08,0.05,0.28,0.1,0.42,0.02],
    [0.1,0.1,0.05,0.2,0.05,0.18,0.32],
  ];
  const focusRow = 3;
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={50} size={34} font={HTITLE} weight={700} align="center" width={VW} color={GREEN}>Self-Attention — How Tokens Understand Context</Label>
      <Label start={SS+0.5} end={SE} x={0} y={94} size={17} font={HAND} align="center" width={VW} color={FADE}>Every token looks at every other token — builds rich contextual meaning before predicting</Label>
      {tokens.map((tok, i) => (
        <Draw key={i} start={SS+1.0+i*0.2} end={SE} dur={0.4}>{(d) =>
          <Box x={tx(i)} y={ty} w={tw-4} h={th} draw={d}
            stroke={i===focusRow?GREEN:AMBER} fill={i===focusRow?LGREEN:LAMBER}
            sw={i===focusRow?2.5:1.8} r={8} labelSize={13}>{tok}</Box>}
        </Draw>
      ))}
      <Label start={SS+2.5} end={SE} x={28} y={ty+th+4} size={14} font={HAND} color={FADE}>input tokens (7 tokens)</Label>
      <Label start={SS+3.5} end={SE} x={28} y={200} size={17} font={HAND} weight={600} color={INK}>Each token produces 3 vectors:</Label>
      <Draw start={SS+4.0} end={SE} dur={0.55}>{(d) =>
        <Box x={28} y={222} w={570} h={88} draw={d} stroke={GREEN} fill={LGREEN} sw={2} r={10} childStyle={{alignItems:'flex-start',padding:'8px 14px'}}>
          <div style={{width:'100%',lineHeight:1.5}}>
            <div style={{fontFamily:MONO,fontSize:13,color:GREEN}}><b>Q (Query)</b>  — "what am I looking for?"</div>
            <div style={{fontFamily:MONO,fontSize:13,color:AMBER}}><b>K (Key)  </b>  — "what information do I hold?"</div>
            <div style={{fontFamily:MONO,fontSize:13,color:INK  }}><b>V (Value)</b>  — "what do I pass on if attended to?"</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+6.0} end={SE} x={28} y={322} size={17} font={HAND} weight={600} color={INK}>Score = softmax( Q × Kᵀ / √d ) × V</Label>
      <Label start={SS+6.5} end={SE} x={28} y={348} size={14} font={HAND} color={FADE}>Dot-product of Q and K measures relevance → softmax → attention weights → weighted V sum</Label>
      <Draw start={SS+7.5} end={SE} dur={0.55}>{(d) =>
        <Box x={28} y={374} w={570} h={80} draw={d} stroke={GREEN} fill={LGREEN} sw={2} r={10} childStyle={{alignItems:'flex-start',padding:'8px 14px'}}>
          <div style={{lineHeight:1.5}}>
            <div style={{fontSize:14,fontWeight:600,color:GREEN,marginBottom:4}}>"capital" attends strongly to "France" (score ≈ 0.28)</div>
            <div style={{fontFamily:MONO,fontSize:12,color:FADE}}>
              Q<sub>capital</sub> · K<sub>France</sub> = high → model learns "capital of France" is a unit of meaning
            </div>
            <div style={{fontFamily:MONO,fontSize:12,color:FADE}}>Output vector for "capital" now encodes France-specific context</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+10.0} end={SE} dur={0.55}>{(d) =>
        <Box x={28} y={466} w={570} h={72} draw={d} stroke={AMBER} fill={LAMBER} sw={2} r={10} childStyle={{alignItems:'flex-start',padding:'8px 14px'}}>
          <div style={{lineHeight:1.5}}>
            <div style={{fontSize:14,fontWeight:600,color:AMBER,marginBottom:3}}>Multi-Head Attention — run N heads in parallel</div>
            <div style={{fontSize:13,color:FADE}}>Each head learns different relationships: syntax · coreference · world-knowledge · position</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+12.0} end={SE} x={28} y={548} size={14} font={HAND} color={FADE}>GPT-4: 96 attention layers × 96 heads each — every layer refines contextual meaning deeper</Label>
      <Label start={SS+4.0} end={SE} x={635} y={130} size={17} font={HAND} weight={600} color={INK}>Attention heatmap — "capital" row:</Label>
      <Label start={SS+4.2} end={SE} x={635} y={152} size={13} font={HAND} color={FADE}>how much "capital" attends to each token (darker = stronger)</Label>
      {tokens.map((tok, i) => (
        <Draw key={i} start={SS+4.5+i*0.25} end={SE} dur={0.4}>{(d) => {
          const w = attnWeights[focusRow][i];
          const alpha = Math.round(w*2.2*255).toString(16).padStart(2,'0');
          return (
            <div style={{position:'absolute',left:635+i*82,top:172,opacity:d}}>
              <div style={{width:78,height:52,background:`#1f8a5b${alpha}`,border:'1.5px solid rgba(31,138,91,0.4)',borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontFamily:MONO,fontSize:11,color:'#2a2f2b',fontWeight:600}}>{tok}</div>
                <div style={{fontFamily:MONO,fontSize:10,color:'rgba(42,47,43,0.6)'}}>{Math.round(w*100)}%</div>
              </div>
            </div>
          );
        }}</Draw>
      ))}
      <Draw start={SS+6.0} end={SE} dur={0.55}>{(d) =>
        <Box x={635} y={242} w={590} h={220} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'14px 16px'}}>
          <div style={{textAlign:'left',width:'100%',lineHeight:1.5}}>
            <div style={{fontSize:17,fontWeight:600,color:AMBER,marginBottom:8}}>Why attention changes everything</div>
            <div style={{fontSize:14,marginBottom:5}}>• "bank" in "river bank" vs "bank account" — same word, different meaning. Attention resolves this by looking at surrounding tokens.</div>
            <div style={{fontSize:14,marginBottom:5}}>• "it" in "The cat sat on the mat because <b>it</b> was tired" — attention traces "it" back to "cat", not "mat".</div>
            <div style={{fontSize:14,marginBottom:5}}>• "capital of France" → attention links "capital" directly to "France" across 2 positions.</div>
            <div style={{fontSize:13,color:FADE}}>Before transformers: RNNs processed left-to-right only, forgot long-range context. Attention sees all tokens simultaneously — no forgetting.</div>
          </div>
        </Box>}
      </Draw>
      <Draw start={SS+11.0} end={SE} dur={0.55}>{(d) =>
        <Box x={635} y={482} w={590} h={130} draw={d} stroke={GREEN} fill={LGREEN} sw={2.3} r={14} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'12px 16px'}}>
          <div style={{textAlign:'left',width:'100%',lineHeight:1.5}}>
            <div style={{fontSize:16,fontWeight:600,color:GREEN,marginBottom:6}}>After all transformer layers:</div>
            <div style={{fontSize:14,color:FADE}}>Each token's vector is no longer its original embedding — it's been enriched with context from every other token in the sequence.</div>
            <div style={{fontSize:14,color:FADE,marginTop:4}}>These context-aware vectors feed into the final layer → probabilities over vocab → next token.</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+14.0} end={SE} x={0} y={632} size={20} font={HAND} align="center" width={VW} color={FADE} weight={600}>Attention is all you need — the 2017 paper that replaced RNNs and enabled modern LLMs</Label>
    </Scene>
  );
}
