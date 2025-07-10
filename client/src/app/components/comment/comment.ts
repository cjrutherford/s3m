import { Component, Input } from '@angular/core';

import { CommentDto } from '../../dto';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class Comment {
  @Input() comment?: CommentDto;

  wrapProfileUrl(url: string): string {
    return `/api/asset/${url}`;
  }

  isProfilePicture(comment?: CommentDto): boolean {
    if (!comment?.userProfile) {
      return false;
    }
    return !!comment.userProfile?.profilePictureUrl;
  }

}
