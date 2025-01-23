import { User } from "./user.model"

export interface Friend {
    userId: string,
    username: string,
    bio: string,
    email: string,
    avatar: string,
    messages: Message[],
    isMuted: boolean,
    isOnline: boolean
}

export interface Message {
    id: string,
    isIncoming: boolean,
    isSeen: boolean,
    lastSeen: boolean,
    sender: 'user' | Friend['username'],
    senderAvatar?: string,
    timeStamp: Date,
    text: string
    isSeenBy: {email: User['email'], username: User['username']}[],
}
export interface FriendMessage {
    type: 'friendText',
    friendName: string,
    text: string
}