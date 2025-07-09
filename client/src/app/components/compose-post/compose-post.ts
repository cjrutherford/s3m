import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-compose-post',
  imports: [],
  templateUrl: './compose-post.html',
  styleUrl: './compose-post.scss'
})
export class ComposePost {
  @Output() contentPosted: EventEmitter<string> = new EventEmitter<string>();

  setPost() {
    const postContent = (document.getElementById('postContent') as HTMLInputElement).value;
    if(postContent.trim() !== '') {
      this.contentPosted.emit(postContent);
      (document.getElementById('postContent') as HTMLInputElement).value = ''; // Clear the input after posting
    }
  }
}
