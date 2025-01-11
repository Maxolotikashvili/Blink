import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatModalComponent } from './group-chat-modal.component';

describe('GroupChatModalComponent', () => {
  let component: GroupChatModalComponent;
  let fixture: ComponentFixture<GroupChatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupChatModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
