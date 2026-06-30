import React from 'react'
import ReactDOM from 'react-dom/client'
import { Player } from '@remotion/player'
import { LLMVideo } from './LLMVideo.jsx'
import { TOTAL_DURATION } from './timeline.js'

const FPS = 30

ReactDOM.createRoot(document.getElementById('root')).render(
  <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Player
      component={LLMVideo}
      durationInFrames={Math.ceil(TOTAL_DURATION * FPS)}
      fps={FPS}
      compositionWidth={1280}
      compositionHeight={720}
      style={{ width: '100%', maxWidth: 1280 }}
      controls
      loop={false}
    />
  </div>
)
