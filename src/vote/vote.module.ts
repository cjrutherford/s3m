import { InternalConfigModule } from 'src/internal-config/internal-config.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  providers: [VoteService],
  controllers: [VoteController],
  imports: [InternalConfigModule, UsersModule]
})
export class VoteModule {}
