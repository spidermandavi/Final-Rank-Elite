/* ================= DATABASE CORE ================= */

const defaultData = {
  players: [],
  tournaments: []
};

let stored;
try{
  stored = JSON.parse(localStorage.getItem("teamDB"));
}catch{
  stored = null;
}

const db = Object.assign({}, defaultData, stored || {});

function save(){
  localStorage.setItem("teamDB", JSON.stringify({
    players: db.players,
    tournaments: db.tournaments
  }));
}

function uid(){
  return Math.random().toString(36).slice(2);
}

/* ================= PLAYER ================= */

db.addPlayer = function(username){
  if(this.players.find(p=>p.username.toLowerCase()===username.toLowerCase())) return;

  this.players.push({
    id:uid(),
    username,
    score:0,
    wins:0,draws:0,losses:0,games:0,
    chessmood:0,streamers:0,total:0,
    history:[]
  });

  save();
};

db.deletePlayer=function(id){
  this.players=this.players.filter(p=>p.id!==id);
  save();
};

db.editPlayer=function(id,newName){
  const p=this.players.find(p=>p.id===id);
  if(!p) return;
  p.username=newName;
  save();
};

/* ================= TOURNAMENT ================= */

db.addTournament=function(t){
  if(!t.players) t.players=[];
  this.tournaments.push(t);
  save();
};

db.deleteTournament=function(id){
  const t=this.tournaments.find(x=>x.id===id);
  if(!t) return;

  (t.players||[]).forEach(entry=>{
    const p=this.players.find(pl=>pl.id===entry.playerId);
    if(!p) return;

    p.score-=entry.score||0;
    p.wins-=entry.wins||0;
    p.draws-=entry.draws||0;
    p.losses-=entry.losses||0;
    p.games-=entry.games||0;

    if(entry.type) p[entry.type]=(p[entry.type]||0)-(entry.money||0);
    p.total-=entry.money||0;

    p.history=(p.history||[]).filter(h=>h.tid!==id);
  });

  this.tournaments=this.tournaments.filter(x=>x.id!==id);
  save();
};
