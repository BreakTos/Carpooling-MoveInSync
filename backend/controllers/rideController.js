const { EqualsOperation } = require('sift');
const Ride = require('../models/Ride');

const route = [
  "Jammu", "UttarPradesh", "Maharashtra",
  "Goa", "TamilNadu", "SriLanka"
];

const createRide = async (req, res) => {
  try {
    const {
      driver,
      pickup,
      drop,
      departure,
      seats,
      vehicle,
      plate,
      prefs
    } = req.body;

    await Ride.updateMany(
      { driver, completed: false },
      { $set: { completed: true } }
    );
    

    const seatsArray = Array(seats).fill("");
    seatsArray[0] = driver;
    
    const newRide = new Ride({
      driver,
      pickup,
      drop,
      departure,
      seats,
      seatsArray,
      pendingRequests: [],
      vehicle,
      plate,
      prefs,
      completed : false
    });
    
    
    await newRide.save();
    
    return res.status(201).json({
      message: 'Ride created successfully',
      ride: newRide,
    });
  } catch (error) {
    console.error('Ride creation failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




const findRide = async (req, res) => {
  try {
    const { pickup, drop, departure, prefs } = req.body;

    if (!pickup || !drop || !departure) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const riderPickupIndex = route.indexOf(pickup);
    const riderDropIndex = route.indexOf(drop);
    const userDeparture = new Date(departure);

    if (riderPickupIndex === -1 || riderDropIndex === -1 || riderPickupIndex >= riderDropIndex) {
      return res.status(400).json({ error: 'Invalid pickup/drop combination' });
    }

    const allRides = await Ride.find({});

    const scoredRides = allRides
      .map(ride => {
        const ridePickupIndex = route.indexOf(ride.pickup);
        const rideDropIndex = route.indexOf(ride.drop);
        const rideDeparture = new Date(ride.departure);

        if (
          ridePickupIndex === -1 ||
          rideDropIndex === -1 ||
          ridePickupIndex >= rideDropIndex ||
          rideDeparture > userDeparture
        ) {
          return null; // skip invalid rides
        }

        const prefsOk = Object.entries(prefs || {}).every(([key, value]) => {
          return !value || ride.prefs?.[key] === true;
        });

        if (!prefsOk) return null;

        // Route match percentage
        const riderRange = riderDropIndex - riderPickupIndex;
        const overlapStart = Math.max(riderPickupIndex, ridePickupIndex);
        const overlapEnd = Math.min(riderDropIndex, rideDropIndex);
        const overlapLength = Math.max(0, overlapEnd - overlapStart);
        const routeMatch = riderRange === 0 ? 0 : Math.floor((overlapLength / riderRange) * 100);

        return {
          ...ride.toObject(),
          routeMatch
        };
      })
      .filter(Boolean) 
      .sort((a, b) => b.routeMatch - a.routeMatch); 

    return res.json({ rides: scoredRides });
  } catch (err) {
    console.error("Error finding rides:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getCreatedRides = async (req, res) => {
  const { creator } = req.query;

  if (!creator) {
    return res.status(400).json({ error: 'Creator email is required' });
  }

  try {
    const rides = await Ride.find({ driver : creator }).sort({ departure: -1 });
    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error fetching created rides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const joinRide = async (req, res) => {
  const { userMail, driverMail, pickup, drop, departure, prefs } = req.body;
  
  try {
    const ride = await Ride.findOne({driver : driverMail, completed : false });
    
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if(ride.seats === 0) { 
      return res.status(400).json({ error : " Seats filled "});
    }

    ride.pendingRequests.push({userMail,pickup,drop,departure,prefs});

    await ride.save();


    return res.status(200).json({ message: "Sent Join Request", ride });

  } catch (error){

    console.error("Error joining ride:", error);
    res.status(500).json({ error: "Internal Server Error" });

  }
}

const getInvites = async (req, res) => {
  const { driverMail } = req.query;

  try {
    const ride = await Ride.findOne({ driver: driverMail, completed: false });
    const invites = [];
    
    
      if(ride && ride.pendingRequests)
      ride.pendingRequests.forEach(req => {
        invites.push({
          userMail: req.userMail,
          pickup: req.pickup,
          drop: req.drop,
          departure: req.departure,
        });
      });

    res.status(200).json({ invites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const accept = async (req, res) => {
  const { userMail, driverMail } = req.body;

  try {
    const ride = await Ride.findOne({ driver: driverMail, completed: false });
    if (!ride) return res.status(404).json({ error: "Active ride not found for driver" });

    // Remove from pendingRequests
    ride.pendingRequests = ride.pendingRequests.filter(req => req.userMail !== userMail);

    // Add to seatsArray if not already present
    if (!ride.seatsArray.includes(userMail)) {
      ride.seatsArray.push(userMail);
    }

    await ride.save();
    res.status(200).json({ message: "Request accepted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const reject = async (req, res) => {
  const { userMail, driverMail } = req.body;

  try {
    const ride = await Ride.findOne({ driver: driverMail, completed: false });
    if (!ride) return res.status(404).json({ error: "Active ride not found for driver" });

    // Remove from pendingRequests
    ride.pendingRequests = ride.pendingRequests.filter(req => req.userMail !== userMail);

    await ride.save();
    res.status(200).json({ message: "Request declined" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const status = async (req, res) => {
  const { userMail, driverMail } = req.body;

  try {
    const ride = await Ride.findOne({ driver: driverMail, completed: false });
    if (!ride) return res.status(404).json({ status: "no_active_ride" });

    var inPending = false;
    if(ride.pendingRequests)
    inPending = ride.pendingRequests.some(r => r.userMail === userMail);
    const inSeats = ride.seatsArray.includes(userMail);

    if (inSeats) return res.status(200).json({ status: "booked" });
    if (inPending) return res.status(200).json({ status: "pending" });

    return res.status(200).json({ status: "none" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}


module.exports = {
  createRide,
  findRide,
  getCreatedRides,
  joinRide,
  getInvites,
  accept,
  reject,
  status
};
