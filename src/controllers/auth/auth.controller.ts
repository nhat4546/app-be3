import { NextFunction, Request, Response } from "express";
import { dataSource } from "../../connection/data-source";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { schemaLogin, schemaRegister, schemaVerifyRegister } from "./dto/auth.req";

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
      await schemaRegister.validateAsync(req.body);
      const email = req.body.email.toLocaleLowerCase();
      const password = req.body.password;

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

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      account.password = hash;
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
      console.log("ERRORS_REGISTER_ACCOUNT", errors);
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
        throw new Error("CODE_NOT_FOUND_OR_EXPIRED");
      }

      account.isVerify = true;
      account.token = "";
      await AuthController.accountRepository.save(account);

      res.status(200).json({
        status: 200,
        message: "VERIFY_REGISTER_SUCCESS",
      });
    } catch (errors) {
      console.log("ERRORS_VERIFY_ACCOUNT", errors);
      next(errors);
    }
  }

  async login(
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await schemaLogin.validateAsync(req.body);

      const email = req.body.email.toLowerCase();
      const password = req.body.password;

      const user = await AuthController.userRepository.findOneBy({ email });
      if (!user) {
        throw new Error("EMAIL_OR_PASSWORD_INCORRECT");
      }

      const account = await AuthController.accountRepository.findOneBy({
        id: user.id,
      });
      if (!account) {
        throw new Error("EMAIL_OR_PASSWORD_INCORRECT");
      }

      const isMatch = bcrypt.compareSync(password, account.password);
      if (!isMatch) {
        throw new Error("EMAIL_OR_PASSWORD_INCORRECT");
      }

      res.status(200).json({
        status: 200,
        message: "VERIFY_REGISTER_SUCCESS",
        data: {
          access_token: jwt.sign(
            {
              id: account.id,
              email: user.email,
            },
            process.env.JWT_SECRET || "",
            { expiresIn: 10000 }
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
