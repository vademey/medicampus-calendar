import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarCommonModule } from '../common/calendar-common.module';
import { CalendarMonthCellComponent } from './calendar-month-cell.component';
import { CalendarMonthViewHeaderComponent } from './calendar-month-view-header.component';
import { CalendarMonthViewComponent } from './calendar-month-view.component';
import { CalendarOpenDayEventsComponent } from './calendar-open-day-events.component';

export { MCMonthViewDay as CalendarMonthViewDay } from '../../utilities/mc-calendar-utils';
export {
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewComponent,
  CalendarMonthViewEventTimesChangedEvent
} from './calendar-month-view.component';
export { collapseAnimation } from './calendar-open-day-events.component';

@NgModule({
  imports: [CommonModule, DragAndDropModule, CalendarCommonModule],
  declarations: [
    CalendarMonthViewComponent,
    CalendarMonthCellComponent,
    CalendarOpenDayEventsComponent,
    CalendarMonthViewHeaderComponent,
  ],
  exports: [
    DragAndDropModule,
    CalendarMonthViewComponent,
    CalendarMonthCellComponent,
    CalendarOpenDayEventsComponent,
    CalendarMonthViewHeaderComponent,
  ],
})
export class CalendarMonthModule { }
