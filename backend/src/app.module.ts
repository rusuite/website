import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServersModule } from './servers/servers.module';
import { VotesModule } from './votes/votes.module';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [AuthModule, UsersModule, ServersModule, VotesModule, AdminModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
