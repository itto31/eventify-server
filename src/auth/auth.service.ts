import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (dto.username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });

      if (existingUserByUsername) {
        throw new ForbiddenException('Usuario ya esta en uso');
      }
    }

    if (existingUserByEmail) {
      throw new ForbiddenException('El correo ya esta en uso');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          name: dto.name,
        },
      });
      delete user.password;

      return 'Cuenta creada con exito';
    } catch (e) {
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Credenciales invalidas');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credenciales invalidas');

    return this.signToken(user.userId, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
