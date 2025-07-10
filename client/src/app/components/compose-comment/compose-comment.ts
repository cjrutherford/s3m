import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommentDto } from '../../dto';
import { Comment as CommentService } from '../../services/comment';
import { MessageService } from '../../services/message';
import { UserProfile } from '../../services/user-profile';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-compose-comment',
  imports: [],
  providers: [CommentService, UserProfile, MessageService],
  templateUrl: './compose-comment.html',
  styleUrl: './compose-comment.scss'
})
export class ComposeComment {
  @Input() postId?: string;
  @Output() onCommentSave: EventEmitter<CommentDto> = new EventEmitter<CommentDto>();
  constructor(
    private readonly commentService: CommentService,
    private readonly profileService: UserProfile,
    private readonly messageService: MessageService
  ) {}

  async saveComment() {
    const comment = (document.getElementById('comment') as HTMLInputElement).value;
    const profile = await firstValueFrom(this.profileService.getUserProfile());
    this.commentService.createComment({
      content: comment,
      postId: this.postId!,
      userProfileId: profile.id
    }).subscribe({
      next: (createdComment) => {
        this.onCommentSave.emit(createdComment);
        this.messageService.addMessage({ content: 'Comment created successfully!', type: 'success' });
        (document.getElementById('comment') as HTMLInputElement).value = '';
      },
      error: (err) => {
        (document.getElementById('comment') as HTMLInputElement).value = '';
        console.error('Error creating comment:', err);
        this.messageService.addMessage({ content: 'Error creating comment', type: 'error' });
      }
    })
  }
}
