const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
