import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
      const { password, ...rest } = user;
    return rest;
  }

  async logIn(createUserDto: CreateUserDto): Promise<{ access_token: string}> {
    const user = await this.userService.validateUser(createUserDto);

    const payload = {
      sub: user.id, 
      username: user.username, 
      role: user.roles.map((role) => role.role),
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
