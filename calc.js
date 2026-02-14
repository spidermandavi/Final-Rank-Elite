async function processArena(){

const id=document.getElementById("arenaId").value.trim();
const prize=Number(document.getElementById("prize").value);
const type=document.getElementById("type").value;
const status=document.getElementById("status");

if(db.tournaments.find(t=>t.id===id)){
  status.textContent="Already processed.";
  return;
}

status.textContent="Downloading standings...";
const standings=await getArenaResults(id);

const teamStandings=standings.filter(s=>
  db.players.some(p=>p.username.toLowerCase()===s.username.toLowerCase())
);

let teamPoints=teamStandings.reduce((a,b)=>a+b.score,0);

for(const s of teamStandings){

status.textContent="Reading games: "+s.username;

const games=await getPlayerGames(s.username,id);

let w=0,d=0,l=0;

games.forEach(g=>{
  if(g.winner==="white" && g.players.white.user.name===s.username) w++;
  else if(g.winner==="black" && g.players.black.user.name===s.username) w++;
  else if(!g.winner) d++;
  else l++;
});

const player=db.players.find(p=>p.username===s.username);

player.score+=s.score;
player.wins+=w;
player.draws+=d;
player.losses+=l;
player.games+=games.length;

const money=prize*(s.score/teamPoints);

player[type]+=money;
player.total+=money;

}

db.addTournament({id,prize,type});
status.textContent="Finished!";
}
