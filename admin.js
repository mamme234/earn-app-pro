const API = "http://localhost:3000"; // backend API

async function loadStats(){
  let res = await fetch(`${API}/admin/stats`);
  let data = await res.json();
  document.getElementById("totalUsers").innerText = data.totalUsers;
  document.getElementById("totalCoins").innerText = data.totalCoins;
  document.getElementById("totalWithdrawals").innerText = data.totalWithdrawals;
}

async function loadWithdrawals(){
  let res = await fetch(`${API}/admin/withdrawals`);
  let withdrawals = await res.json();
  let tbody = document.querySelector("#withdrawTable tbody");
  tbody.innerHTML = "";
  withdrawals.forEach(w=>{
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${w.user_id}</td>
      <td>${w.wallet}</td>
      <td>${w.amount}</td>
      <td>${w.status}</td>
      <td>
        ${w.status=="pending"?`<button onclick="approve('${w._id}')">Approve</button> <button onclick="reject('${w._id}')">Reject</button>`:""}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function approve(id){
  await fetch(`${API}/admin/withdrawals/${id}/approve`,{method:"POST"});
  loadWithdrawals();
}

async function reject(id){
  await fetch(`${API}/admin/withdrawals/${id}/reject`,{method:"POST"});
  loadWithdrawals();
}

loadStats();
loadWithdrawals();