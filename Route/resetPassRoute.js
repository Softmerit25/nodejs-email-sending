import express from "express";
import { updateUserPassword, sendPasswordResetOTPEmail } from "../controllers/resetPassController";

const router = express.Router();

router.post('/reset_password', sendPasswordResetOTPEmail);

router.put('/update_password', updateUserPassword);

export default router;