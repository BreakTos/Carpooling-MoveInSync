const express = require('express');
const router = express.Router();
const { createRide, findRide, getCreatedRides, joinRide, getInvites, accept, reject, status } = require('../controllers/rideController');

router.post('/create',createRide);
router.post('/find',findRide);
router.get('/created',getCreatedRides);
router.post('/join', joinRide);
router.get('/invites', getInvites);
router.post('/accept',accept);
router.post('/reject',reject);
router.post('/status', status);

module.exports = router;