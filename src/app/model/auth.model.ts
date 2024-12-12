import { Theme } from "../services/theme.service";

export interface UserRegister {
    username: string,
    email: string,
    password: string,
}

export interface UserLogin {
    email: string,
    password: string
}

export interface LoginResponse {
    message: string,
    access_token: string,
}

export interface User {
    userId: string,
    username: string,
    email: string,
    theme: Theme,
    notifications: Notification[],
    friendsList: User[],
    outgoingRequestsList: OutgoingRequest[]
}

export interface Notification {
    type: 'friend-request' | 'other',
    sender: {
        userId: string,
        userName: string,
        email: string,
        avatar: string
    },
}

export interface OutgoingRequest {
    type: 'friend-request',
    userId: string,
    username: string,
    status: 'pending' | 'accepted'
}