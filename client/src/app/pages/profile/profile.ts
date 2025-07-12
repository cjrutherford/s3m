/**
 * Profile page component: displays and allows editing of the user's profile.
 * - Loads user profile data
 * - Supports editing username, bio, and profile photo
 */

import { Component, signal } from '@angular/core';
import {
  CreateUserProfileDto,
  ProfileType,
  UserProfile,
} from '../../services/user-profile';
import { FollowDto, PostDto } from '../../dto';
import { firstValueFrom, take } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FollowService } from '../../services/follow.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message';
import { Post } from '../../components/post/post';
import { Post as PostService } from '../../services/post';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, Post],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(
    private readonly users: UsersService,
    private readonly messageService: MessageService,
    private readonly userProfile: UserProfile,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly postService: PostService,
    private readonly followService: FollowService,
  ) {
    this.route.params.pipe(take(1)).subscribe((params) => {
      if (params['id']) {
        this.viewProfileId.set(params['id']);
        this.checkIsFollowing(params['id']);
      } else {
        this.viewProfileId.set(null);
      }
      this.loadProfile();
      this.loadPosts();
    });
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      if (params['edit'] === 'true') {
        this.onEdit();
      }
    });
  }

  onMessage() {
    console.log('Message button clicked');
  }

  onFollow() {
    console.log('Follow button clicked');
    // this is the "follower" profile ID (the one doing the following)
    const loggedInProfileId = this.authService.getLoggedInProfileId();
    // this is the "following" profile ID (the one being followed)
    const viewProfileId = this.viewProfileId();
    if (!loggedInProfileId) {
      console.warn('No logged in profile ID found');
      this.messageService.addMessage({
        content: 'You must be logged in to follow users.',
        type: 'error',
      });
      return;
    }
    if (!viewProfileId) {
      console.warn('No profile ID to follow');
      this.messageService.addMessage({
        content: 'No profile selected to follow.',
        type: 'error',
      });
      return;
    }
    if (this.isFollowing()) {
      this.followService
        .unfollow({ followingId: viewProfileId, followerId: loggedInProfileId })
        .subscribe((returnData) => {
          console.log('Unfollow response:', returnData);
          this.isFollowing.set(false);
        });
    } else {
      this.followService
        .follow({ followingId: viewProfileId, followerId: loggedInProfileId })
        .subscribe((returnData) => {
          console.log('Follow response:', returnData);
          this.isFollowing.set(true);
        });
    }
  }

  posts = signal<PostDto[]>([]);
  username = signal('johndoe');
  profilePhotoUrl = signal('https://placehold.co/120');
  bio = signal('This is a short bio about John Doe.');
  viewProfileId = signal<string | null>(null);

  isFollowing = signal(false);

  isEditing = signal(false);
  editedUsername = signal(this.username());
  editedBio = signal(this.bio());
  editedProfilePhotoUrl = signal(this.profilePhotoUrl());

  private checkIsFollowing(profileId: string) {
    this.followService.followers(profileId).subscribe({
      next: (follows: FollowDto[]) => {
        const loggedInProfileId = this.authService.getLoggedInProfileId();
        if (!loggedInProfileId) {
          console.warn('No logged in profile ID found');
          this.isFollowing.set(false);
          return;
        }
        const followRecord = follows.find(
          (follow) => follow.follower.id === loggedInProfileId,
        );
        this.isFollowing.set(!!followRecord);
      },
      error: (err: any) => {
        console.error('Error checking follow status:', err);
      },
    });
  }

  loadProfile() {
    let profileLoader;
    const currentProfileId = this.viewProfileId();
    if (currentProfileId) {
      // If a specific profile ID is provided, load that profile
      profileLoader =
        this.userProfile.getUserProfileByProfileId(currentProfileId);
    } else {
      // Otherwise, load the logged-in user's profile
      profileLoader = this.userProfile.getUserProfile();
    }
    profileLoader.subscribe({
      next: (profile: ProfileType) => {
        if (profile) {
          this.authService.setProfile(profile);
          this.username.set(profile.name ?? 'johndoe');
          this.bio.set(profile.bio ?? 'This is a short bio about John Doe.');
          let setProfile =
            profile.profilePictureUrl ?? 'https://placehold.co/120x120';

          // If it's a data URL, use as-is
          if (setProfile.startsWith('data:')) {
            // do nothing, use as-is
          }
          // If it's a relative path (starts with /), prepend your API host
          else {
            setProfile = `/api/asset/${setProfile}`;
          }
          // Otherwise, use as-is (absolute URL, etc.)

          this.profilePhotoUrl.set(setProfile);

          // Keep edited fields in sync if not editing
          if (!this.isEditing()) {
            this.editedUsername.set(this.username());
            this.editedBio.set(this.bio());
            this.editedProfilePhotoUrl.set(this.profilePhotoUrl());
          }
        }
      },
      error: (err: any) => {
        console.error('Error loading profile:', err);
        this.messageService.addMessage({
          content: 'Failed to load profile. Please try again later.' + err,
          type: 'error',
        });
      },
    });
  }

  private loadPosts() {
    const currentProfileId = this.viewProfileId()
      ? this.viewProfileId()
      : this.authService.getLoggedInProfileId();
    if (!currentProfileId) {
      console.warn('No logged in profile ID found');
      return;
    }
    this.postService.find({ userProfileId: currentProfileId }).subscribe({
      next: (posts: PostDto[]) => {
        this.posts.set(posts);
      },
      error: (err: any) => {
        console.error('Error loading posts:', err);
        this.messageService.addMessage({
          content: 'Failed to load posts. Please try again later.' + err,
          type: 'error',
        });
      },
    });
  }

  onEdit() {
    this.isEditing.set(true);
    this.editedUsername.set(this.username());
    this.editedBio.set(this.bio());
    this.editedProfilePhotoUrl.set(this.profilePhotoUrl());
  }

  async onSave() {
    const createProfileDto: CreateUserProfileDto = {
      name: this.editedUsername(),
      bio: this.editedBio(),
      profilePictureUrl: this.editedProfilePhotoUrl(),
    };

    // Determine if this is a new profile or an update
    // If username and bio are both still the defaults, assume new profile
    const isNewProfile =
      this.username() === 'johndoe' &&
      this.bio() === 'This is a short bio about John Doe.';

    if (isNewProfile) {
      // Create new profile
      const profile = await firstValueFrom(
        this.users.createUser(createProfileDto),
      ).catch((err: any) => {
        console.error('Error creating profile:', err);
        this.messageService.addMessage({
          content: 'Failed to create profile. Please try again later.' + err,
          type: 'error',
        });
      });
      this.authService.setUser(profile.user, profile);
    } else {
      // Update existing profile
      const profileUpdate = await firstValueFrom(
        this.users.updateUser(createProfileDto),
      ).catch((err: any) => {
        console.error('Error updating profile:', err);
        this.messageService.addMessage({
          content: 'Failed to update profile. Please try again later.' + err,
          type: 'error',
        });
      });
      console.log('🚀 ~ Profile ~ onSave ~ profileUpdate:', profileUpdate);
      this.messageService.addMessage({
        content: 'Profile updated successfully!',
        type: 'success',
      });
    }

    // Update local state and exit edit mode
    this.username.set(this.editedUsername());
    this.bio.set(this.editedBio());
    this.profilePhotoUrl.set(this.editedProfilePhotoUrl());
    this.isEditing.set(false);
  }

  onCancel() {
    this.isEditing.set(false);
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editedProfilePhotoUrl.set(e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
