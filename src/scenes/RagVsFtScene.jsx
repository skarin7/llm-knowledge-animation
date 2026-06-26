import { Scene, Label, Draw, Box } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, HAND, HTITLE } from '../constants.js'

export function RagVsFtScene({ start: SS, end: SE }) {
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={0} y={52} size={38} font={HTITLE} weight={700} align="center" width={VW} color={INK}>RAG vs Fine-Tuning — when to use which?</Label>
      <Draw start={SS+0.7} end={SE} dur={0.6}>{(d) =>
        <Box x={32} y={110} w={555} h={445} draw={d} stroke={AMBER} fill={LAMBER} sw={3} r={18} labelSize={21} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'18px 22px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:26,fontWeight:700,color:AMBER,marginBottom:4}}>RAG</div>
            <div style={{fontSize:17,color:FADE,marginBottom:10}}>Retrieval-Augmented Generation — search external knowledge, inject into prompt</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Facts &amp; up-to-date information</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Latest news, proprietary docs</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Source citations possible</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ No amnesia risk</div>
            <div style={{fontSize:18,marginBottom:10}}>✓ No retraining needed</div>
            <div style={{fontSize:17,color:AMBER,fontWeight:600,marginBottom:3}}>→ Use when: you need to answer from specific documents or data</div>
            <div style={{fontSize:16,color:FADE}}>e.g. customer support bot querying your knowledge base; medical Q&amp;A with citations</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+0.7} end={SE} x={615} y={295} size={42} font={HTITLE} weight={700} color={FADE} align="center" width={50}>vs</Label>
      <Draw start={SS+1.3} end={SE} dur={0.6}>{(d) =>
        <Box x={665} y={110} w={575} h={445} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={18} labelSize={21} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'18px 22px'}}>
          <div style={{textAlign:'left',width:'100%'}}>
            <div style={{fontSize:26,fontWeight:700,color:GREEN,marginBottom:4}}>Fine-Tuning</div>
            <div style={{fontSize:17,color:FADE,marginBottom:10}}>Train the model on your data → behavior changes permanently</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Change style, tone, persona</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Teach domain jargon &amp; terminology</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Enforce strict output formats</div>
            <div style={{fontSize:18,marginBottom:3}}>✓ Faster at inference (no retrieval)</div>
            <div style={{fontSize:18,marginBottom:10}}>⚠ Risk: amnesia if over-trained</div>
            <div style={{fontSize:17,color:GREEN,fontWeight:600,marginBottom:3}}>→ Use when: you want the model to ACT differently</div>
            <div style={{fontSize:16,color:FADE}}>e.g. legal writing style, medical report format, brand voice</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+5.0} end={SE} x={0} y={596} size={22} font={HAND} align="center" width={VW} color={INK} weight={600}>Rule of thumb: RAG for facts (what it knows), Fine-tuning for behavior (how it responds)</Label>
      <Label start={SS+6.5} end={SE} x={0} y={634} size={18} font={HAND} align="center" width={VW} color={FADE}>They're complementary — fine-tune for style, add RAG for knowledge</Label>
    </Scene>
  );
}
