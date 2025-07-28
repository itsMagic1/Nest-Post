import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../accesor-control/roles.enum";
import { User } from "./user.entity";

@Entity()
export class RoleDb {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { default: Role.User})
    role: Role;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}