import { Component, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ComposePost } from '../../components/compose-post/compose-post';
import { Post } from '../../components/post/post';
import { PostDto } from '../../dto';
import { Post as PostService } from '../../services/post';

@Component({
  selector: 'app-feed',
  imports: [CommonModule, ComposePost, Post],
  providers: [PostService],
  templateUrl: './feed.html',
  styleUrl: './feed.scss'
})
export class Feed {
  posts = signal<PostDto[]>([]);

  constructor(private readonly postService: PostService) {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.find({}).subscribe((posts) => {
      this.posts.set(posts);
    });
  }

  addPost(content: PostDto) {
    const newPost: PostDto = { ...content, createdAt: new Date() };
    this.posts.update((prev) => [newPost, ...prev]);
  }
}
