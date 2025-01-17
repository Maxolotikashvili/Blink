import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../model/friend.model';

@Pipe({
  name: 'unseenTextsLength'
})
export class UnseenTextsLengthPipe implements PipeTransform {

  transform(messages: Message[], ): number {
    const reversedMessagesList = [...messages].reverse();
    const lastSeenMessage = reversedMessagesList.find((message) => message.isSeen);

    if (lastSeenMessage) {
      const lastSeenMessageIndex = messages.indexOf(lastSeenMessage);

      return messages.length -1 - lastSeenMessageIndex;  
    } else {
      return 0;
    }

  }

}
