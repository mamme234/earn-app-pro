const API = "http://localhost:3000";
let user_id = Math.floor(Math.random()*1000000);
let balance=0,lastTap=0,lastSpin=0;
const COIN_TO_USDT = 0.01;

// YouTube unlock
function unlock(){ localStorage.setItem("sub","yes"); document.getElementById("lockScreen").style.display="none"; }
if(localStorage.getItem("sub")){ document.getElementById("lockScreen").style.display="none"; }

// Navigation
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById(id).classList.add("active"); }

// Update UI
function update(){
  document.getElementById("balance").innerText = balance.toFixed(0);
  document.getElementById("usdt").innerText = (balance*COIN_TO_USDT).toFixed(2);
  document.getElementById("level").innerText = Math.floor(balance/10);
  document.getElementById("progress").style.width = ((balance%10)*10)+"%";
}

// Load profile
async function loadProfile(){
  let res = await fetch(`${API}/get_user?user_id=${user_id}`);
  let data = await res.json();
  balance = data.balance||0;
  update();
  document.getElementById("username").innerText = data.name||"User";
  document.getElementById("refCount").innerText = data.referrals||0;
  document.getElementById("refLink").href = `https://t.me/Studybuddy_2025Bot?start=${user_id}`;
}
loadProfile();

// Tap coins
document.getElementById("coinBtn").onclick = async (e)=>{
  let now=Date.now(); if(now-lastTap<300) return; lastTap=now;
  let f=document.createElement("div"); f.className="float"; f.innerText="+1";
  f.style.left=e.pageX+"px"; f.style.top=e.pageY+"px"; document.body.appendChild(f);
  setTimeout(()=>f.remove(),500);
  await fetch(`${API}/tap_coin`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id})});
  await loadProfile();
};

// Daily reward
async function daily(){
  let res=await fetch(`${API}/daily`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id})});
  let data=await res.json();
  if(data.success){ balance = data.balance; update(); alert("Daily reward added!"); } 
  else alert(data.message);
}

// Spin
async function spin(){
  let res=await fetch(`${API}/spin`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id})});
  let data=await res.json();
  if(data.success){ balance = data.balance; update(); alert(`🎉 Won ${data.win} coins!`); } 
  else alert(data.message);
}

// Social task
async function socialTask(task){
  let res=await fetch(`${API}/social_task`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id,task})});
  let data=await res.json();
  if(data.success){ balance = data.balance; update(); alert("+ Coins added"); } 
  else alert(data.message);
}

// Withdraw
async function withdraw(){
  let wallet=document.getElementById("wallet").value;
  let amt=parseFloat(document.getElementById("amount").value);
  let res=await fetch(`${API}/withdraw`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id,wallet,amount:amt})});
  let data=await res.json();
  alert(data.message);
  await loadProfile();
}