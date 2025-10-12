
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, fullName: string, password: string) {
    const exist = await this.prisma.user.findUnique({ where: { email } });
    if (exist) throw new BadRequestException('Email already registered');
    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, fullName, password: hash } });
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new BadRequestException('Invalid credentials');
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { token };
  }
}
