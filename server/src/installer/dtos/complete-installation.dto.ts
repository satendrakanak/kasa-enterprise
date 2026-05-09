import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class InstallationDatabaseDto {
  @IsString()
  @MinLength(2)
  host!: string;

  @IsInt()
  @Min(1)
  port!: number;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  user!: string;
}

export class CompleteInstallationDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => InstallationDatabaseDto)
  database?: InstallationDatabaseDto;

  @IsString()
  @MinLength(2)
  siteName!: string;

  @IsOptional()
  @IsString()
  siteTagline?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsString()
  @MinLength(8)
  licenseKey!: string;

  @IsString()
  @MinLength(2)
  adminFirstName!: string;

  @IsString()
  @MinLength(2)
  adminLastName!: string;

  @IsEmail()
  adminEmail!: string;

  @IsString()
  @MinLength(8)
  adminPassword!: string;

  @IsOptional()
  @IsBoolean()
  importDemoData?: boolean;
}
