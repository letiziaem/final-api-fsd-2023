import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface ITokenPayload {
  id: string;
  email: string;
  roles: [string];
}

class TokenService {
  private readonly secretKey: Secret | undefined =
    process.env.SECRET_ACCESS_TOKEN_KEY;

  generateAccessToken(user: any): string {
    try {
      console.log(user);
      if (!this.secretKey) {
        throw new Error("Internal error");
      }
      const payload = {
        id: user.id,
        email: user.email,
        roles: user.roles,
      };
      const accessToken = jwt.sign(payload, this.secretKey, {
        expiresIn: "15d",
      });
      return accessToken;
    } catch (error) {
      return "";
    }
  }
  validateAccessToken(token: string): ITokenPayload | null {
    try {
      if (!this.secretKey) {
        throw new Error("Internal error");
      }
      const userPayload = jwt.verify(token, this.secretKey) as ITokenPayload;
      return userPayload;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
