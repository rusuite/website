import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateServerDto, UpdateServerDto } from './servers.dto';

@Injectable()
export class ServersService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(userId: string, createServerDto: CreateServerDto) {
    const slug = this.generateSlug(createServerDto.name);

    // Check if slug already exists
    const existingServer = await this.prisma.server.findUnique({
      where: { slug },
    });

    if (existingServer) {
      // Add a random suffix if slug exists
      const randomSuffix = Math.random().toString(36).substring(7);
      const newSlug = `${slug}-${randomSuffix}`;
      
      return this.prisma.server.create({
        data: {
          ...createServerDto,
          slug: newSlug,
          ownerId: userId,
          status: 'PENDING',
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
    }

    return this.prisma.server.create({
      data: {
        ...createServerDto,
        slug,
        ownerId: userId,
        status: 'PENDING',
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    gameType?: string;
    tags?: string[];
    search?: string;
    sortBy?: 'votes' | 'newest' | 'players';
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'APPROVED',
    };

    if (params?.gameType) {
      where.gameType = params.gameType;
    }

    if (params?.tags && params.tags.length > 0) {
      where.tags = {
        hasSome: params.tags,
      };
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { shortDescription: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };

    if (params?.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [servers, total] = await Promise.all([
      this.prisma.server.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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

    // Add vote count to each server
    const serversWithVotes = servers.map((server) => ({
      ...server,
      voteCount: (server as any)._count.votes,
      _count: undefined,
    }));

    // Sort by votes if requested
    if (params?.sortBy === 'votes') {
      serversWithVotes.sort((a, b) => b.voteCount - a.voteCount);
    }

    return {
      servers: serversWithVotes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const server = await this.prisma.server.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        clickStats: true,
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    return {
      ...server,
      voteCount: (server as any)._count.votes,
      _count: undefined,
    };
  }

  async update(serverId: string, userId: string, userRole: string, updateServerDto: UpdateServerDto) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    // Only owner or admin can update
    if (server.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to update this server');
    }

    // If name is being updated, regenerate slug
    let slug = server.slug;
    if (updateServerDto.name && updateServerDto.name !== server.name) {
      slug = this.generateSlug(updateServerDto.name);
    }

    return this.prisma.server.update({
      where: { id: serverId },
      data: {
        ...updateServerDto,
        slug,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(serverId: string, userId: string, userRole: string) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      throw new NotFoundException('Server not found');
    }

    // Only owner or admin can delete
    if (server.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this server');
    }

    await this.prisma.server.delete({
      where: { id: serverId },
    });

    return { message: 'Server deleted successfully' };
  }

  async findUserServers(userId: string) {
    return this.prisma.server.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
        clickStats: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async trackClick(serverId: string, type: 'WEBSITE' | 'DISCORD' | 'CLIENT') {
    // Check if click stat exists
    const clickStat = await this.prisma.clickStat.findUnique({
      where: {
        serverId_type: {
          serverId,
          type,
        },
      },
    });

    if (clickStat) {
      return this.prisma.clickStat.update({
        where: { id: clickStat.id },
        data: {
          count: { increment: 1 },
          lastUpdated: new Date(),
        },
      });
    }

    return this.prisma.clickStat.create({
      data: {
        serverId,
        type,
        count: 1,
      },
    });
  }
}
