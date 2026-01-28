import { Controller, Post, Get, Param, Request, Ip, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Post(':serverId')
  async vote(@Param('serverId') serverId: string, @Ip() ip: string, @Request() req) {
    const userId = req.user?.userId;
    return this.votesService.vote(serverId, ip, userId);
  }

  @Get(':serverId/count')
  async getVoteCount(@Param('serverId') serverId: string) {
    return this.votesService.getVoteCount(serverId);
  }

  @Get(':serverId/can-vote')
  async canVote(@Param('serverId') serverId: string, @Ip() ip: string, @Request() req) {
    const userId = req.user?.userId;
    return this.votesService.canVote(serverId, ip, userId);
  }

  @Get(':serverId/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Param('serverId') serverId: string) {
    return this.votesService.getServerVoteStats(serverId);
  }
}
