import { Friend, Message } from "./friend.model"

export interface Notification {
    notificationId: string,
    isSeenByUser: boolean,
    isSeen?: boolean,
    isIncoming: boolean,
    type: 'friend-request' | 'message' | 'hasSeen' | 'connection' | 'group-chat-create',
    sender: {
        userId: string,
        username: string,
        email: string,
        avatar?: string
    },
    receiver: {
        userId: string,
        username: string,
        email: string,
        avatar?: string
    },
    newFriend?: Friend,
    message?: Message | string,
    status: 'pending' | 'complete' | 'rejected'
    timeStamp: string,
    friendName?: Friend['username'],
    error?: string
    isOnline?: boolean
}