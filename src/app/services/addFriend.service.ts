import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../api_url";

@Injectable({
    providedIn: 'root'
})
export class AddFriendService {
    constructor(private http: HttpClient) {}

    public addFriend(friendEmail: string) {
        return this.http.post<{message: string}>(`${API_URL}/add_friend`, {friend_username_or_email: friendEmail});
    }
}