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

export interface LastSelectedFriend {
    userId: Friend['userId'],
    username: Friend['username'],
    bio: Friend['bio'],
    email: Friend['email'],
    isOnline: Friend['isOnline'],
    avatar: Friend['avatar'],
    isMuted: Friend['isMuted'],
    messagesLength: number
}