import { LastSelectedFriend } from "./friend.model";

export interface ModalData {
    lastSelectedFriend?: LastSelectedFriend,
    action: 'delete' | 'logout',
}