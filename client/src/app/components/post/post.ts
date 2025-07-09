import { Component, Input } from '@angular/core';
import { PostDto } from '../../dto';
import { CommonModule } from '@angular/common';
import { Vote } from '../vote/vote';

@Component({
  selector: 'app-post',
  imports: [CommonModule, Vote],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post {
  @Input() post?: PostDto;
}
