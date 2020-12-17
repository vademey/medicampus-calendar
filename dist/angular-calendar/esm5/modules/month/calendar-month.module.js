import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarCommonModule } from '../common/calendar-common.module';
import { CalendarMonthCellComponent } from './calendar-month-cell.component';
import { CalendarMonthViewHeaderComponent } from './calendar-month-view-header.component';
import { CalendarMonthViewComponent } from './calendar-month-view.component';
import { CalendarOpenDayEventsComponent } from './calendar-open-day-events.component';
export { CalendarMonthViewComponent } from './calendar-month-view.component';
export { collapseAnimation } from './calendar-open-day-events.component';
var CalendarMonthModule = /** @class */ (function () {
    function CalendarMonthModule() {
    }
    CalendarMonthModule = __decorate([
        NgModule({
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
    ], CalendarMonthModule);
    return CalendarMonthModule;
}());
export { CalendarMonthModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9udGgubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvbW9udGgvY2FsZW5kYXItbW9udGgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUd0RixPQUFPLEVBRUwsMEJBQTBCLEVBRTNCLE1BQU0saUNBQWlDLENBQUM7QUFDekMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFrQnpFO0lBQUE7SUFBbUMsQ0FBQztJQUF2QixtQkFBbUI7UUFoQi9CLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxvQkFBb0IsQ0FBQztZQUNoRSxZQUFZLEVBQUU7Z0JBQ1osMEJBQTBCO2dCQUMxQiwwQkFBMEI7Z0JBQzFCLDhCQUE4QjtnQkFDOUIsZ0NBQWdDO2FBQ2pDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLGlCQUFpQjtnQkFDakIsMEJBQTBCO2dCQUMxQiwwQkFBMEI7Z0JBQzFCLDhCQUE4QjtnQkFDOUIsZ0NBQWdDO2FBQ2pDO1NBQ0YsQ0FBQztPQUNXLG1CQUFtQixDQUFJO0lBQUQsMEJBQUM7Q0FBQSxBQUFwQyxJQUFvQztTQUF2QixtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERyYWdBbmREcm9wTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1kcmFnZ2FibGUtZHJvcHBhYmxlJztcbmltcG9ydCB7IENhbGVuZGFyQ29tbW9uTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWNvbW1vbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb250aENlbGxDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLW1vbnRoLWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyTW9udGhWaWV3SGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1tb250aC12aWV3LWhlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb250aFZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLW1vbnRoLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyT3BlbkRheUV2ZW50c0NvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzLmNvbXBvbmVudCc7XG5cbmV4cG9ydCB7IE1DTW9udGhWaWV3RGF5IGFzIENhbGVuZGFyTW9udGhWaWV3RGF5IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzJztcbmV4cG9ydCB7XG4gIENhbGVuZGFyTW9udGhWaWV3QmVmb3JlUmVuZGVyRXZlbnQsXG4gIENhbGVuZGFyTW9udGhWaWV3Q29tcG9uZW50LFxuICBDYWxlbmRhck1vbnRoVmlld0V2ZW50VGltZXNDaGFuZ2VkRXZlbnRcbn0gZnJvbSAnLi9jYWxlbmRhci1tb250aC12aWV3LmNvbXBvbmVudCc7XG5leHBvcnQgeyBjb2xsYXBzZUFuaW1hdGlvbiB9IGZyb20gJy4vY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIERyYWdBbmREcm9wTW9kdWxlLCBDYWxlbmRhckNvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENhbGVuZGFyTW9udGhWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyTW9udGhDZWxsQ29tcG9uZW50LFxuICAgIENhbGVuZGFyT3BlbkRheUV2ZW50c0NvbXBvbmVudCxcbiAgICBDYWxlbmRhck1vbnRoVmlld0hlYWRlckNvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIERyYWdBbmREcm9wTW9kdWxlLFxuICAgIENhbGVuZGFyTW9udGhWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyTW9udGhDZWxsQ29tcG9uZW50LFxuICAgIENhbGVuZGFyT3BlbkRheUV2ZW50c0NvbXBvbmVudCxcbiAgICBDYWxlbmRhck1vbnRoVmlld0hlYWRlckNvbXBvbmVudCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJNb250aE1vZHVsZSB7IH1cbiJdfQ==