import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Friend, LastSelectedFriend } from "../model/friend.model";
import { GroupChat, LastSelectedGroupChat } from "../model/groupchat.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private lastSelectedFriendSubject: Subject<LastSelectedFriend | ''> = new Subject();
    public lastSelectedFriend$: Observable<LastSelectedFriend> = this.lastSelectedFriendSubject as Observable<LastSelectedFriend>;

    private lastSelectedGroupChatSubject: Subject<LastSelectedGroupChat | ''> = new Subject();
    public lastSelectedGroupChat$: Observable<LastSelectedGroupChat> = this.lastSelectedGroupChatSubject as Observable<LastSelectedGroupChat>;

    public updateLastSelectedFriend(friend: LastSelectedFriend | '') {
        this.lastSelectedGroupChatSubject.next('');
        this.lastSelectedFriendSubject.next(friend);
    }

    public updateLastSelectedGroupChat(groupChat: LastSelectedGroupChat | '') {
        this.lastSelectedFriendSubject.next('');
        this.lastSelectedGroupChatSubject.next(groupChat);
    }
}