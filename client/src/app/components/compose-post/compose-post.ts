import { Component, EventEmitter, Output } from '@angular/core';
import { ProfileType, UserProfile } from '../../services/user-profile';

import { MessageService } from '../../services/message';
import { PostDto } from '../../dto';
import { Post as PostService } from '../../services/post';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-compose-post',
  imports: [],
  providers: [PostService, UserProfile],
  templateUrl: './compose-post.html',
  styleUrl: './compose-post.scss'
})
export class ComposePost {
  @Output() contentPosted: EventEmitter<PostDto> = new EventEmitter<PostDto>();

  constructor(
    private readonly postService: PostService, 
    private readonly userProfile: UserProfile,
    private readonly messages: MessageService,
  ) {}

  async setPost() {
    const postContent = (document.getElementById('postContent') as HTMLInputElement).value;
    if(postContent.trim() !== '') {
      const userProfileId: ProfileType = await firstValueFrom(this.userProfile.getUserProfile());
      this.postService.createPost({ content: postContent, userProfileId: userProfileId.id }).subscribe({
        next: (post: PostDto) => {
          this.contentPosted.emit(post);
          (document.getElementById('postContent') as HTMLInputElement).value = ''; // Clear the input after posting
          this.messages.addMessage({ content: 'Post created successfully!', type: 'success' });
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.messages.addMessage({ content: 'Error creating post "' + postContent + '"', type: 'error' });
        }
      });
    }
  }
}
