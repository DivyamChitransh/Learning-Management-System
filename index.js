require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userroutes');
const courseRoutes = require('./routes/courseroutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middlewares/errorhandler');

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database Connected!');
}).catch(error => console.error(error));

app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/analytics', analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server Running at ${PORT}`);
});