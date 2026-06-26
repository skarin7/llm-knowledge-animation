import { Stage, SketchDefs, Paper, TopBar } from './animation/index.jsx'
import { TIMELINE, TOTAL_DURATION, STAGE_ENDS, TOPBAR_START } from './timeline.js'

export function LLMVideo() {
  return (
    <Stage width={1280} height={720} duration={TOTAL_DURATION}
           background="#f5f2e8" loop={false} autoplay={true} persistKey="llmvideo2">
      <SketchDefs/>
      <Paper/>
      <TopBar start={TOPBAR_START} end={TOTAL_DURATION - 2} stageEnds={STAGE_ENDS}/>
      {TIMELINE.map(({ fn: SceneFn, start, end }, i) => (
        <SceneFn key={i} start={start} end={end}/>
      ))}
    </Stage>
  );
}
