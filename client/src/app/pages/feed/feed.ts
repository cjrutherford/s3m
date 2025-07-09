import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ComposePost } from '../../components/compose-post/compose-post';
import { Post } from '../../components/post/post';
import { PostDto } from '../../dto';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, ComposePost, Post],
  templateUrl: './feed.html',
  styleUrl: './feed.scss'
})
export class Feed {
  posts = signal<PostDto[]>([]);

  addPost(content: string) {
    const newPost: PostDto = { id: 'abcxyz', createdAt: new Date(), content, userProfileId: 'user123', comments: [], votes: [] };
    this.posts.update((prev) => [...prev, newPost]);
  }
}
