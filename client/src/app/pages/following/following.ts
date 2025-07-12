import { Component, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FollowService } from '../../services/follow.service';
import { ProfileType } from '../../services/user-profile';

@Component({
  selector: 'app-following',
  imports: [],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  constructor(
    private readonly followService: FollowService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
  ) {}

  following = signal<ProfileType[]>([]);
  profileId = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.profileId.set(params['id']);
      } else {
        const loggedInProfileId = this.authService.getLoggedInProfileId();
        this.profileId.set(loggedInProfileId);
      }
      this.loadFollowing();
    });
  }

  private loadFollowing() {
    const profileId = this.profileId();
    if (profileId) {
      this.followService.following(profileId).subscribe((following) => {
        console.log('Following:', following);
        const followingProfiles = following.map((follow) => ({
          ...follow.following,
          profilePictureUrl: this.parseProfilePictureUrl(follow.following.profilePictureUrl),
        }));
        this.following.set(followingProfiles);
      });
    }
  }

  private parseProfilePictureUrl(url: string): string {
    // Implement your logic to parse the profile picture URL
    if (url.startsWith('data:')) {
      return url;
    } else if (url.startsWith('http')) {
      return url;
    } else {
      return `/api/asset/${url}`;
    }
  }
}
