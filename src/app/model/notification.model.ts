import { Friend, Message } from "./friend.model"

export interface Notification {
    id: string,
    notificationId: string,
    chatId?: string,
    isSeenBy: Message['isSeenBy'],
    isSeenByUser: boolean,
    lastSeen?: boolean,
    isIncoming: boolean,
    type: 'friend-request' | 'message' | 'hasSeen' | 'connection' | 'group-chat-create' | 'groupMessage' | 'groupSeen',
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
    messages?: Message[],
    displayMessage?: string,
    status: 'pending' | 'complete' | 'rejected'
    timeStamp: string,
    friendName?: Friend['username']
    error?: string
    isOnline?: boolean
}