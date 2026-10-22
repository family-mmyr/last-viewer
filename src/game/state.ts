export const objects = ['desk', 'clock', 'safe', 'painting', 'exit'] as const;
export type Target = typeof objects[number];
export const labels: Record<Target, string> = { desk:'机', clock:'時計', safe:'金庫', painting:'絵画', exit:'出口' };
export interface Message { id: number; role: 'poko'|'taku'|'viewer'; text: string }
export interface GameState {
  running: boolean; cleared: boolean; turn: number; visited: Target[]; target: Target|null;
  clue: boolean; time: boolean; card: boolean; record: boolean; suspicion: number;
  trust: number; hints: Partial<Record<Target, number>>; messages: Message[]; narration: string;
}
export const initialState = (trust = Math.random()): GameState => ({
  running:false, cleared:false, turn:0, visited:[], target:null, clue:false, time:false,
  card:false, record:false, suspicion:0, trust, hints:{}, messages:[],
  narration:'ぽこです。ユイと一緒に、この部屋の出口を探そう。'
});
export function message(s: GameState, role: Message['role'], text: string): GameState {
  return {...s, messages:[...s.messages, {id:(s.messages.at(-1)?.id ?? 0)+1, role, text}].slice(-80)};
}
export function comment(s: GameState, text: string): GameState {
  const trimmed = text.trim().slice(0,200);
  if (!trimmed) return s;
  const hints = {...s.hints};
  for (const t of objects) if (trimmed.includes(labels[t])) hints[t] = 3;
  const suspicious = /タク.*(怪|疑|黒幕)|管理者|T-09/i.test(trimmed);
  return message({...s, hints, suspicion:Math.min(1, s.suspicion+(suspicious ? 0.7 : 0))}, 'viewer', trimmed);
}
export function applyAction(s: GameState, target: Target, reason: string): GameState {
  if (s.cleared) return s;
  let n = {...s, turn:s.turn+1, target, visited:[...new Set([...s.visited,target])],
    hints:Object.fromEntries(Object.entries(s.hints).map(([k,v])=>[k,Math.max(0,(v ?? 0)-1)]))};
  let text = '';
  switch(target) {
    case 'desk': n.clue=true; text='机のメモに「止まった時を、4桁で」。時計が鍵になりそう。'; break;
    case 'clock': n.time=true; text='時計は4時20分で止まっている。0420…覚えておこう。'; break;
    case 'safe':
      if (s.clue && s.time) { n.card=true; text='0420で金庫が開いた！ 中にカードキーがある。'; }
      else text='4桁の暗証番号が必要だ。部屋の手がかりを集めよう。';
      break;
    case 'painting': n.record=true; n.suspicion=1; text='絵画の裏に「管理者 T-09／タク」。タクがこの部屋を管理していたんだ…！'; break;
    case 'exit':
      if(s.card) { n.cleared=true; n.running=false; text=s.record?'カードキーで脱出！ タクの正体も、配信に残せた。':'カードキーで脱出！ でもタクは、何か隠していた気がする…。'; }
      else text='出口はカードキー式。まず鍵を探そう。';
  }
  n.narration=reason+' '+text;
  return message(n,'poko',n.narration);
}
