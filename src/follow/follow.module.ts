import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { InternalConfigModule } from '../internal-config/internal-config.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [InternalConfigModule]
})
export class FollowModule {}
