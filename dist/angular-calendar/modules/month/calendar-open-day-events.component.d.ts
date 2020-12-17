import { EventEmitter, TemplateRef } from '@angular/core';
import { AnimationTriggerMetadata } from '@angular/animations';
import { isWithinThreshold } from '../common/util';
import { MCEvent } from '../../utilities/mc-calendar-utils';
export declare const collapseAnimation: AnimationTriggerMetadata;
export declare class CalendarOpenDayEventsComponent {
    locale: string;
    isOpen: boolean;
    events: MCEvent[];
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    eventActionsTemplate: TemplateRef<any>;
    date: Date;
    eventClicked: EventEmitter<{
        event: MCEvent<any>;
        sourceEvent: any;
    }>;
    trackByEventId: (index: number, event: MCEvent<any>) => string | number | MCEvent<any>;
    validateDrag: typeof isWithinThreshold;
}
