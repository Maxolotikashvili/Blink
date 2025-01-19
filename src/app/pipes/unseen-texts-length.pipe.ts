import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../model/friend.model';

@Pipe({
  name: 'unseenTextsLength',
  pure: false
})
export class UnseenTextsLengthPipe implements PipeTransform {

  transform(messages: Message[]): number {
    const unseenMessagesLength: number = messages.filter((message) => message.isIncoming && !message.isSeen).length;
    return unseenMessagesLength;
  }
}
