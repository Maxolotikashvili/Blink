import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserSectionComponent } from './chat-user-section.component';

describe('ChatUserSectionComponent', () => {
  let component: ChatUserSectionComponent;
  let fixture: ComponentFixture<ChatUserSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatUserSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatUserSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
