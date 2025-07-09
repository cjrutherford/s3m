import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AssetModule } from './asset/asset.module';
import { PostModule } from './post/post.module';
import { VoteModule } from './vote/vote.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthenticationModule, 
    UsersModule, 
    AssetModule, PostModule, VoteModule, CommentModule, FollowModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
