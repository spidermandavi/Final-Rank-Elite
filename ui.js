const tbody=document.querySelector("#leaderboard tbody");

db.players
.sort((a,b)=>b.score-a.score)
.forEach((p,i)=>{

const tr=document.createElement("tr");

const wr=p.games?((p.wins+0.5*p.draws)/p.games*100).toFixed(1):0;

tr.innerHTML=`
<td>${i+1}</td>
<td>${p.username}</td>
<td>${p.score}</td>
<td>${p.chessmood.toFixed(2)}</td>
<td>${p.streamers.toFixed(2)}</td>
<td>${p.total.toFixed(2)}</td>
<td>${wr}%</td>
`;

tbody.appendChild(tr);
});
