import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccountEntity } from "../account/account.entity";

import { BaseEntity } from "../base/base.entity";

@Entity({ name: "user" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, name: "account_id" })
  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: "id" })
  accountId: number;
}
