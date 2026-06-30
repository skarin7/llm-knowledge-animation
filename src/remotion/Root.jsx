import { Composition } from 'remotion'
import { LLMVideo } from '../LLMVideo.jsx'
import { TOTAL_DURATION } from '../timeline.js'

const FPS = 30

export function RemotionRoot() {
  return (
    <Composition
      id="LLMKnowledge"
      component={LLMVideo}
      durationInFrames={Math.ceil(TOTAL_DURATION * FPS)}
      fps={FPS}
      width={1280}
      height={720}
    />
  )
}
