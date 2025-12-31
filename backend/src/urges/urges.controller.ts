/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { UrgesService } from './urges.service';
import { CreateUrgeDto } from './dto/create-urge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as schema from '../db/schema';

@Controller('urges')
@UseGuards(JwtAuthGuard)
export class UrgesController {
  constructor(private readonly urgesService: UrgesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUrge(
    @Body() createUrgeDto: CreateUrgeDto,
    @Req() req: Request,
    @CurrentUser() user: schema.User,
  ) {
    // Debug: log auth header and current user

    console.debug('[UrgesController.createUrge] current user:', user);
    try {
      const urge = await this.urgesService.logUrge(
        user.id,
        createUrgeDto.outcome,
        createUrgeDto.habitId,
        createUrgeDto.trigger,
        createUrgeDto.notes,
      );

      // Convert createdAt to ISO string format
      return {
        ...urge,
        createdAt: urge.createdAt.toISOString(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to create urge');
    }
  }

  @Get()
  async getUserUrges(
    @Req() req: Request,
    @CurrentUser() user: schema.User,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    console.debug('[UrgesController.getUserUrges] current user:', user);
    try {
      const result = await this.urgesService.getUserUrges(
        user.id,
        limit,
        offset,
      );

      // Convert createdAt timestamps to ISO format
      return {
        ...result,
        urges: result.urges.map((urge) => ({
          ...urge,
          createdAt: urge.createdAt.toISOString(),
        })),
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve urges');
    }
  }

  @Get('stats')
  async getUrgeStats(@CurrentUser() user: schema.User, @Req() req: Request) {
    // For stats, we also log the auth header via request
    // If needed, accept @Req() to inspect headers

    try {
      return await this.urgesService.getUrgeStats(user.id);
    } catch (error) {
      throw new BadRequestException('Failed to retrieve urge statistics');
    }
  }

  @Get('stats/by-type')
  async getUrgeStatsByType(
    @CurrentUser() user: schema.User,
    @Req() req: Request,
  ) {
    try {
      return await this.urgesService.getUrgeStatsByType(user.id);
    } catch (error) {
      throw new BadRequestException(
        'Failed to retrieve urge statistics by type',
      );
    }
  }

  @Get('stats/time-series')
  async getUrgeTimeSeries(
    @CurrentUser() user: schema.User,
    @Req() req: Request,
    @Query('date') date?: string,
    @Query('bucket', new DefaultValuePipe('hour'))
    bucket: 'day' | 'hour' = 'hour',
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number = 30,
  ) {
    console.log(
      `[UrgesController.getUrgeTimeSeries] userId=${user.id}, date=${date}, bucket=${bucket}, days=${days}`,
    );
    try {
      const result = await this.urgesService.getUrgeTimeSeries(
        user.id,
        bucket,
        days,
        date,
      );
      console.log(
        `[UrgesController.getUrgeTimeSeries] Returning ${result.length} entries`,
      );
      return result;
    } catch (error) {
      console.error('[UrgesController.getUrgeTimeSeries] Error:', error);
      throw new BadRequestException('Failed to retrieve time-series data');
    }
  }
}
