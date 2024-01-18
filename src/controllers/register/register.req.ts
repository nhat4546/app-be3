// import { IsEmail, Length } from "class-validator";

// export class AccountReq {
//   @IsEmail()
//   email: string;

//   @Length(8, 20)
//   password: string;
// }

import Joi from "joi";

export const schemaRegister = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
