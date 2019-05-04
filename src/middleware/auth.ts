// import * as config from "config";
import * as jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { apiError } from "./api";
// import { RequestHandler } from "express";

function auth(token: string, next: (err?: any, userId?: string) => void) {
  // const token = req.header("x-auth-token");

  // Check for token
  if (!token) next(apiError("no token, authorization denied", 401));
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    // Add user from payload
    // req.user = decoded;
    next(null, decoded.id);
  } catch (e) {
    // res.status(400).json({ msg: "token is not valid" });
    if (!token) next(apiError("token is not valid", 400));
  }
}

export default auth;
