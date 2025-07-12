import { Component, Input, OnInit, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Follow } from '../../services/follow';
import { FollowDto } from '../../dto';
import { FollowService } from '../../services/follow.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [FollowService, AuthService],
  selector: 'app-follow-action',
  templateUrl: './follow-action.component.html',
  styleUrls: ['./follow-action.component.scss'],
})
export class FollowActionComponent implements OnInit {
  @Input() profileId!: string;
  @Input() profileName!: string;
  @Input() profilePhotoUrl?: string;

  isFollowing = signal(false);
  isOwnProfile = signal(false);
  loading = signal(false);
  isHovering = signal(false);

  constructor(
    private readonly followService: FollowService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const loggedInProfileId = this.authService.getLoggedInProfileId();
    this.isOwnProfile.set(loggedInProfileId === this.profileId);
    if (!this.isOwnProfile()) {
      this.followService
        .followers(this.profileId)
        .subscribe((followers: FollowDto[]) => {
          const followRecord = followers.find(f => f.follower.id === this.authService.getLoggedInProfileId());
          this.isFollowing.set(!!followRecord);
        });
    }
  }

  toggleHover(): void {
    this.isHovering.set(!this.isHovering());
  }

  viewProfile(): void {
    console.log('Viewing profile:', this.profileId);
    this.router.navigate(['/profile', this.profileId]);
  }

  toggleFollow(): void {
    console.log('Toggling follow for profile:', this.profileId);
    this.loading.set(true);
    const followee = this.authService.getLoggedInProfileId();
    if (!followee) {
      console.error('No logged-in user found');
      this.loading.set(false);
      return;
    }
    if (this.isFollowing()) {
      this.followService.unfollow({ followingId: this.profileId, followerId: followee }).subscribe(() => {
        this.isFollowing.set(false);
        this.loading.set(false);
      });
    } else {
      this.followService.follow({ followingId: this.profileId, followerId: followee }).subscribe(() => {
        this.isFollowing.set(true);
        this.loading.set(false);
      });
    }
  }
}
