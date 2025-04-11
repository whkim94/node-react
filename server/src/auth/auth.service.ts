import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticationFailedException } from '../common/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { ResourceConflictException } from '../common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.findUserByEmail(loginDto.email);

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
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user with this email already exists
    const existingUser = await this.findUserByEmail(createUserDto.email);

    if (existingUser) {
      throw new ResourceConflictException(
        'User with this email',
        'already exists',
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };

    // Return the token and user information (without password)
    const { password, ...userWithoutPassword } = user;
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async validateUser(payload: { sub: string; email: string }) {
    const user = await this.findUserById(payload.sub);
    if (!user) {
      return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
