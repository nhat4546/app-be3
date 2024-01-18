import { Expose } from "class-transformer";

export class AccountRes {
  @Expose() id: number;
  @Expose() email: string;
  @Expose() user_name: string;
}
