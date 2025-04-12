const express = require('express');
const router = express.Router();
const { signupController, loginController, allController, family,
    addFamily,
    sos } = require('../controllers/authController');

// console.log("hi");
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/family', family);
router.post('/addfamily', addFamily);
router.post('/sos', sos);
router.get('/alll', allController);

module.exports = router;