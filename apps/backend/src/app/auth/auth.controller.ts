import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateProfileDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  async healthCheck() {
    return {
      message: 'Auth service is running',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    };
  }

  @Get('debug/users')
  async debugUsers() {
    try {
      const users = await this.authService.getAllUsers();
      return {
        message: 'Database users',
        count: users.length,
        users: users.map(user => ({
          id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name
        }))
      };
    } catch (error: any) {
      return {
        message: 'Error fetching users',
        error: error.message
      };
    }
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async testAuth(@Request() req: any) {
    return {
      message: 'Authentication successful!',
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.findOrCreateUser(req.user);
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      monthlyExpenseLimit: user.monthlyExpenseLimit,
      currency: user.currency,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() body: UpdateProfileDto, @Request() req: any) {
    const updated = await this.authService.updateUserProfile(req.user.userId, body);
    return {
      id: updated._id,
      email: updated.email,
      name: updated.name,
      picture: updated.picture,
      monthlyExpenseLimit: updated.monthlyExpenseLimit,
      currency: updated.currency,
    };
  }


} 