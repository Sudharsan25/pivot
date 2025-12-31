import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum UrgeOutcome {
  RESISTED = 'resisted',
  GAVE_IN = 'gave_in',
  DELAYED = 'delayed',
}

export class CreateUrgeDto {
  @IsEnum(UrgeOutcome, {
    message: 'Outcome must be either "resisted", "gave_in", or "delayed"',
  })
  outcome: UrgeOutcome;

  @IsString()
  habitId: string; // required - reference to habit

  @IsOptional()
  @IsString()
  trigger?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
