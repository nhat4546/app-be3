import { plainToClass } from "class-transformer";

import { NextFunction, Request, Response } from "express";
import { dataSource } from "../../connection/data-source";
import { AccountEntity } from "../../entity/account/account.entity";
import { UserEntity } from "../../entity/user/user.entity";
import { AccountRes } from "./dto/account.res";

export class AccountController {
  static accountRepository = dataSource.getRepository(AccountEntity);
  static userRepository = dataSource.getRepository(UserEntity);
  static async getAccountById(id: number) {
    const account = await AccountController.userRepository.findOne({
      where: { id },
      relations: {
        accountId: undefined,
      },
    });

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    return plainToClass(AccountRes, account, { excludeExtraneousValues: true });
  }

  static async getAccountByEmail(email: string) {
    const account = await AccountController.userRepository.findOne({
      where: { email },
      relations: {
        accountId: undefined,
      },
    });

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    return plainToClass(AccountRes, account, { excludeExtraneousValues: true });
  }

  async getDetailAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await AccountController.getAccountById(req.account.id);

      res.status(200).json({
        status: 200,
        message: "GET_ACCOUNT_SUCCESS",
        data: account,
      });
    } catch (errors) {
      console.log("GET_ACCOUNT_FAIL", errors);
      next(errors);
    }
  }
}
