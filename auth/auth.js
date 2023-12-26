import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

import User from "../models/user.js";
import capitalizeFirstLetter from "../utils/firstLetterUpper.js";

export const register = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Login details not provided" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password less than 6 characters." });
  }

  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      })
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            {
              id: user._id,
              username,
              role: user.role,
            },
            jwtSecret,
            { expiresIn: maxAge }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully created",
            user: user._id,
          });
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ message: "An error occured", error: error.message });
        });
    });
  } catch (error) {
    res.status(401).json({
      message: "User not created.",
      error: error.message,
    });
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.status(400).json({ message: "Username or password not provided." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Error logging in", error: error.message });
    } else {
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ message: "An error occured", error: error.message });
  }
};

export const logout = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    res.clearCookie("jwt").status(200).json({ message: "Log out successful" });
    res.end();
  }
};

export const update = async (req, res, next) => {
  const { role, id } = req.body;

  if (role && id) {
    if (role === "admin" || role === "basic") {
      await User.findById(id).then((user) => {
        if (user.role !== role) {
          user.role = role;
          user
            .save()
            .then((user) => {
              return res
                .status("201")
                .json({ message: "Update successful", user });
            })
            .catch((error) => {
              return res
                .status(400)
                .json({ message: "An error occured", error: error.message });
            });
        } else {
          return res.status(400).json({
            message: `User is already a${
              role === "admin" ? "n" : ""
            } ${capitalizeFirstLetter(role)} user`,
          });
        }
      });
    } else {
      return res.status(400).json({
        message: "Role is not admin",
      });
    }
  } else {
    return res.status(400).json({ message: "Role or Id not present" });
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id).then((user) => {
    user
      .remove()
      .then((user) => {
        res.status(200).json({ message: "User deleted successfully", user });
      })
      .catch((error) => {
        res
          .status(400)
          .json({ message: "An error occured", error: error.message });
      });
  });
};
