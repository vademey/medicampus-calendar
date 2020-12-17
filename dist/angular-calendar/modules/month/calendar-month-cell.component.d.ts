import { EventEmitter, TemplateRef } from '@angular/core';
import { isWithinThreshold } from '../common/util';
import { PlacementArray } from 'positioning';
import { MCMonthViewDay, MCEvent } from '../../utilities/mc-calendar-utils';
export declare class CalendarMonthCellComponent {
    day: MCMonthViewDay;
    openDay: MCMonthViewDay;
    locale: string;
    tooltipPlacement: PlacementArray;
    tooltipAppendToBody: boolean;
    customTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    tooltipDelay: number | null;
    highlightDay: EventEmitter<any>;
    unhighlightDay: EventEmitter<any>;
    eventClicked: EventEmitter<{
        event: MCEvent<any>;
        sourceEvent: MouseEvent;
    }>;
    trackByEventId: (index: number, event: MCEvent<any>) => string | number | MCEvent<any>;
    validateDrag: typeof isWithinThreshold;
}
