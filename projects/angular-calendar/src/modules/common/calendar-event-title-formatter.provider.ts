import { MCEvent } from "../../utilities/mc-calendar-utils";

/**
 * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
 *
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { CalendarEventTitleFormatter, MCCalendarEvent } from 'angular-calendar';
 *
 * @Injectable()
 * class CustomEventTitleFormatter extends MCCalendarEventTitleFormatter {
 *
 *   month(event: MCCalendarEvent): string {
 *     return `Custom prefix: ${event.title}`;
 *   }
 *
 * }
 *
 * // in your component
 * providers: [{
 *  provide: MCCalendarEventTitleFormatter,
 *  useClass: CustomEventTitleFormatter
 * }]
 * ```
 */
export class CalendarEventTitleFormatter {
  /**
   * The month view event title.
   */
  month(event: MCEvent, title: string): string {
    return event.title;
  }

  /**
   * The month view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  monthTooltip(event: MCEvent, title: string): string {
    return event.title;
  }

  /**
   * The week view event title.
   */
  week(event: MCEvent, title: string): string {
    return event.title;
  }

  /**
   * The week view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  weekTooltip(event: MCEvent, title: string): string {
    return event.title;
  }

  /**
   * The day view event title.
   */
  day(event: MCEvent, title: string): string {
    return event.title;
  }

  /**
   * The day view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  dayTooltip(event: MCEvent, title: string): string {
    return event.title;
  }
}
