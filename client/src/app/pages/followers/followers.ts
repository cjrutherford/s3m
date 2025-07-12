import { Component, signal } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FollowDto } from '../../dto';
import { FollowService } from '../../services/follow.service';
import { ProfileType } from '../../services/user-profile';

@Component({
  selector: 'app-followers',
  imports: [],
  templateUrl: './followers.html',
  styleUrl: './followers.scss'
})
export class Followers {
  constructor(
    private readonly followService: FollowService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  followers = signal<ProfileType[]>([]);
  profileId = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.profileId.set(params['id']);
      } else {
        const loggedInProfileId = this.authService.getLoggedInProfileId();
        this.profileId.set(loggedInProfileId);
      }
      this.loadFollowers();
    });
  }

  private loadFollowers() {
    const profileId = this.profileId();
    if (profileId) {
      this.followService.followers(profileId).subscribe(followers => {
        console.log('Followers:', followers);
        const followerProfiles = followers.map(f => ({
          ...f.follower,
          profilePictureUrl: this.parseProfilePictureUrl(f.follower.profilePictureUrl),
        }));
        this.followers.set(followerProfiles);
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
