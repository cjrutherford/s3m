import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeComment } from './compose-comment';

describe('ComposeComment', () => {
  let component: ComposeComment;
  let fixture: ComponentFixture<ComposeComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposeComment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposeComment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
