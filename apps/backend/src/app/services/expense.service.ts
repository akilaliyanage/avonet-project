import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument, ExpenseType } from '../schemas/expense.schema';
import { CreateExpenseDto, UpdateExpenseDto, FilterExpenseDto } from '../dto/expense.dto';
import { AuthService } from './auth.service';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    private authService: AuthService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, user: any) {
    const dbUser = await this.authService.findOrCreateUser(user);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    const expense = new this.expenseModel({
      ...createExpenseDto,
      userId: dbUser._id,
    });
    return expense.save();
  }

  async findAll(user: any, filters?: FilterExpenseDto) {
    const dbUser = await this.authService.findOrCreateUser(user);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    const query: any = { userId: dbUser._id };

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    if (filters?.minAmount || filters?.maxAmount) {
      query.amount = {};
      if (filters.minAmount) {
        query.amount.$gte = filters.minAmount;
      }
      if (filters.maxAmount) {
        query.amount.$lte = filters.maxAmount;
      }
    }

    return this.expenseModel.find(query).sort({ date: -1 });
  }

  async findOne(id: string, user: any) {
    const dbUser = await this.authService.findOrCreateUser(user);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    const expense = await this.expenseModel.findOne({
      _id: id,
      userId: dbUser._id,
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: any) {
    const expense = await this.findOne(id, user);
    
    Object.assign(expense, updateExpenseDto);
    return expense.save();
  }

  async remove(id: string, user: any) {
    const expense = await this.findOne(id, user);
    await this.expenseModel.deleteOne({ _id: id });
    return { message: 'Expense deleted successfully' };
  }

  async getMonthlyStats(user: any, year: number, month: number) {
    const dbUser = await this.authService.findOrCreateUser(user);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await this.expenseModel.find({
      userId: dbUser._id,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const expensesByType = expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseType, number>);

    return {
      totalAmount,
      count: expenses.length,
      expensesByType,
      startDate,
      endDate,
    };
  }

  async getExpenseAlert(user: any, year: number, month: number) {
    const dbUser = await this.authService.findOrCreateUser(user);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    const stats = await this.getMonthlyStats(user, year, month);
    const monthlyLimit = dbUser.monthlyExpenseLimit;
    
    const percentageUsed = (stats.totalAmount / monthlyLimit) * 100;
    
    return {
      totalAmount: stats.totalAmount,
      monthlyLimit,
      percentageUsed,
      isAlert: percentageUsed >= 90,
      alertMessage: percentageUsed >= 90 
        ? `Warning: You've used ${percentageUsed.toFixed(1)}% of your monthly budget!`
        : null,
    };
  }

  async getExpensePatterns(user: any, months: number = 6) {
    const dbUser = await this.authService.findOrCreateUser(user);
    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const expenses = await this.expenseModel.find({
      userId: dbUser._id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Group by month and type
    const patterns = expenses.reduce((acc, expense) => {
      const month = expense.date.getMonth();
      const year = expense.date.getFullYear();
      const key = `${year}-${month + 1}`;
      
      if (!acc[key]) {
        acc[key] = { month: key, total: 0, byType: {} };
      }
      
      acc[key].total += expense.amount;
      acc[key].byType[expense.type] = (acc[key].byType[expense.type] || 0) + expense.amount;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(patterns).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }
} 