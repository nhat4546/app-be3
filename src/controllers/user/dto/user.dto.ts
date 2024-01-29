import Joi from "joi";

export const updateProfileSchema = Joi.object({
  avatar: Joi.string(),
  userName: Joi.string(),
});
