import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api_url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  avatarsList: string[] = [];

  static totalAvatars: number = 27;

  constructor(private http: HttpClient) { 
    this.initializeAvatarsList();
  }

  private initializeAvatarsList() {
    for (let i = 1; i <= AvatarService.totalAvatars; i++) {
      this.avatarsList.push(`avatars/avatar-${i}.jpeg`);
    }
  }

  public changeAvatar(newAvatar: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${API_URL}/user/change-avatar`, newAvatar);
  }
}
