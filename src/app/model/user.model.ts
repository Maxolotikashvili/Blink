import { Theme } from "../services/theme.service";
import { Friend, Message } from "./friend.model";
import { Notification } from "./notification.model";

export interface User {
    userId: string,
    username: string,
    email: string,
    theme: Theme,
    avatar: string,
    notifications: Notification[],
    friendsList: Friend[],
    groupChatsList: GroupChat[]
}

export interface GroupChat {
    chatId: string,
    users: GroupChatUser[],
    messages: Message[],
    isMuted: boolean
}

export interface GroupChatUser {
    userId: string,
    username: string,
    avatar: string,
    email: string,
}