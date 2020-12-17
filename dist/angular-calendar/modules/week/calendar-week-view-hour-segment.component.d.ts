import { TemplateRef } from '@angular/core';
import { MCWeekViewHourSegment } from '../../utilities/mc-calendar-utils';
export declare class CalendarWeekViewHourSegmentComponent {
    segment: MCWeekViewHourSegment;
    segmentHeight: number;
    locale: string;
    isTimeLabel: boolean;
    daysInWeek: number;
    customTemplate: TemplateRef<any>;
}
