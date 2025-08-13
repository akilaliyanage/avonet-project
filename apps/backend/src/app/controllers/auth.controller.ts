import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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
    } catch (error) {
      return {
        message: 'Error fetching users',
        error: error.message
      };
    }
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async testAuth(@Request() req) {
    return {
      message: 'Authentication successful!',
      user: req.user,
      timestamp: new Date().toISOString()
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
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

  @Get('profile/update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req) {
    // Use findOrCreateUser to ensure user exists
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
} 