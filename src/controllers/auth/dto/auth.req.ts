import Joi from "joi";

export const schemaRegister = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const schemaVerifyRegister = Joi.object({
  code: Joi.string().hex().required(),
});

export const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
