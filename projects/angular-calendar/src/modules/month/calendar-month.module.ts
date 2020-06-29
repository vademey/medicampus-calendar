import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarMonthViewComponent } from './calendar-month-view.component';
import { CalendarMonthViewHeaderComponent } from './calendar-month-view-header.component';
import { CalendarMonthCellComponent } from './calendar-month-cell.component';
import { CalendarOpenDayEventsComponent } from './calendar-open-day-events.component';
import { CalendarCommonModule } from '../common/calendar-common.module';

export {
  CalendarMonthViewComponent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewEventTimesChangedEvent,
} from './calendar-month-view.component';
export { MCMonthViewDay as CalendarMonthViewDay } from '../../models/mc-calendar-utils';
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
export class CalendarMonthModule {}
