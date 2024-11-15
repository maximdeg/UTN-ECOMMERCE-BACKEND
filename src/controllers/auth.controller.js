import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import ENV from "../config/enviroment.config.js";
import ResponseBuilder from "../utils/builders/responseBuilder.js";
import User from "../models/user.model.js";
import UserRepository from "../repositories/user.repository.js";
import { sendEmail } from "../utils/mail.util.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existsUser = await UserRepository.getByEmail(email);

    if (existsUser) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setPayload({ detail: "The email is used by another user" })
        .setMessage("BAD_REQUEST")
        .build();
      return res.status(400).json(response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email: email }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_TIME,
    });

    const url_verification = `http://localhost:${ENV.PORT}/api/auth/verify/${verificationToken}`;

    const sentEmail = await sendEmail({
      to: email,
      subject: "Valida tu correo electronico",
      html: `
        <h1>Verificacion de correo electronico</h1>
        <p>Da click en el boton de abajo para verificar</p>
        <a 
            style='background-color: 'black'; color: 'white'; padding: 5px; border-radius: 5px;'
            href="${url_verification}"
        >Click aqui</a>
        `,
    });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    const response = new ResponseBuilder()
      .setOk(true)
      .setStatus(200)
      .setPayload({ detail: newUser, message: "User created" })
      .setMessage("SUCCESS")
      .build();
    return res.status(201).json(response);
  } catch (err) {
    const response = new ResponseBuilder()
      .setOk(false)
      .setStatus(400)
      .setPayload({ detail: "Server error" })
      .setMessage("INTERNAL_SERVER_ERROR")
      .build();
    return res.status(400).json(response);
  }
};

export const verifyMailValidationTokenController = async (req, res) => {
  try {
    const { verification_token } = req.params;

    if (!verification_token) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setPayload({ detail: "Invalid verification token" })
        .setMessage("BAD_REQUEST")
        .build();
      return res.status(400).json(response);
    }

    const decoded = jwt.verify(verification_token, ENV.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) throw new Error("USER NOT FOUND");

    // if (user.emailVerified) {
    //   // verification logic
    // }

    user.emailVerified = true;

    await user.save();

    const response = new ResponseBuilder()
      .setOk(true)
      .setMessage("SUCCESS")
      .setStatus(200)
      .setPayload({
        message: "Email verified successfully",
      })
      .build();

    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: validate
    const user = await UserRepository.getByEmail(email);

    if (!user) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(401)
        .setMessage("USER_NOT_FOUND")
        .setPayload({ detail: "User is not registrated. Please SIGN UP" })
        .build();

      return res.status(401).json(response);
    }

    if (!user.emailVerified) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(403) // Prohibited content for user without authorization or verification
        .setMessage("USER_NOT_VERIFIED")
        .setPayload({
          detail: "User not verified. Please go to your email to verify your profile",
        })
        .build();

      return res.status(403).json(response);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(401)
        .setMessage("INVALID_PASSWORD")
        .setPayload({
          detail: "The passwrod is not correct",
        })
        .build();

      return res.status(401).json(response);
    }

    const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_TIME,
    });

    const response = new ResponseBuilder()
      .setOk(true)
      .setStatus(200)
      .setMessage("Logged In")
      .setPayload({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
      .build();

    res.status(200).json(response);
  } catch (err) {
    const response = new ResponseBuilder()
      .setOk(false)
      .setStatus(500)
      .setMessage("INTERNAL_SERVER_ERROR")
      .setPayload({
        detail: err.message,
      })
      .build();

    res.status(500).json(response);
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    // TODO: validate email
    const user = await UserRepository.getByEmail(email);
    if (!user) {
      const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(401)
        .setMessage("USER_NOT_FOUND")
        .setPayload({ detail: "User is not registrated. Please SIGN UP" })
        .build();

      return res.status(401).json(response);
    }

    const resetToken = jwt.sign({ email: user.email }, ENV.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${ENV.FRONT_URL}/reset-password/${resetToken}`;

    sendEmail({
      to: user.email,
      subject: "Restablish password",
      html: `
      <div>
        <h1>Has solicitado restablecer tu contraseña</h1>
        <p>Haz click en el enlace: ${resetUrl}</p>
      </div>`,
    });

    const response = new ResponseBuilder()
      .setOk(true)
      .setStatus(200)
      .setMessage("SUCCESS")
      .setPayload({
        message: "Recovery password sent successfully",
      })
      .build();

    return res.status(200).json(response);
  } catch (err) {}
};

export const resetPasswordController = async (req, res) => {
  const { password } = req.body;
  const { reset_token } = req.params;

  const decoded = jwt.verify(reset_token, ENV.JWT_SECRET);

  if (!decoded) {
    const response = new ResponseBuilder()
      .setOk(false)
      .setStatus(401)
      .setMessage("INVALID_TOKEN")
      .setPayload({ detail: "The token is not valid" })
      .build();
    return res.status(401).json(response);
  }

  const user = await UserRepository.getByEmail(decoded.email);

  if (!user) {
    const response = new ResponseBuilder()
      .setOk(false)
      .setStatus(401)
      .setMessage("USER_NOT_FOUND")
      .setPayload({ detail: "User is not registrated. Please REGISTER" })
      .build();

    return res.status(401).json(response);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  await user.save();

  const response = new ResponseBuilder()
    .setOk(true)
    .setStatus(200)
    .setMessage("SUCCESS")
    .setPayload({
      message: "Password reset successfully",
    })
    .build();

  res.status(200).json(response);
};
