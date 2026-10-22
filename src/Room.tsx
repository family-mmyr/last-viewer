import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { labels, objects, type GameState, type Target } from './game/state';
const positions: Record<Target,[number,number]>={desk:[160,290],clock:[350,90],safe:[565,290],painting:[145,125],exit:[580,125]};
export function Room({state,onHint}:{state:GameState;onHint:(t:Target)=>void}) {
  const host=useRef<HTMLDivElement>(null);
  const latest=useRef(state); latest.current=state;
  const callback=useRef(onHint); callback.current=onHint;
  useEffect(()=>{
    if(!host.current) return;
    class RoomScene extends Phaser.Scene {
      avatar!: Phaser.GameObjects.Container;
      status!: Phaser.GameObjects.Text;
      last: Target|null=null;
      create() {
        const g=this.add.graphics();
        g.fillStyle(0x263239).fillRect(0,0,720,270);
        g.fillStyle(0x19242b).fillRect(0,270,720,190);
        g.lineStyle(1,0x35454e);
        for(let y=280;y<460;y+=35) g.lineBetween(0,y,720,y);
        for(let x=0;x<720;x+=90) g.lineBetween(x,270,x+60,460);
        g.fillStyle(0x101a20).fillRect(30,30,660,6);
        // Desk and paper.
        g.fillStyle(0x9a7355).fillRoundedRect(92,272,138,32,4);
        g.fillStyle(0x604a3d).fillRect(102,304,12,56).fillRect(208,304,12,56);
        g.fillStyle(0xd6d1b7).fillRect(135,278,40,18);
        // Stopped clock: hour 4:20, minute 20.
        g.fillStyle(0xb9c8bd).fillCircle(350,90,34);
        g.lineStyle(4,0x263239).lineBetween(350,90,368,106).lineBetween(350,90,372,103);
        g.fillStyle(0x263239).fillCircle(350,90,4);
        // Painting.
        g.fillStyle(0x977c49).fillRect(88,70,114,105);
        g.fillStyle(0x294a4b).fillRect(97,79,96,87);
        g.fillStyle(0x8a9d86).fillTriangle(98,163,140,105,192,163);
        g.fillStyle(0xc8b990).fillCircle(169,99,10);
        // Safe.
        g.fillStyle(0x4b6064).fillRoundedRect(513,260,105,85,7);
        g.lineStyle(2,0x8da5a1).strokeRect(522,270,86,64);
        g.fillStyle(0x17282a).fillRect(570,281,24,22);
        g.lineStyle(3,0xb7c1b4).strokeCircle(544,301,12);
        // Exit.
        g.fillStyle(0x111c23).fillRect(538,55,85,146);
        g.lineStyle(3,0x79958a).strokeRect(538,55,85,146);
        g.fillStyle(0xc7c799).fillRect(605,123,5,12);
        this.add.text(554,66,'EXIT',{fontSize:'16px',color:'#a6c8b7'});
        for(const t of objects) {
          const [x,y]=positions[t];
          this.add.rectangle(x,y,135,t==='exit'?160:100,0xffffff,0.001).setInteractive({useHandCursor:true}).on('pointerdown',()=>callback.current(t));
          this.add.text(x,y+(t==='clock'?48:t==='painting'?65:t==='exit'?90:80),labels[t],{fontSize:'16px',color:'#d1dbd4',backgroundColor:'#19242b',padding:{x:8,y:4}}).setOrigin(.5);
        }
        const body=this.add.rectangle(0,12,22,38,0xc1ada0);
        const head=this.add.circle(0,-14,13,0xe9d5bd);
        const hair=this.add.arc(0,-18,15,180,360,false,0x34333c);
        this.avatar=this.add.container(350,340,[body,head,hair]);
        this.add.text(333,381,'ユイ',{fontSize:'14px',color:'#a8bbb4'});
        this.status=this.add.text(360,430,'ROOM 01  /  閉ざされた配信室',{fontSize:'14px',color:'#9eb1aa'}).setOrigin(.5);
      }
      update() {
        const s=latest.current;
        if(s.target!==this.last) {
          this.last=s.target;
          const [x,y]=s.target?positions[s.target]:[350,300];
          this.tweens.killTweensOf(this.avatar);
          this.tweens.add({targets:this.avatar,x,y:Math.min(380,y+85),duration:450,ease:'Sine.easeInOut'});
        }
        this.status.setText(s.cleared?'ESCAPED  /  配信は、まだ終わらない':s.record?'記録発見：管理者 T-09':'ROOM 01  /  閉ざされた配信室');
      }
    }
    const game=new Phaser.Game({type:Phaser.AUTO,parent:host.current,width:720,height:460,backgroundColor:'#19242b',scene:RoomScene,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},render:{antialias:true},audio:{noAudio:true}});
    return ()=>game.destroy(true);
  },[]);
  return <div className="room" ref={host} aria-label="脱出部屋。探索対象は下のボタンからも指定できます"/>;
}
