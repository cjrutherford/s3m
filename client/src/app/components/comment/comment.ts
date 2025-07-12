import { Component, Input, OnChanges, OnInit, SimpleChanges, signal } from '@angular/core';

import { CommentDto } from '../../dto';
import { FollowActionComponent } from '../follow-action';

@Component({
  selector: 'app-comment',
  imports: [FollowActionComponent],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class Comment implements OnInit, OnChanges {
  @Input() comment?: CommentDto;

  profilePhoto = signal<string>('https://placehold.co/40x40');
  profileName = signal<string>('Anonymous');
  profileId = signal<string>('');

  ngOnInit() {
    this.loadProfileData();
  }

ngOnChanges(changes: SimpleChanges) {
    if (changes['comment'] && this.comment) {
      this.loadProfileData();
    }
  }

  private loadProfileData() {
    if (this.comment) {
      const profilePictureUrl = this.comment.userProfile?.profilePictureUrl;
      if (profilePictureUrl) {
        let photoUrl = profilePictureUrl;

        // If it's already a data URL, use as-is
        if (photoUrl.startsWith('data:')) {
          this.profilePhoto.set(photoUrl);
        }
        // If it's a relative path, build the asset URL
        else if (!photoUrl.startsWith('http')) {
          this.profilePhoto.set(`/api/asset/${photoUrl}`);
        }
        // Otherwise use as-is
        else {
          this.profilePhoto.set(photoUrl);
        }
      }
      this.profileId.set(this.comment.userProfile?.id || '');
      this.profileName.set(this.comment.userProfile?.name || 'Anonymous');
    }
  }
}
