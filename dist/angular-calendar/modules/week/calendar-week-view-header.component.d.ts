import { EventEmitter, TemplateRef } from '@angular/core';
import { MCEvent, MCWeekDay } from '../../utilities/mc-calendar-utils';
export declare class CalendarWeekViewHeaderComponent {
    days: MCWeekDay[];
    locale: string;
    customTemplate: TemplateRef<any>;
    dayHeaderClicked: EventEmitter<{
        day: MCWeekDay;
        sourceEvent: MouseEvent;
    }>;
    eventDropped: EventEmitter<{
        event: MCEvent<any>;
        newStart: Date;
    }>;
    dragEnter: EventEmitter<{
        date: Date;
    }>;
    trackByWeekDayHeaderDate: (index: number, day: MCWeekDay) => string;
}
