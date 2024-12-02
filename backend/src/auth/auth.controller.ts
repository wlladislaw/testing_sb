import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { username, password }: { username: string; password: string },
  ) {
    const isAuth = await this.authService.login(username, password);

    if (isAuth) {
      return { message: 'Login successful' };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    this.authService.logout();
    return { message: 'Logout successful' };
  }
}
