const express = require('express')
const cookieParser  = require('cookie-parser')
const authRoutes = require('./routes/auth.route')
const foodRoutes = require('./routes/food.route')
const foodPartnerRoutes = require('./routes/food-partner.route');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cookieParser())
const allowedOrigins = ["https://food-view-pi.vercel.app/"];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner' , foodPartnerRoutes)


app.get('/', (req, res)=>{
    res.send("hello world")
})

module.exports = app
