import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vote',
  imports: [],
  templateUrl: './vote.html',
  styleUrl: './vote.scss'
})
export class Vote {
  @Input() up: number = 0;
  @Input() down: number = 0;

  processVote(type?: 'up' | 'down') {
    if (type === 'up') {
      this.up++;
    } else if (type === 'down') {
      this.down++;
    }
  }
}
