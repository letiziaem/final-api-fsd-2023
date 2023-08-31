import { Response, Request, NextFunction } from "express";
import TokenService from "./../services/TokenService.js";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string,
        email: string,
        roles: string[];
      };
    }
  }
}
export default function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized"});
  }
  const token = authToken.split(' ')[1]; // Extract the token from Bearer

  const decodedPayload = TokenService.validateAccessToken(token);

  if (!decodedPayload) {
    return res.status(401).json({ error: "Invalid Bearer token"});
  }

  req.user = decodedPayload;

  next();
}