import * as jwt from "jsonwebtoken";
import { apiError } from "./api";

function auth(token: string, next: (err?: any, userId?: string) => void) {
  if (!token) return next(apiError("Token is required", 401));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

    return next(null, decoded.id);
  } catch (e) {
    return next(apiError("Token is not valid", 400));
  }
}

export default auth;
