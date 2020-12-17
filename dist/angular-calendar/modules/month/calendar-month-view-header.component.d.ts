import { TemplateRef, EventEmitter } from '@angular/core';
import { MCWeekDay } from '../../utilities/mc-calendar-utils';
export declare class CalendarMonthViewHeaderComponent {
    days: MCWeekDay[];
    locale: string;
    customTemplate: TemplateRef<any>;
    columnHeaderClicked: EventEmitter<{
        isoDayNumber: number;
        sourceEvent: MouseEvent;
    }>;
    trackByWeekDayHeaderDate: (index: number, day: MCWeekDay) => string;
}
