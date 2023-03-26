import express from "express";
const router = express.Router();

import { registerUser, loginUser } from "../controllers/userAuth.js";


// CREATE A NEW USER
router.post("/user/register", registerUser);



// SIGN IN  USER
router.post("/user/login", loginUser);


export default router;