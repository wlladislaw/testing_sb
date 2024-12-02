import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private loggedUser: string | null = null;

  async login(username: string, password: string) {
    await new Promise((res) => setTimeout(res, 1000));

    if (username === 'login1' && password === 'pass1') {
      this.loggedUser = username;
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.loggedUser = null;
  }
}
