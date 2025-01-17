import { Message } from "./friend.model";
import { User } from "./user.model";

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

export interface GroupChatMessage {
    type: string,
    chatId: string,
    text: string
}