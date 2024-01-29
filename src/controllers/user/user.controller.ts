import { NextFunction, Request, Response } from "express";
import { dataSource } from "../../connection/data-source";
import { UserEntity } from "../../entity/user/user.entity";
import { updateProfileSchema } from "./dto/user.dto";

export class UserController {
  static userRepository = dataSource.getRepository(UserEntity);

  static async getAccountById(id: number) {
    const account = await UserController.userRepository.findOne({
      where: { id },
      relations: {
        accountId: undefined,
      },
    });

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    return account;
  }

  static async getAccountByEmail(email: string) {
    const account = await UserController.userRepository.findOne({
      where: { email },
      relations: {
        accountId: undefined,
      },
    });

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    return account;
  }

  async updateProfile(
    req: Request<{}, {}, { avatar: string; userName: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.account.id;
      const data = req.body;
      await updateProfileSchema.validateAsync(data);

      const user = await UserController.getAccountById(id);
      user.avatarUrl = data.avatar;
      user.user_name = data.userName;
      user.avatarUrl = req.account.avatarUrl;

      await UserController.userRepository.save(user);
      res.status(200).json({
        status: 200,
        message: "UPDATE_PROFILE_SUCCESS",
        data: user,
      });
    } catch (error) {
      console.log("UPDATE_PROFILE_FAIL", error);
      next(error);
    }
  }
}
