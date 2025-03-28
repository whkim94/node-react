import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ResourceConflictException } from '../common/exceptions';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user with this email already exists
    const existingUser = await this.findOne(createUserDto.email);

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

    // Return user without the password
    const { password, ...result } = user;
    return result;
  }
}
