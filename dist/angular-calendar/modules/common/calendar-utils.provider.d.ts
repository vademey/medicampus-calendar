import { MCGetMonthViewArgs, MCGetWeekViewArgs, MCGetWeekViewHeaderArgs, MCMonthView, MCWeekDay, MCWeekView } from '../../utilities/mc-calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';
export declare class CalendarUtils {
    protected dateAdapter: DateAdapter;
    constructor(dateAdapter: DateAdapter);
    getMonthView(args: MCGetMonthViewArgs): MCMonthView;
    getWeekViewHeader(args: MCGetWeekViewHeaderArgs): MCWeekDay[];
    getWeekView(args: MCGetWeekViewArgs): MCWeekView;
}
