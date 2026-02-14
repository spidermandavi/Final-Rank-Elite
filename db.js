const db = JSON.parse(localStorage.getItem("teamDB")) || {
  players: [],
  tournaments: []
};

function save(){
  localStorage.setItem("teamDB", JSON.stringify(db));
}

function uid(){
  return Math.random().toString(36).slice(2);
}

/* ---- PLAYER ---- */

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

/* ---- TOURNAMENT ---- */

db.addTournament=function(t){
  this.tournaments.push(t);
  save();
};

db.deleteTournament=function(id){

const t=this.tournaments.find(x=>x.id===id);
if(!t) return;

t.players.forEach(entry=>{
  const p=this.players.find(pl=>pl.id===entry.playerId);
  if(!p) return;

  p.score-=entry.score;
  p.wins-=entry.wins;
  p.draws-=entry.draws;
  p.losses-=entry.losses;
  p.games-=entry.games;

  p[entry.type]-=entry.money;
  p.total-=entry.money;

  p.history=p.history.filter(h=>h.tid!==id);
});

this.tournaments=this.tournaments.filter(x=>x.id!==id);
save();
};
