// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();


app.use(bodyParser.json());


app.use(cookieSession({
    name: 'session', 
    keys: [process.env.COOKIE_KEY], 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


app.use(express.static(path.join(__dirname, 'frontend')));



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view`);
});