import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto, UpdateServerDto } from './servers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('gameType') gameType?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: 'votes' | 'newest' | 'players',
  ) {
    return this.serversService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      gameType,
      tags: tags ? tags.split(',') : undefined,
      search,
      sortBy,
    });
  }

  @Get('my-servers')
  @UseGuards(JwtAuthGuard)
  async getMyServers(@Request() req) {
    return this.serversService.findUserServers(req.user.userId);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.serversService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createServerDto: CreateServerDto) {
    return this.serversService.create(req.user.userId, createServerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    return this.serversService.update(id, req.user.userId, req.user.role, updateServerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req) {
    return this.serversService.delete(id, req.user.userId, req.user.role);
  }

  @Post(':id/click/:type')
  async trackClick(@Param('id') id: string, @Param('type') type: 'WEBSITE' | 'DISCORD' | 'CLIENT') {
    return this.serversService.trackClick(id, type);
  }
}
