import type { GameState, Target } from './state';
export interface TakuAdvice { target: Target; avoid: Target; text: string }
export interface TakuPolicy { advise(state: Readonly<GameState>): TakuAdvice | null }
export const takuPolicy: TakuPolicy = {
  advise(s) {
    if(s.record || s.cleared) return null;
    if(s.card) return {target:'exit',avoid:'painting',text:'鍵があるなら早く出よう。絵画なんて見る必要ないよ。'};
    return {target:s.clue?'clock':'desk',avoid:'painting',text:'僕を信じて。'+(s.clue?'時計を見よう。':'机にヒントがあるはず。')+' 絵画はただの飾りだよ。'};
  }
};
