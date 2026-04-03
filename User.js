const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  name: { type: String, default: "User" },
  balance: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
  referrer_id: { type: Number, default: null },
  daily_claimed: { type: Date, default: null },
  last_spin: { type: Date, default: null },
  social_tasks: {
    telegram: { type: Boolean, default: false },
    tiktok: { type: Boolean, default: false }
  },
  withdrawal_requests: [
    {
      wallet: String,
      amount: Number,
      status: { type: String, default: "pending" },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);