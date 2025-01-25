import { Message } from "./friend.model";

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

export interface LastSelectedGroupChat {
    chatId: GroupChat['chatId'],
    isMuted: GroupChat['isMuted'],
    users: GroupChat['users'],
    messagesLength: number
}