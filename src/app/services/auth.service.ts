import { Injectable } from "@angular/core";
import { API_URL } from '../api_url';
import { LoginResponse, User, UserLogin, UserRegister } from "../model/auth.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private initialUserValue: User = {
        email: '', friendsList: [], 
        notifications: [], 
        theme: 'synthwave', 
        userId: '', 
        username: '', 
        outgoingRequestsList: []
    }
    private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.initialUserValue);
    readonly user$: Observable<User> = this.userSubject as Observable<User>;

    constructor(private http: HttpClient) { }

    public getuserInfo$() {
        return this.http.get<{ user: User }>(`${API_URL}/user_info`);
    }

    public registerUser(user: UserRegister) {
        return this.http.post(`${API_URL}/register`, user);
    }

    public loginUser(user: UserLogin) {
        return this.http.post<LoginResponse>(`${API_URL}/login`, user);
    }

    public updateUser(user: User) {
        this.userSubject.next(user);
    }
}