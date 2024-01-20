import { NextFunction, Request, Response } from "express";
import { dataSource } from "../../connection/data-source";

import { schemaRegister, schemaVerifyRegister } from "./const/auth.req";

import crypto from "crypto";
import { MoreThan } from "typeorm";
import { MailService } from "../../services/sendmail/sendmail.service";
import { AccountEntity } from "../../entity/account/account.entity";
import { UserEntity } from "../../entity/user/user.entity";

export class AuthController {
  static accountRepository = dataSource.getRepository(AccountEntity);
  static userRepository = dataSource.getRepository(UserEntity);
  static mailService = new MailService();
  async register(
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email = req.body.email.toLocaleLowerCase();
      const password = req.body.password;
      await schemaRegister.validateAsync(req.body);

      const isExistEmail = await AuthController.userRepository.findOne({
        where: {
          email,
        },
      });
      if (isExistEmail) {
        throw new Error("EXIST_EMAIL");
      }

      const user = new UserEntity();
      const account = new AccountEntity();

      const date = new Date();
      date.setDate(date.getDate() + 1);
      account.expireVerify = date;
      account.password = password;
      account.token = crypto.randomBytes(32).toString("hex");
      await AuthController.accountRepository.save(account);

      user.email = email;
      user.accountId = account.id;
      await AuthController.userRepository.save(user);

      const confirm_url = `${process.env.PUBLIC_URL}/register/verify?code=${account.token}`;
      await AuthController.mailService.sendMail(email, confirm_url);

      res.status(200).json({
        status: 200,
        message: "REGISTER_ACCOUNT_SUCCESS",
      });
    } catch (errors) {
      console.log("errors register account", errors);
      next(errors);
    }
  }

  async verifyRegister(req: Request<{ code: string }>, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      await schemaVerifyRegister.validateAsync({ code });

      const account = await AuthController.accountRepository.findOneBy({
        token: code,
        expireVerify: MoreThan(new Date()),
      });

      if (!account) {
        throw new Error("TOKEN_NOT_FOUND_OR_EXPIRED");
      }

      await AuthController.accountRepository.update(account, {
        isVerify: true,
        token: "",
      });

      res.status(200).json({
        status: 200,
        message: "VERIFY_REGISTER_SUCCESS",
      });
    } catch (errors) {
      console.log("errors verify account", errors);
      next(errors);
    }
  }
}
