import { CommentDto, PostDto } from '../../dto';
import { Component, Input, signal } from '@angular/core';

import { Comment } from '../comment/comment';
import { Comment as CommentService } from '../../services/comment';
import { CommonModule } from '@angular/common';
import { ComposeComment } from '../compose-comment/compose-comment';
import { Vote } from '../vote/vote';

@Component({
  selector: 'app-post',
  imports: [CommonModule, Vote, ComposeComment, Comment],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post {
  @Input() post?: PostDto;
  showModal = signal<boolean>(false);
  comments = signal<CommentDto[]>([]);

  constructor(private readonly commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
  }
  private loadComments() {
    console.log('Loading comments for post: ', this.post);
    if (!this.post) return;

    console.log('past the early return ')
    this.commentService.getCommentsByPostId(this.post.id).subscribe({
      next: (comments) => {
        console.log('Comments loaded:', comments);
        this.comments.set(comments);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      }
    });
  }

  toggleModal() {
    this.showModal.set(!this.showModal());
  }

  buildAssetUrl(assetUrl: string): string {
    return `/api/asset/${assetUrl}`;
  }

  onCommentSave(comment: CommentDto) {
    this.post?.comments?.push(comment);
    this.toggleModal();
  }
}
