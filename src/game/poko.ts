import { objects, type GameState, type Target } from './state';
import type { TakuAdvice } from './taku';
export interface Decision { target: Target; reason: string }
export interface PokoPolicy { decide(state: Readonly<GameState>, advice: TakuAdvice|null): Decision }
export const pokoPolicy: PokoPolicy = {
  decide(s, advice) {
    const follows = !!advice && s.trust > 0.5 && s.suspicion < 0.5;
    const scores: Record<Target,number> = {
      desk:s.clue?-100:4, clock:s.time?-100:3,
      safe:s.card?-100:s.clue&&s.time?9:-3,
      painting:s.record?-100:5+s.suspicion*6,
      exit:s.card?10:-4
    };
    for(const t of objects) {
      if(scores[t] > -100) scores[t]+=(s.hints[t] ?? 0)*10;
      if(s.visited.includes(t)) scores[t]-=4;
    }
    if(advice && follows) { scores[advice.target]+=5; scores[advice.avoid]-=8; }
    const target=objects.reduce((a,b)=>scores[b]>scores[a]?b:a);
    return {target, reason:(s.hints[target]??0)>0?'視聴者のヒントを確かめよう。':follows&&target===advice?.target?'タクの案を試してみよう。':advice&&target===advice.avoid?'タクは止めるけど、自分で確かめたい。':'集めた手がかりから考えると…'};
  }
};
