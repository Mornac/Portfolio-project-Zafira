import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../app/auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';
import type {Response, Request} from 'express';
import {User} from '@prisma/client';
import {JwtAuthGuard} from '../../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
    );
  }

  // Vérification mail
  @Post('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // Login
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const {access_token, user} = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('auth_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Login successful',
      user,
      access_token,
    });
  }

  // Redirect to google auth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  // Callback after google verification
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: Request & { user?: User },
    @Res() res: Response,
  ) {
    const prismaUser = req.user;
    if (!prismaUser) {
      return res.status(401).json({message: 'No user found'});
    }

    const jwtUser: Pick<User, 'id' | 'email' | 'role' | 'firstName'> = {
      id: prismaUser.id,
      email: prismaUser.email,
      role: prismaUser.role,
      firstName: prismaUser.firstName || '', // fallback si pas défini
    };

    const token = this.authService.generateJwt(jwtUser);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl =
      process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:3000';
    return res.redirect(`${redirectUrl}/`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request & { user?: User }) {
    // req.user is fullfill via strategy jwt
    if (!req.user) {
      return {message: 'Not authenticated'};
    }
    return {user: req.user};
  }

  // Route pour logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return res.json({message: 'Logged out successfully'});
  }
}
