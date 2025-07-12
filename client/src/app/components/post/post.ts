import { CommentDto, PostDto } from '../../dto';
import { Component, Input, signal } from '@angular/core';

import { Comment } from '../comment/comment';
import { Comment as CommentService } from '../../services/comment';
import { CommonModule } from '@angular/common';
import { ComposeComment } from '../compose-comment/compose-comment';
import { FollowActionComponent } from '../follow-action';
import { Vote } from '../vote/vote';

@Component({
  selector: 'app-post',
  imports: [CommonModule, Vote, ComposeComment, Comment, FollowActionComponent],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post {
  @Input() post?: PostDto;
  showModal = signal<boolean>(false);

  constructor(private readonly commentService: CommentService) {}

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
