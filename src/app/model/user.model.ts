import { Theme } from "../services/theme.service";
import { Friend } from "./friend.model";
import { GroupChat } from "./groupchat.model";
import { Notification } from "./notification.model";

export interface User {
    userId: string,
    username: string,
    bio: string,
    email: string,
    theme: Theme,
    avatar: string,
    notifications: Notification[],
    friendsList: Friend[],
    groupChatsList: GroupChat[]
}