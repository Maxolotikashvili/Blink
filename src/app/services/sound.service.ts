import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    private acceptFriendRequestSound: HTMLAudioElement = new Audio('sounds/friend-accept-sound-raw.mp3');
    private sentMessageSound: HTMLAudioElement = new Audio('sounds/sent-message-sound.mp3');
    private incomingMessageSound: HTMLAudioElement = new Audio('sounds/incoming-message-sound.mp3');
    private incomingNotificationSound: HTMLAudioElement = new Audio('sounds/incoming-notification-sound.mp3');

    constructor() {}

    public playAcceptFriendRequestSound() {
        this.acceptFriendRequestSound.currentTime = 0;
        this.acceptFriendRequestSound.play()
    }

    public playMessageSentSound() {
        this.sentMessageSound.currentTime = 0;
        this.sentMessageSound.play();
    } 

    public playIncomingMessageSound() {
        this.incomingMessageSound.currentTime = 0;
        this.incomingMessageSound.play();
    }

    public playIncomingNotificationSound() {
        this.incomingNotificationSound.currentTime = 0;
        this.incomingNotificationSound.play();
    }
}