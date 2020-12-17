import { EventEmitter, OnChanges } from '@angular/core';
import { MCEvent } from '../../../utilities/mc-calendar-utils';
export declare class QuicklinksComponent implements OnChanges {
    event: MCEvent;
    quicklinkClick: EventEmitter<string>;
    isLive: boolean;
    constructor();
    ngOnChanges(): void;
    navigateToLink(link: string): void;
}
