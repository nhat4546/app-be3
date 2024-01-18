import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { dataSource } from "../../connection/data-source";
import { Account } from "../../entity/account/account.entity";
import { User } from "../../entity/user/user.entity";
import { schemaRegister } from "./register.req";
import { AccountRes } from "./register.res";

export const register = async (req: Request, res: Response) => {
  try {
    await schemaRegister.validateAsync(req.body);

    const accountRepository = dataSource.getRepository(Account);
    const userRepository = dataSource.getRepository(User);
    const account = new Account();
    const user = new User();
    user.email = req.body.email;
    await userRepository.save(user);

    account.password = req.body.password;
    account.userId = user.id;
    await accountRepository.save(account);

    res.json({
      data: plainToClass(AccountRes, { ...user, ...account }, { excludeExtraneousValues: true }),
    });
  } catch (errors) {
    // throw new Error(errors);
  }
};
