import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne({ username });

    const verifyPassword = await this.hashService.verify(
      password,
      user.password,
    );

    if (user && verifyPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async auth(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
