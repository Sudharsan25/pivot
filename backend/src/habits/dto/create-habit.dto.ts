import { IsEnum, IsString, IsOptional } from 'class-validator';

export enum HabitType {
  STANDARD = 'standard',
  CUSTOM = 'custom',
}

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsEnum(HabitType)
  type: HabitType;

  @IsOptional()
  @IsString()
  userId?: string; // Optional, will be set from auth context for custom habits
}

