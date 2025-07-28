import { Body, Controller, Post,  } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  @Public()
  @ApiOperation({summary: 'Register a new User', parameters: []})
  @ApiResponse({ status: 201, description: 'Post created Sucessfully'})
  @ApiResponse({ status: 400, description: 'Validation Error'})
  @ApiParam({name: 'username', type: String, required: true, example: 'Username123' })
  @ApiParam({name: 'password', type: String, required: true, example: 'Password123' })
  @ApiParam({name: 'role', required: false, example: ['user', 'admin'] })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  @ApiOperation({summary: 'Login with a user'})
  @Post('login')
  @Public()
  async login(@Body() createUserDto: LoginDto) {
    return this.authService.logIn(createUserDto);
  }
}
