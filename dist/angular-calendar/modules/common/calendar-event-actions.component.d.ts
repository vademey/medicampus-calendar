import { TemplateRef } from '@angular/core';
import { MCEvent, MCEventAction } from '../../utilities/mc-calendar-utils';
export declare class CalendarEventActionsComponent {
    event: MCEvent;
    customTemplate: TemplateRef<any>;
    trackByActionId: (index: number, action: MCEventAction) => string | number | MCEventAction;
}
