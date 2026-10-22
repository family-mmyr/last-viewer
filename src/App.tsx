import { useEffect, useRef, useState } from 'react';
import { Room } from './Room';
import { comment, initialState, labels, objects, type Target } from './game/state';
import { tick } from './game/engine';
export function App() {
  const [state,setState]=useState(()=>initialState());
  const [speed,setSpeed]=useState(2200);
  const [input,setInput]=useState('');
  const feed=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!state.running || state.cleared) return;
    const timer=window.setInterval(()=>setState(s=>tick(s)),speed);
    return ()=>window.clearInterval(timer);
  },[state.running,state.cleared,speed]);
  useEffect(()=>{feed.current?.scrollTo({top:feed.current.scrollHeight,behavior:'smooth'});},[state.messages]);
  function hint(t:Target) {setState(s=>comment(s,labels[t]+'を調べて'));}
  return <main>
    <header><a className="brand" href="./">LAST VIEWER<span>INTERACTIVE ESCAPE / 01</span></a><span className="live"><i/> {state.running?'LIVE':'STANDBY'} · 視聴者 1</span></header>
    <section className="intro"><p className="eyebrow">あなたのコメントが、物語を動かす。</p><h1>最後の視聴者<span>THE LAST VIEWER</span></h1><p>閉じ込められたユイ。操作するのはAI実況者「ぽこ」。<br/>協力者の声を信じるか。その違和感を、伝えるか。</p></section>
    <div className="layout"><section className="play">
      <div className="panelbar"><span>01 — 配信室</span><span>{state.cleared?'脱出成功':state.running?'探索中':state.turn?'一時停止':'接続待機'} / {state.turn.toString().padStart(2,'0')} ACTIONS</span></div>
      <Room state={state} onHint={hint}/>
      <div className="inventory"><span>収集した手がかり</span><b className={state.clue?'found':''}>メモ</b><b className={state.time?'found':''}>04:20</b><b className={state.card?'found':''}>カードキー</b><b className={state.record?'found':''}>管理者記録</b></div>
      <div className="narration" aria-live="polite"><span className="poko">ぽ</span><div><small>POKO / AI実況者</small><p>{state.narration}</p></div></div>
      {state.cleared&&<div className="clear" role="status"><strong>脱出成功</strong><p>{state.record?'真相エンド — 管理者の記録は視聴者に届いた。':'脱出エンド — 次は絵画の裏を確かめてみよう。'}</p></div>}
      <div className="controls"><button className="primary" disabled={state.cleared||state.running} onClick={()=>setState(s=>({...s,running:true}))}>▶ {state.turn?'再開':'自律プレイ開始'}</button><button disabled={!state.running} onClick={()=>setState(s=>({...s,running:false}))}>停止</button><button onClick={()=>setState(initialState())}>リセット</button><label>行動間隔 <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value="4000">ゆっくり · 4秒</option><option value="2200">標準 · 2.2秒</option><option value="800">速い · 0.8秒</option></select></label></div>
      <p className="helper">部屋のアイテムをタップすると、ぽこにヒントを送れます。</p>
      <div className="targets">{objects.map(t=><button key={t} disabled={state.cleared} onClick={()=>hint(t)}>{labels[t]}を調べて</button>)}</div>
    </section><aside>
      <div className="panelbar"><span>LIVE CHAT</span><span>● 接続中</span></div>
      <div className="chat-intro">ここにいる視聴者は、あなただけ。<br/>ぽこはあなたのコメントを読んで考えます。</div>
      <div className="feed" ref={feed} role="log" aria-label="配信コメント">{state.messages.length===0?<p className="empty">配信の開始を待っています…</p>:state.messages.map(m=><article className={m.role} key={m.id}><small>{m.role==='taku'?'タク / 協力者':m.role==='poko'?'ぽこ / AI':'あなた / 視聴者'}</small><p>{m.text}</p></article>)}</div>
      <form onSubmit={e=>{e.preventDefault();setState(s=>comment(s,input));setInput('');}}><label htmlFor="comment">ぽこに伝える</label><div className="compose"><input id="comment" value={input} maxLength={200} placeholder="例：絵画を調べて" onChange={e=>setInput(e.target.value)} disabled={state.cleared}/><button className="primary" disabled={!input.trim()||state.cleared}>送信</button></div></form>
      <button className="suspicion" disabled={state.cleared} onClick={()=>setState(s=>comment(s,'タクが怪しい。絵画を調べて'))}>「タク、何か隠してない？」</button>
    </aside></div><footer>最後の視聴者 · MVP <span>状態ベースの自律プレイ / LLM未使用</span></footer>
  </main>;
}
