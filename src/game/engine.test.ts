import { describe, expect, it } from 'vitest';
import { applyAction, comment, initialState } from './state';
import { tick } from './engine';
import { pokoPolicy } from './poko';
import { takuPolicy } from './taku';
describe('autonomous escape',()=>{
  it('escapes without comments across trust values',()=>{
    for(const trust of [0,.2,.5,.7,1]) {
      let s={...initialState(trust),running:true};
      for(let i=0;i<15&&!s.cleared;i++) s=tick(s);
      expect(s.cleared).toBe(true);expect(s.card).toBe(true);expect(s.running).toBe(false);
    }
  });
  it('viewer painting hint changes the next target',()=>{
    const s=initialState(1);
    expect(pokoPolicy.decide(s,takuPolicy.advise(s)).target).toBe('desk');
    const hinted=comment(s,'絵画を調べて');
    expect(pokoPolicy.decide(hinted,takuPolicy.advise(hinted)).target).toBe('painting');
  });
  it('advice changes order when trusted, and may be ignored',()=>{
    const trusting=initialState(1);
    expect(pokoPolicy.decide(trusting,null).target).toBe('painting');
    expect(pokoPolicy.decide(trusting,takuPolicy.advise(trusting)).target).toBe('desk');
    const skeptical=initialState(0);
    expect(pokoPolicy.decide(skeptical,takuPolicy.advise(skeptical)).target).toBe('painting');
  });
  it('suspicion makes poko reject diversion',()=>{
    const s=comment(initialState(1),'タクが怪しい');
    expect(pokoPolicy.decide(s,takuPolicy.advise(s)).target).toBe('painting');
  });
  it('requires both clues for the safe and card for exit',()=>{
    let s=initialState(0);
    expect(applyAction(s,'exit','').cleared).toBe(false);
    expect(applyAction(s,'safe','').card).toBe(false);
    s=applyAction(s,'desk','');
    expect(applyAction(s,'safe','').card).toBe(false);
    s=applyAction(s,'clock','');
    s=applyAction(s,'safe','');
    expect(s.card).toBe(true);
    expect(applyAction(s,'exit','').cleared).toBe(true);
  });
  it('start/stop gate execution, and reset restores all progress',()=>{
    let s=initialState(1);
    expect(tick(s)).toBe(s);
    s=tick({...s,running:true});expect(s.turn).toBe(1);
    s={...s,running:false};expect(tick(s)).toBe(s);
    const reset=initialState(1);
    expect(reset.turn).toBe(0);expect(reset.visited).toEqual([]);
    expect(reset.messages).toEqual([]);expect(reset.hints).toEqual({});
    expect(reset.card||reset.record||reset.cleared||reset.running).toBe(false);
  });
  it('cleared game cannot advance and old hints expire',()=>{
    let s=comment({...initialState(1),running:true},'絵画を調べて');
    for(let i=0;i<15&&!s.cleared;i++)s=tick(s);
    expect(s.record).toBe(true);expect(s.hints.painting).toBe(0);
    expect(tick(s)).toBe(s);
  });
  it('bounds input, preserves immutable state, and ignores empty comments',()=>{
    const s=initialState(1);
    expect(comment(s,'   ')).toBe(s);
    expect(comment(s,'a'.repeat(250)).messages[0].text.length).toBe(200);
    expect(s.messages).toEqual([]);expect(s.hints).toEqual({});
  });
});
