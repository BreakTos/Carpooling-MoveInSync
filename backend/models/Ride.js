const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: String,
  pickup: String,
  drop: String,
  departure: Date,
  seats: Number,
  seatsArray: [{ type: String }], 
  pendingRequests: [{
    userMail: String,
    pickup: String,
    drop: String,
    departure: {
      type: Date,
      default: Date.now,
    },
    prefs:{
      music: Boolean,
      smoking: Boolean,
      pets: Boolean,
    }
  }],
  vehicle: String,
  plate: String,
  prefs: {
    music: Boolean,
    smoking: Boolean,
    pets: Boolean,
  },
  completed: {
    type: Boolean,
    default: false, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
