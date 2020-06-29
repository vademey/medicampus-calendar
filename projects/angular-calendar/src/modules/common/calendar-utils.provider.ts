import { Injectable } from '@angular/core';
import { DateAdapter } from '../../date-adapters/date-adapter';
import { getMonthView, getWeekView, getWeekViewHeader, MCGetMonthViewArgs, MCGetWeekViewArgs, MCGetWeekViewHeaderArgs, MCMonthView, MCWeekDay, MCWeekView, MCWeekViewEventRow } from '../../models/mc-calendar-utils';


@Injectable()
export class CalendarUtils {
  constructor(protected dateAdapter: DateAdapter) { }

  getMonthView(args: MCGetMonthViewArgs): MCMonthView {
    return getMonthView(args);
  }

  getWeekViewHeader(args: MCGetWeekViewHeaderArgs): MCWeekDay[] {
    return getWeekViewHeader(args);
  }

  getWeekView(args: MCGetWeekViewArgs): MCWeekView {
    return getWeekView(this.dateAdapter, args);
  }
}
