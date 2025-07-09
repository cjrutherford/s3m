import { InternalConfigModule } from 'src/internal-config/internal-config.module';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [InternalConfigModule, UsersModule],
  exports: [PostService]
})
export class PostModule {}
