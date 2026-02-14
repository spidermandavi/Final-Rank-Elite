const db = JSON.parse(localStorage.getItem("teamDB")) || {
  players: [],
  tournaments: []
};

function save(){
  localStorage.setItem("teamDB", JSON.stringify(db));
}

db.addPlayer = function(username){
  if(this.players.find(p=>p.username===username)) return;
  this.players.push({
    username,
    score:0,
    wins:0,draws:0,losses:0,games:0,
    chessmood:0,streamers:0,total:0
  });
  save();
};

db.addTournament = function(t){
  this.tournaments.push(t);
  save();
};
