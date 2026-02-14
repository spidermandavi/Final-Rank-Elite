async function processArena(){

const id=document.getElementById("arenaId").value.trim();
const prize=Number(document.getElementById("prize").value);
const type=document.getElementById("type").value;
const status=document.getElementById("status");
const bar=document.getElementById("bar");

if(db.tournaments.find(t=>t.id===id)){
  status.textContent="Already processed.";
  return;
}

status.textContent="Downloading standings...";
bar.style.width="5%";

const standings=await getArenaResults(id);

const teamStandings=standings.filter(s=>
  db.players.some(p=>p.username.toLowerCase()===s.username.toLowerCase())
);

let teamPoints=teamStandings.reduce((a,b)=>a+b.score,0);

let tournamentRecord={
  id,
  type,
  prize,
  date:new Date().toISOString(),
  players:[]
};

let done=0;

for(const s of teamStandings){

bar.style.width=(10+done/teamStandings.length*80)+"%";
status.textContent="Reading "+s.username;

const games=await getPlayerGames(s.username,id);

let w=0,d=0,l=0;

games.forEach(g=>{
if(g.winner==="white" && g.players.white.user.name===s.username) w++;
else if(g.winner==="black" && g.players.black.user.name===s.username) w++;
else if(!g.winner) d++;
else l++;
});

const player=db.players.find(p=>p.username.toLowerCase()===s.username.toLowerCase());
const money=prize*(s.score/teamPoints);

player.score+=s.score;
player.wins+=w;
player.draws+=d;
player.losses+=l;
player.games+=games.length;

player[type]+=money;
player.total+=money;

player.history.push({tid:id,money,type,date:Date.now()});

tournamentRecord.players.push({
playerId:player.id,
score:s.score,
wins:w,draws:d,losses:l,games:games.length,
money,type
});

done++;
}

db.addTournament(tournamentRecord);

bar.style.width="100%";
status.textContent="Finished!";
}
