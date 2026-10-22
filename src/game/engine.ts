import { applyAction, message, type GameState } from './state';
import { pokoPolicy, type PokoPolicy } from './poko';
import { takuPolicy, type TakuPolicy } from './taku';
export function tick(s: GameState, poko: PokoPolicy = pokoPolicy, taku: TakuPolicy = takuPolicy): GameState {
  if(!s.running || s.cleared) return s;
  const advice=taku.advise(s);
  const next=advice ? message(s,'taku',advice.text) : s;
  const decision=poko.decide(s,advice);
  return applyAction(next,decision.target,decision.reason);
}
// A future YouTube adapter sends normalized text through this interface.
// Remote policies must return validated targets and support cancellation.
export interface CommentSource { subscribe(receive: (text: string)=>void): ()=>void }
export interface AsyncPokoPolicy { decide(state: Readonly<GameState>, signal: AbortSignal): Promise<import('./poko').Decision> }
