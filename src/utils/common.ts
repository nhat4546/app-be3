import jwt from "jsonwebtoken";

export const generateToken = (payload: any, secretKey: string, expiresIn: string) => {
  return jwt.sign(payload, secretKey, { expiresIn: Number(expiresIn) });
};

export const verifyToken = (token: string, secretKey: string) => {
  return jwt.verify(token, secretKey);
};
