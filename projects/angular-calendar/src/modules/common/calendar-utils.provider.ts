import { Injectable } from '@angular/core';
import { getMonthView, getWeekView, getWeekViewHeader, MCGetMonthViewArgs, MCGetWeekViewArgs, MCGetWeekViewHeaderArgs, MCMonthView, MCWeekDay, MCWeekView } from '../../utilities/mc-calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';

@Injectable()
export class CalendarUtils {
  constructor(protected dateAdapter: DateAdapter) { }

  getMonthView(args: MCGetMonthViewArgs): MCMonthView {
    return getMonthView(this.dateAdapter, args);
  }

  getWeekViewHeader(args: MCGetWeekViewHeaderArgs): MCWeekDay[] {
    return getWeekViewHeader(this.dateAdapter, args);
  }

  getWeekView(args: MCGetWeekViewArgs): MCWeekView {
    return getWeekView(this.dateAdapter, args);
  }
}
