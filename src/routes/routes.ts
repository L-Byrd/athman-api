import express from "express";
import signInAuthentication from "../controllers/signin";
import bcrypt from "bcrypt";
import db from "../databases/postgres/db/db";
import handleRegister from "../controllers/register";

const router = express.Router();

router.route("/signin").post(signInAuthentication(db, bcrypt));

router.route("/register").post(handleRegister(db, bcrypt));

export default router;
