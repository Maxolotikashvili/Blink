import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate',
})
export class ChatDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const localDate: string = new Date(value).toLocaleString();
    const date = new Date(localDate);
    const now = new Date();
    
    const differenceInMs = now.getTime() - date.getTime();
    const differenceInMinutes = Math.floor(differenceInMs / 60000);

    if (differenceInMinutes < 1) {
      return 'Now';
    }
    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    }

    if (this.isSameDay(date, now)) {
      return this.formatTime(date);
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (this.isSameDay(date, yesterday)) {
      return `Yest, ${this.formatTime(date)}`;
    }

    if (this.isWithinSameWeek(date, now)) {
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
      return `${weekday}, ${this.formatTime(date)}`;
    }

    return this.formatMonthDayTime(date);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private isWithinSameWeek(date: Date, now: Date): boolean {
    const dayOfWeekNow = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeekNow);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); 

    return date >= startOfWeek && date <= endOfWeek;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes}`;
  }

  private formatMonthDayTime(date: Date): string {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = this.formatTime(date);
    return `${month} ${day}, ${time}`;
  }
}
