const { findMatchingSlot } = require("../helper/findMatchingSlot");
const { oauth2client } = require("../helper/googleConfig");
const { scheduleMeet } = require("../helper/scheduler");
const { user } = require("../models/user");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcryptJs = require("bcryptjs");
const { use } = require("../Routes/userRoute");

const bookSlotController = async (req, res) => {
  try {
    const { useremail, mentorId, mentorEmail, accessToken, slot1 } = req.body;
    console.log(req.body);

    const mentor = await user.findOne({ email: mentorEmail });
    let mentorSlot = mentor.slot;
    // console.log(mentorSlot);

    const matchingSlot = findMatchingSlot(mentorSlot, slot1);
    // console.log(matchingSlot);
    if (matchingSlot) {
      const meetDetails = await scheduleMeet(
        matchingSlot,
        useremail,
        mentorEmail
      ).finally(() => {
        console.log(meetDetails + "====");
      });

      console.log("meetdetails: " + meetDetails);

      res.status(200).send({
        data: meetDetails,
        message: "Thank You ! Matched Successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const registerUser = async (req, res) => {
  const { name, password, email, accessToken, refreshToken, slot } = req.body;
  console.log(req.body);

  try {
    const hashPassword = await bcryptJs.hash(password, 10);

    const newUser = await user.create({
      name: name,
      email: email,
      password: hashPassword,
      slot: {
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });
    console.log(newUser);

    if (newUser) {
      res.status(200).send({
        data: newUser,
        message: "Thank You ! Registered Successfully",
        success: true,
      });
    } else {
      res
        .status(200)
        .send({ message: "Ooops ! Something went wrong", success: false });
    }
  } catch (error) {
    console.log(error.message);

    res.status(200).send(error);
  }
};

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const accessToken = googleRes.tokens.access_token;
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    console.log("access Token", accessToken);

    const { email, name, picture } = userRes.data;
    // the user is authenticated now by google
    let existingUser = await user.findOne({ email });
    console.log("user is ", existingUser);

    if (!existingUser) {
      res.send("Please register");
      return;
    }
    const { _id } = existingUser;
    const token = await jwt.sign(
      { _id, email, accessToken },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TIMEOUT,
      }
    );
    console.log(token);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      path: "/",
      sameSite: "Lax", // Adjust SameSite setting for cross-site cookies
    });

    return res
      .status(200)
      .json({ message: "Sucess", token, existingUser, accessToken });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({ message: error.message });
  }
};

module.exports = { bookSlotController, googleLogin, registerUser };
