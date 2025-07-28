import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleDb } from "./role.entity";
import { Post } from "src/post/entities/post.entity";
import { Comment } from "src/comment/entities/comment.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true})
  username: string;

  @Column('text')
  password: string;

  @ManyToMany(() => RoleDb, (roleDb) => roleDb.users, {eager: true})
  @JoinTable()
  roles: RoleDb[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @CreateDateColumn()
  created_at: Date;
}