import { EventEmitter, OnChanges, TemplateRef } from '@angular/core';
import { PlacementArray } from 'positioning';
import { MCWeekViewAllDayEvent, MCWeekViewHourColumn, MCWeekViewTimeEvent } from '../../utilities/mc-calendar-utils';
export declare class CalendarWeekViewEventComponent implements OnChanges {
    locale: string;
    hourSegmentHeight: number;
    weekEvent: MCWeekViewAllDayEvent | MCWeekViewTimeEvent;
    tooltipPlacement: PlacementArray;
    tooltipAppendToBody: boolean;
    tooltipDisabled: boolean;
    tooltipDelay: number | null;
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    eventActionsTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    column: MCWeekViewHourColumn;
    daysInWeek: number;
    eventClicked: EventEmitter<{
        sourceEvent: any;
        isQuicklink?: boolean;
    }>;
    duration: number;
    isLive: boolean;
    ngOnChanges(): void;
    navigateToLiveStream(): void;
}
