async function getArenaResults(id){
  const res = await fetch(`https://lichess.org/api/tournament/${id}/results`,{
    headers:{Accept:"application/x-ndjson"}
  });
  const text=await res.text();
  return text.trim().split("\n").map(l=>JSON.parse(l));
}

async function getPlayerGames(username,id){
  const res = await fetch(`https://lichess.org/api/games/user/${username}?max=1000`,{
    headers:{Accept:"application/x-ndjson"}
  });
  const text=await res.text();
  return text.split("\n")
  .filter(Boolean)
  .map(l=>JSON.parse(l))
  .filter(g=>g.tournament===id);
}
