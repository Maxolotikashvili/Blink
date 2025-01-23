import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../model/friend.model';

@Pipe({
  name: 'unseenGroupTextsLength',
  pure: false
})
export class UnseenGroupTextsLength implements PipeTransform {
  transform(messages: Message[] | Message): number {
    if (Array.isArray(messages)) {
      if (messages.length === 0) {
        return 0;
      }

      let lastSeenIndex = -1;

      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].isSeenBy.some(seenBy => seenBy.username === 'user')) {
          lastSeenIndex = i;
          break;
        }
      }

      let unseenCount = 0;
      for (let i = lastSeenIndex + 1; i < messages.length; i++) {
        if (messages[i].isIncoming) {
          unseenCount++;
        }
      }

      return unseenCount;
    } else {
      const hasUserSeenText = messages.isSeenBy.some(user => user.username === 'user');

      if (messages.isIncoming && !hasUserSeenText) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}
