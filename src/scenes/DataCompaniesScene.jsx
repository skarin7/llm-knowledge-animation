import { Scene, Label, Draw, Box, Arrow } from '../animation/index.jsx'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, HAND, HTITLE } from '../constants.js'

export function DataCompaniesScene({ start: SS, end: SE }) {
  const boxes = [
    {label:'Public Internet\nWikipedia · Books\nCode · Papers',stroke:INK,  fill:'none'},
    {label:'Data Pipeline\nCompanies\nCommonCrawl · C4\nRefinedWeb',stroke:AMBER,fill:LAMBER},
    {label:'Clean corpus\n~1–15 TB\nfiltered & safe',stroke:INK,fill:'none'},
    {label:'AI Labs\nOpenAI · Anthropic\nGoogle · Meta',stroke:GREEN,fill:LGREEN},
  ];
  const xs=[30,278,526,774], ws=[200,200,200,230], PY=195, BH=168;
  return (
    <Scene start={SS} end={SE}>
      <Label start={SS+0.2} end={SE} x={42} y={55} size={34} font={HTITLE} weight={700} color={AMBER}>Where does training data come from?</Label>
      {boxes.map((b, i) => (
        <Draw key={i} start={SS+0.55+i*0.65} end={SE} dur={0.5}>{(d) =>
          <Box x={xs[i]} y={PY} w={ws[i]} h={BH} draw={d} stroke={b.stroke} fill={b.fill} sw={2.8} r={14} labelSize={18}>{b.label}</Box>}
        </Draw>
      ))}
      {[0,1,2].map(i => (
        <Draw key={i} start={SS+1.0+i*0.65} end={SE} dur={0.4}>{(d) =>
          <Arrow x1={xs[i]+ws[i]} y1={PY+BH/2} x2={xs[i+1]} y2={PY+BH/2} draw={d} color={FADE} sw={2.5}/>}
        </Draw>
      ))}
      <Draw start={SS+3.8} end={SE} dur={0.4}>{(d) => <Arrow x1={378} y1={PY+BH} x2={370} y2={415} draw={d} color={AMBER} sw={2}/>}</Draw>
      <Draw start={SS+4.1} end={SE} dur={0.55}>{(d) =>
        <Box x={38} y={420} w={565} h={215} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'12px 18px'}}>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:20,fontWeight:600,color:AMBER,marginBottom:6}}>What data companies do:</div>
            <div style={{fontSize:18,marginBottom:2}}>• Crawl billions of web pages (petabytes)</div>
            <div style={{fontSize:18,marginBottom:2}}>• Deduplicate — remove repeated content</div>
            <div style={{fontSize:18,marginBottom:2}}>• Filter toxic, unsafe, NSFW content</div>
            <div style={{fontSize:18,marginBottom:2}}>• Remove personal info (PII)</div>
            <div style={{fontSize:18}}>• Quality-filter — keep only high-value text</div>
          </div>
        </Box>}
      </Draw>
      <Label start={SS+5.2} end={SE} x={632} y={425} size={17} font={HAND} color={FADE} width={560}>{"Exact training data is proprietary\nfor commercial models — kept secret.\n\nOpen datasets:\nCommonCrawl · RefinedWeb · The Pile\nRedPajama · C4 (Colossal Clean Crawled)\n\nThese are sold / licensed to AI labs\nor used under open-source licenses"}</Label>
    </Scene>
  );
}
