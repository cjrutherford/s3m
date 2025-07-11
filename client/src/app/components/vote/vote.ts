import { Component, Input, SimpleChange, SimpleChanges, signal } from '@angular/core';

import { UserProfile } from '../../services/user-profile';
import { VoteDto } from '../../dto';
import { Vote as VoteService } from '../../services/vote';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-vote',
  imports: [],
  providers: [
    VoteService,
    UserProfile,
  ],
  templateUrl: './vote.html',
  styleUrl: './vote.scss'
})
export class Vote {
  @Input() postId?: string;

  counts = signal<{ upvotes: number; downvotes: number }>({ upvotes: 0, downvotes: 0 });
  upvotes = signal<VoteDto[]>([]);
  downvotes = signal<VoteDto[]>([]);

  constructor(
    private readonly voteService: VoteService,
    private readonly userProfile: UserProfile
  ) {}

  ngOnInit() {
    if(!this.postId) return;
    this.voteService.getVoteCountsByPostId(this.postId).subscribe({
      next: (votes) => {
        this.counts.set({ upvotes: votes.upvotes, downvotes: votes.downvotes });
        this.upvotes.set(votes.votes.upvotes);
        this.downvotes.set(votes.votes.downvotes);
      },
      error: (error) => console.error('Error fetching votes:', error)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['postId'] && !changes['postId'].firstChange) {
      const newPostId = changes['postId'].currentValue;
      if (newPostId) {
        this.voteService.getVoteCountsByPostId(newPostId).subscribe({
          next: (votes) => {
            this.upvotes.set(votes.votes.upvotes);
            this.downvotes.set(votes.votes.downvotes);
            this.counts.set({ upvotes: votes.upvotes, downvotes: votes.downvotes });
          },
          error: (error) => console.error('Error fetching votes:', error)
        });
      }
    }
  }

  async processVote(type?: 'upvote' | 'downvote' | undefined) {
    if(!this.postId) return;

    const userProfile = await firstValueFrom(this.userProfile.getUserProfile());
    this.voteService.setVote({
      userProfileId: userProfile.id,
      postId: this.postId,
      voteType: type
    }).subscribe({
      next: (response) => {
        const { value, userProfile } = response;

        // Remove user from both lists first
        this.upvotes.set(this.upvotes().filter(v => v.userProfile.id !== userProfile.id));
        this.downvotes.set(this.downvotes().filter(v => v.userProfile.id !== userProfile.id));

        if (value === true) {
          this.upvotes.set([...this.upvotes(), response]);
        } else if (value === false) {
          this.downvotes.set([...this.downvotes(), response]);
        }

        // Update counts
        this.counts.set({
          upvotes: this.upvotes().length,
          downvotes: this.downvotes().length
        });
      },
      error: (error) => {
        console.error('Error processing vote:', error);
      }
    });
  }
}
