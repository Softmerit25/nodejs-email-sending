import User from "../model/User.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

//test transporter
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});



export const sendPasswordResetOTPEmail = async (req, res, next) => {
  try {

    // check if an account exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      throw Error("There's no account for the provided email.");
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "15m",
    });
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })



    const duration = (15);
    const otp =`${Math.floor(1000+Math.random()*9000)}`;


    // send email
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: req.body.email,
      subject: `${otp} is your Password Reset Code`,
      html: `<div style="text-align: center; justify-content:'center'; align-items:'center'; margin-right:'auto'; margin-left:'auto'; ">
              <h2 style="font-weight:'bold'; font-size: 30px;">Reset your Yefepere<br/>password</h2>
              <p style="font-size: 16px;" >We'll make this quick! Just enter this code within the next 15 minutes to reset your password.</p>
            <p style="color:tomato; font-size:30px;
            letter-spacing: 5px;">
            <b>${otp}</b></p>
            <p>This code <b>expires in ${duration}ms</b>.</p>
            </div>
            `,
    };
    await transporter.sendMail(mailOptions);

    // hash otp;
    const hashedOTP = await bcrypt.hash(otp, 10);

      //Insert otp into database; 
    const user = await User.updateOne({email:req.body.email}, {otp: hashedOTP});

    res.json({status:'OTP Sent to email and code in db', mailOptions});

  } catch (err) {
    next (err);
  }
};


// update user password
export const updateUserPassword = async (req, res, next ) => {

         const userEmail = req.body.email;

  try{

          let { otpcode, newPassword } = req.body;

          if((otpcode.length < 4)){
            throw Error("Code is invalid!")
          }
            //update user password with new pass
            if(newPassword.length < 6 ){
              throw Error ("Password is too short!");
            }


            const userEmail = await User.findOne({userEmail});
            if(!userEmail) return res.json({status: "email not found!"});

            //comparing the otp code with the one in database
            const verifyOTP = await bcrypt.compare(otpcode, userEmail.otp)
            if(!verifyOTP)
              return res.json({status: "Wrong code provided!. Please check your email"});

               // hashing new user password
            const hashedPassword = await bcrypt.hash(newPassword, 10)

                // updating user pass
           const userData = await User.updateOne(userEmail, {$set: {password: hashedPassword, otp:""}}, {new: true,});
           res.status(200).send({userData, msg: "User Password Updated!"})  

        }
        catch (err) {
          next (err);
        }  
};