import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposePost } from './compose-post';

describe('ComposePost', () => {
  let component: ComposePost;
  let fixture: ComponentFixture<ComposePost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposePost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposePost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
