import { IsString, IsOptional, IsArray, IsEnum, MinLength, MaxLength } from 'class-validator';

export class CreateServerDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(200)
  shortDescription: string;

  @IsString()
  @MinLength(50)
  longDescription: string;

  @IsEnum(['OSRS', 'RS3', 'CUSTOM', 'PRE_EOC', 'RSPS'])
  gameType: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  discordUrl?: string;

  @IsOptional()
  @IsString()
  clientDownloadUrl?: string;

  @IsEnum(['NA', 'EU', 'AS', 'OCE', 'SA'])
  region: string;

  @IsOptional()
  @IsString()
  bannerImageUrl?: string;
}

export class UpdateServerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  @MinLength(50)
  longDescription?: string;

  @IsOptional()
  @IsEnum(['OSRS', 'RS3', 'CUSTOM', 'PRE_EOC', 'RSPS'])
  gameType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  discordUrl?: string;

  @IsOptional()
  @IsString()
  clientDownloadUrl?: string;

  @IsOptional()
  @IsEnum(['NA', 'EU', 'AS', 'OCE', 'SA'])
  region?: string;

  @IsOptional()
  @IsString()
  bannerImageUrl?: string;
}
