import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum UrgeOutcome {
  RESISTED = 'resisted',
  GAVE_IN = 'gave_in',
}

export class CreateUrgeDto {
  @IsEnum(UrgeOutcome, {
    message: 'Outcome must be either "resisted" or "gave_in"',
  })
  outcome: UrgeOutcome;

  @IsString()
  urgeType: string; // required

  @IsOptional()
  @IsString()
  trigger?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
