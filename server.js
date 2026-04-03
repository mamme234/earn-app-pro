require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

const COIN_TO_USDT = 0.01;

// Get user
app.get("/get_user", async (req,res)=>{
  let {user_id} = req.query;
  let user = await User.findOne({user_id});
  if(!user) {
    user = await User.create({user_id});
  }
  res.json(user);
});

// Tap coin
app.post("/tap_coin", async (req,res)=>{
  let {user_id} = req.body;
  let user = await User.findOne({user_id});
  if(!user) return res.json({success:false,message:"User not found"});
  user.balance += 1;
  await user.save();
  res.json({success:true,balance:user.balance});
});

// Daily reward
app.post("/daily", async (req,res)=>{
  let {user_id} = req.body;
  let user = await User.findOne({user_id});
  let now = new Date();
  if(user.daily_claimed && (now - user.daily_claimed)<24*60*60*1000){
    return res.json({success:false,message:"Already claimed today"});
  }
  user.balance += 100;
  user.daily_claimed = now;
  await user.save();
  res.json({success:true,balance:user.balance});
});

// Spin wheel
const wheelRewards=[0,50,100,200,500];
app.post("/spin", async (req,res)=>{
  let {user_id} = req.body;
  let user = await User.findOne({user_id});
  let now = new Date();
  if(user.last_spin && (now - user.last_spin)<60*1000){
    return res.json({success:false,message:"Wait 1 minute"});
  }
  let win = wheelRewards[Math.floor(Math.random()*wheelRewards.length)];
  user.balance += win;
  user.last_spin = now;
  await user.save();
  res.json({success:true,win,balance:user.balance});
});

// Social task
app.post("/social_task", async (req,res)=>{
  let {user_id,task} = req.body;
  let user = await User.findOne({user_id});
  if(task=="telegram"){
    if(user.social_tasks.telegram) return res.json({success:false,message:"Already done"});
    user.social_tasks.telegram = true;
    user.balance += 500;
  }
  if(task=="tiktok"){
    if(user.social_tasks.tiktok) return res.json({success:false,message:"Already done"});
    user.social_tasks.tiktok = true;
    user.balance += 1000;
  }
  await user.save();
  res.json({success:true,balance:user.balance});
});

// Withdraw
app.post("/withdraw", async (req,res)=>{
  let {user_id,wallet,amount} = req.body;
  let user = await User.findOne({user_id});
  if(!user) return res.json({success:false,message:"User not found"});
  if(amount<20) return res.json({success:false,message:"Minimum 20 USDT"});
  if(user.balance<amount/COIN_TO_USDT) return res.json({success:false,message:"Insufficient balance"});
  user.withdrawal_requests.push({wallet,amount,status:"pending"});
  user.balance -= amount/COIN_TO_USDT;
  await user.save();
  res.json({success:true,message:"Withdrawal requested"});
});

app.listen(process.env.PORT || 3000, ()=>console.log("Server running"));