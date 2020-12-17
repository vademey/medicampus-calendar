import { MCEvent } from "../../utilities/mc-calendar-utils";
export declare enum CalendarEventTimesChangedEventType {
    Drag = "drag",
    Drop = "drop",
    Resize = "resize"
}
/**
 * The output `$event` type when an event is resized or dragged and dropped.
 */
export interface CalendarEventTimesChangedEvent<MetaType = any> {
    type: CalendarEventTimesChangedEventType;
    event: MCEvent<MetaType>;
    newStart: Date;
    newEnd?: Date;
    allDay?: boolean;
}
