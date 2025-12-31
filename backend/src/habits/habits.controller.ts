import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto, HabitType } from './dto/create-habit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as schema from '../db/schema';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getUserHabits(@CurrentUser() user: schema.User) {
    try {
      return await this.habitsService.getUserHabits(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @CurrentUser() user: schema.User,
  ) {
    try {
      // For custom habits, always set userId from auth context
      const habit = await this.habitsService.createHabit(
        createHabitDto.type === HabitType.CUSTOM ? user.id : null,
        createHabitDto.name,
        createHabitDto.type,
      );
      return habit;
    } catch (error) {
      throw error;
    }
  }
}
