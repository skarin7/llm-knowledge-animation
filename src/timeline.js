import * as Scenes from './scenes/index.js'

export const SCENES = [
  { fn: Scenes.TitleScene,         dur: 4.2,  stage: null },
  { fn: Scenes.RoadmapScene,       dur: 3.0,  stage: null },
  { fn: Scenes.LLMDefScene,        dur: 4.3,  stage: null },
  { fn: Scenes.DataCompaniesScene, dur: 6.5,  stage: null },
  { fn: Scenes.Stage1MainScene,    dur: 16,   stage: 0    },
  { fn: Scenes.AttentionScene,     dur: 18,   stage: 0    },
  { fn: Scenes.TokenScene,         dur: 22,   stage: 0    },
  { fn: Scenes.Stage2aScene,       dur: 14,   stage: 1    },
  { fn: Scenes.RagVsFtScene,       dur: 10,   stage: 1    },
  { fn: Scenes.Stage2bScene,       dur: 10,   stage: 1    },
  { fn: Scenes.Stage3Scene,        dur: 18,   stage: 2    },
  { fn: Scenes.InferenceScene,     dur: 32,   stage: 3    },
  { fn: Scenes.KVCacheScene,       dur: 22,   stage: 3    },
  { fn: Scenes.ContextWindowScene, dur: 16,   stage: 3    },
  { fn: Scenes.RecapScene,         dur: 10,   stage: null },
];

let _t = 0;
export const TIMELINE = SCENES.map(s => {
  const start = _t, end = _t + s.dur;
  _t = end;
  return { ...s, start, end };
});
export const TOTAL_DURATION = _t;

export const STAGE_ENDS = [0, 1, 2, 3].map(idx => {
  let last = 0;
  for (const s of TIMELINE) if (s.stage === idx) last = s.end;
  return last;
});

export const TOPBAR_START = 7.2;
