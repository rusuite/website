import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async vote(serverId: string, ipAddress: string, userId?: string) {
    // Check if user/IP has voted recently (within 12 hours)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const recentVote = await this.prisma.vote.findFirst({
      where: {
        serverId,
        OR: [
          { ipAddress, createdAt: { gte: twelveHoursAgo } },
          userId ? { userId, createdAt: { gte: twelveHoursAgo } } : {},
        ],
      },
    });

    if (recentVote) {
      const timeSinceVote = Date.now() - recentVote.createdAt.getTime();
      const hoursRemaining = Math.ceil((12 * 60 * 60 * 1000 - timeSinceVote) / (60 * 60 * 1000));
      throw new BadRequestException(
        `You can vote again in ${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''}`,
      );
    }

    // Create the vote
    const vote = await this.prisma.vote.create({
      data: {
        serverId,
        ipAddress,
        userId,
      },
    });

    // Get updated vote count
    const voteCount = await this.prisma.vote.count({
      where: { serverId },
    });

    return {
      success: true,
      voteCount,
      message: 'Vote recorded successfully!',
    };
  }

  async getVoteCount(serverId: string) {
    const count = await this.prisma.vote.count({
      where: { serverId },
    });

    return { serverId, voteCount: count };
  }

  async canVote(serverId: string, ipAddress: string, userId?: string) {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const recentVote = await this.prisma.vote.findFirst({
      where: {
        serverId,
        OR: [
          { ipAddress, createdAt: { gte: twelveHoursAgo } },
          userId ? { userId, createdAt: { gte: twelveHoursAgo } } : {},
        ],
      },
    });

    if (recentVote) {
      const timeSinceVote = Date.now() - recentVote.createdAt.getTime();
      const secondsRemaining = Math.ceil((12 * 60 * 60 * 1000 - timeSinceVote) / 1000);
      const nextVoteAt = new Date(recentVote.createdAt.getTime() + 12 * 60 * 60 * 1000);
      
      return {
        canVote: false,
        secondsRemaining,
        nextVoteAt,
      };
    }

    return {
      canVote: true,
      secondsRemaining: 0,
    };
  }

  async getServerVoteStats(serverId: string, days: number = 7) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const votes = await this.prisma.vote.findMany({
      where: {
        serverId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group votes by day
    const votesByDay: { [key: string]: number } = {};
    
    votes.forEach((vote) => {
      const day = vote.createdAt.toISOString().split('T')[0];
      votesByDay[day] = (votesByDay[day] || 0) + 1;
    });

    return {
      total: votes.length,
      votesByDay,
    };
  }
}
