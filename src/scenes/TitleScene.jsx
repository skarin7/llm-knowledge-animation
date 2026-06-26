import { Scene, Label, Draw, Squiggle } from '../animation/index.jsx'
import { INK, GREEN, AMBER, VW, HAND, HTITLE } from '../constants.js'

export function TitleScene({ start: SS, end: SE }) {
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.15} end={SE} x={0} y={185} size={112} font={HTITLE} weight={700} color={INK} align="center" width={VW}>How LLMs Work</Label>
      <Draw start={SS+1.2} end={SE} dur={0.7}>{(d) => <Squiggle x={252} y={323} len={776} draw={d} color={GREEN} sw={5}/>}</Draw>
      <Label start={SS+1.4} end={SE} x={0} y={343} size={33} font={HAND} align="center" width={VW} color={INK}>From raw text to a helpful assistant — in 4 stages</Label>
      {['① Pre-training', '② Supervised Fine-Tuning', '③ RL + Human Feedback', '④ Inference'].map((s, i) => (
        <Label key={i} start={SS+2.1+i*0.38} end={SE} x={0} y={432+i*52} size={27} font={HAND} align="center" width={VW} color={i===0?GREEN:i===1?AMBER:i===2?GREEN:INK} weight={600}>{s}</Label>
      ))}
    </Scene>
  );
}
