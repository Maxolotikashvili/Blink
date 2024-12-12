import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFriendsSectionComponent } from './chat-friend-section.component';

describe('ChatUserDetailsComponent', () => {
  let component: ChatFriendsSectionComponent;
  let fixture: ComponentFixture<ChatFriendsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatFriendsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatFriendsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
