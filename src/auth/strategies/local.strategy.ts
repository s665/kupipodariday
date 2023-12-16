import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    return user;
  }
}
