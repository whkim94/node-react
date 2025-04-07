import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { AuthenticationFailedException } from '../common/exceptions';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);

    if (!user) {
      throw new AuthenticationFailedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AuthenticationFailedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.generateToken(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Register the user
    const user = await this.usersService.register(createUserDto);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };

    // Return the token and user information
    return {
      access_token: this.generateToken(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private generateToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}
