import { User } from "./user.model"

export interface Friend {
    userId: string,
    username: string,
    email: string,
    avatar: string,
    messages: Message[],
    isMuted: boolean,
    isOnline: boolean
}

export interface Message {
    isIncoming: boolean,
    isSeen: boolean,
    sender: 'user' | Friend['username'],
    timeStamp: Date,
    text: string
    isSeenBy: {user_id: User['userId'], email: User['email']}[],
}
export interface FriendMessage {
    type: 'friendText',
    friendName: string,
    text: string
}