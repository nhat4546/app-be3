import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({
    name: "is_verify",
    type: Boolean,
    default: false,
  })
  isVerify: string;

  @Column({ nullable: true })
  token: string;

  @Column({ name: "expire_verify", nullable: true })
  expireVerify: Date;

  @Column({ name: "user_id" })
  @OneToOne(() => User)
  userId: number;
}
