import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { InternalConfigModule } from 'src/internal-config/internal-config.module';
import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [InternalConfigModule, UsersModule, PostModule]
})
export class CommentModule {}
