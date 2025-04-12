const express = require('express')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes')
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./db/connectDb');

const app = express();

dotenv.config();


app.use(cors());
app.use(express.json());


app.use('/auth',authRoutes);
app.use('/ride',rideRoutes);
app.use('/chat', chatRoutes);




connectDB().then(() => {
    app.listen(8080, () => {
      console.log(`Server running on port`);
    });
  });