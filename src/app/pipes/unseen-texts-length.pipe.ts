import { Pipe, PipeTransform } from "@angular/core";
import { Message } from "../model/friend.model";

@Pipe({
    name: 'unseenTextsLength',
    pure: false
})
export class UnseenTextsLength implements PipeTransform {
    transform(value: Message[]) {
        return value.filter((message) => !message.isSeen && message.isIncoming).length;
    }
}