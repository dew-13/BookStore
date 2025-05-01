const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
const app = express();

app.use('/api/cart', cartRoutes);

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
