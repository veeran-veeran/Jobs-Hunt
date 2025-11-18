import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute  from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

import dotenv from "dotenv";

dotenv.config({});

const app=express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "https://jobs-huntt.onrender.com"
  ],
  credentials: true,
};

app.use(cors(corsOptions));
// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL, // <-- THIS IS REQUIRED
        collectionName: 'sessions',
    }),
    cookie: {
        secure: true,       // live HTTPS ke liye
        httpOnly: true,
        sameSite: 'none',   // cross-site ke liye
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));


const PORT=process.env.PORT || 3000;

//api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})