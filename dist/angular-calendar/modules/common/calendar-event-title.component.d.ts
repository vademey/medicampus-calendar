import { EventEmitter, OnChanges, TemplateRef } from '@angular/core';
import { MCEvent } from '../../utilities/mc-calendar-utils';
export declare class CalendarEventTitleComponent implements OnChanges {
    event: MCEvent;
    customTemplate: TemplateRef<any>;
    view: string;
    quicklinkClick: EventEmitter<string>;
    isLive: boolean;
    ngOnChanges(): void;
    navigateToLiveStream(): void;
}
