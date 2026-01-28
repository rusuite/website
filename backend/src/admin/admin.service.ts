import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllServers(params?: { page?: number; limit?: number; status?: string }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.status) {
      where.status = params.status;
    }

    const [servers, total] = await Promise.all([
      this.prisma.server.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
      }),
      this.prisma.server.count({ where }),
    ]);

    return {
      servers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateServerStatus(serverId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    return this.prisma.server.update({
      where: { id: serverId },
      data: { status },
    });
  }

  async deleteServer(serverId: string) {
    await this.prisma.server.delete({
      where: { id: serverId },
    });

    return { message: 'Server deleted successfully' };
  }

  async getAllUsers(params?: { page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              servers: true,
              votes: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async getAnalytics() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalServers,
      totalUsers,
      totalVotes,
      votesToday,
      votesThisWeek,
      pendingServers,
      approvedServers,
    ] = await Promise.all([
      this.prisma.server.count(),
      this.prisma.user.count(),
      this.prisma.vote.count(),
      this.prisma.vote.count({ where: { createdAt: { gte: dayAgo } } }),
      this.prisma.vote.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.server.count({ where: { status: 'PENDING' } }),
      this.prisma.server.count({ where: { status: 'APPROVED' } }),
    ]);

    return {
      totalServers,
      totalUsers,
      totalVotes,
      votesToday,
      votesThisWeek,
      pendingServers,
      approvedServers,
    };
  }
}
