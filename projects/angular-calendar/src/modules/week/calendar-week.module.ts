import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ResizableModule } from 'angular-resizable-element';
import { CalendarCommonModule } from '../common/calendar-common.module';
import { CalendarWeekViewCurrentTimeMarkerComponent } from './calendar-week-view-current-time-marker.component';
import { CalendarWeekViewEventComponent } from './calendar-week-view-event.component';
import { CalendarWeekViewHeaderComponent } from './calendar-week-view-header.component';
import { CalendarWeekViewHourSegmentComponent } from './calendar-week-view-hour-segment.component';
import { CalendarWeekViewComponent } from './calendar-week-view.component';

export {
  MCGetWeekViewArgs as CalendarGetWeekViewArgs,
  MCWeekViewAllDayEvent as CalendarWeekViewAllDayEvent,
  MCWeekViewAllDayEventRow as CalendarWeekViewAllDayEventRow
} from '../../utilities/mc-calendar-utils';
export { getWeekViewPeriod } from '../common/util';
export { CalendarWeekViewBeforeRenderEvent, CalendarWeekViewComponent } from './calendar-week-view.component';

@NgModule({
  imports: [
    CommonModule,
    ResizableModule,
    DragAndDropModule,
    CalendarCommonModule,
  ],
  declarations: [
    CalendarWeekViewComponent,
    CalendarWeekViewHeaderComponent,
    CalendarWeekViewEventComponent,
    CalendarWeekViewHourSegmentComponent,
    CalendarWeekViewCurrentTimeMarkerComponent,
  ],
  exports: [
    ResizableModule,
    DragAndDropModule,
    CalendarWeekViewComponent,
    CalendarWeekViewHeaderComponent,
    CalendarWeekViewEventComponent,
    CalendarWeekViewHourSegmentComponent,
    CalendarWeekViewCurrentTimeMarkerComponent,
  ],
})
export class CalendarWeekModule { }
