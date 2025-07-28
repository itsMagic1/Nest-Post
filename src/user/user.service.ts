import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/accesor-control/roles.enum';
import { RoleDb } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RoleDb) private readonly RoleDbRepository: Repository<RoleDb>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const hashedPassword = await this.encryptPassword(createUserDto.password);    

    try {
      const roleEntities = await this.getRoles(createUserDto.role ? createUserDto.role : [Role.User]);

      const user = this.userRepository.create({...createUserDto, password: hashedPassword, roles: roleEntities});

      await this.userRepository.save(user);

      return user;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating User');
    }
  }

  async validateUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({ where: { username: createUserDto.username }});
    
        if (!user) {
          throw new NotFoundException('User not Found');
        }

    const isMatch = await this.validatePassword(createUserDto.password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException('Wrong Password')
    }

    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    return user;
  }

  private async encryptPassword(password) {
    const times = 5;
    const hashedPassword = await bcrypt.hash(password, times)
    return hashedPassword;
  }

  private async validatePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  private async getRoles(userRoles: string[]): Promise<RoleDb[]> {
    const roles = await this.RoleDbRepository.find({ where: { role: In(userRoles)}})
    return roles;
  }
}
