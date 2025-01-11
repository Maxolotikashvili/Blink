import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Friend } from "../model/friend.model";
import { GroupChat } from "../model/user.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private lastSelectedFriendSubject: Subject<Friend | ''> = new Subject();
    public lastSelectedFriend$: Observable<Friend> = this.lastSelectedFriendSubject as Observable<Friend>;

    private lastSelectedGroupChatSubject: Subject<GroupChat | ''> = new Subject();
    public lastSelectedGroupChat$: Observable<GroupChat> = this.lastSelectedGroupChatSubject as Observable<GroupChat>;

    public updateLastSelectedFriend(friend: Friend | '') {
        this.lastSelectedGroupChatSubject.next('');
        this.lastSelectedFriendSubject.next(friend);
    }

    public updateLastSelectedGroupChat(groupChat: GroupChat) {
        this.lastSelectedFriendSubject.next('');
        this.lastSelectedGroupChatSubject.next(groupChat);
    }
}