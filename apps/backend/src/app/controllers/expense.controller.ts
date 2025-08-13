import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto, UpdateExpenseDto, FilterExpenseDto } from '../dto/expense.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expenseService.create(createExpenseDto, req.user);
  }

  @Get()
  findAll(@Query() filters: FilterExpenseDto, @Request() req) {
    return this.expenseService.findAll(req.user, filters);
  }

  @Get('stats/monthly')
  getMonthlyStats(
    @Query('year') year: number,
    @Query('month') month: number,
    @Request() req,
  ) {
    return this.expenseService.getMonthlyStats(req.user, year, month);
  }

  @Get('stats/alert')
  getExpenseAlert(
    @Query('year') year: number,
    @Query('month') month: number,
    @Request() req,
  ) {
    return this.expenseService.getExpenseAlert(req.user, year, month);
  }

  @Get('stats/patterns')
  getExpensePatterns(
    @Query('months') months: number = 6,
    @Request() req,
  ) {
    return this.expenseService.getExpensePatterns(req.user, months);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.expenseService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expenseService.update(id, updateExpenseDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.expenseService.remove(id, req.user);
  }
} 