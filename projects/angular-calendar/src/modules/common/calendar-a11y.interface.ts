import { MCCalendarEvent, MCEventAction, MCMonthViewDay } from "../../utilities/mc-calendar-utils";

/**
 * The parameters passed to the a11y methods.
 */
export interface A11yParams {
  /**
   * A day in the month view
   */
  day?: MCMonthViewDay;

  /**
   * A date
   */
  date?: Date;

  /**
   * A calendar event
   */
  event?: MCCalendarEvent;

  /**
   * Action button label e.g. 'Edit'
   */
  action?: MCEventAction;

  /**
   * Users preferred locale
   */
  locale?: string;
}
