import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDayViewComponent } from './calendar-day-view.component';
import { CalendarCommonModule } from '../common/calendar-common.module';
import { CalendarWeekModule } from '../week/calendar-week.module';
export { CalendarDayViewComponent, } from './calendar-day-view.component';
let CalendarDayModule = class CalendarDayModule {
};
CalendarDayModule = __decorate([
    NgModule({
        imports: [CommonModule, CalendarCommonModule, CalendarWeekModule],
        declarations: [CalendarDayViewComponent],
        exports: [CalendarDayViewComponent],
    })
], CalendarDayModule);
export { CalendarDayModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZGF5Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXIvIiwic291cmNlcyI6WyJtb2R1bGVzL2RheS9jYWxlbmRhci1kYXkubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUVsRSxPQUFPLEVBQ0wsd0JBQXdCLEdBRXpCLE1BQU0sK0JBQStCLENBQUM7QUFPdkMsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7Q0FBRyxDQUFBO0FBQXBCLGlCQUFpQjtJQUw3QixRQUFRLENBQUM7UUFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLENBQUM7UUFDakUsWUFBWSxFQUFFLENBQUMsd0JBQXdCLENBQUM7UUFDeEMsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7S0FDcEMsQ0FBQztHQUNXLGlCQUFpQixDQUFHO1NBQXBCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2FsZW5kYXJEYXlWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1kYXktdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJDb21tb25Nb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItY29tbW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDYWxlbmRhcldlZWtNb2R1bGUgfSBmcm9tICcuLi93ZWVrL2NhbGVuZGFyLXdlZWsubW9kdWxlJztcblxuZXhwb3J0IHtcbiAgQ2FsZW5kYXJEYXlWaWV3Q29tcG9uZW50LFxuICBDYWxlbmRhckRheVZpZXdCZWZvcmVSZW5kZXJFdmVudCxcbn0gZnJvbSAnLi9jYWxlbmRhci1kYXktdmlldy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDYWxlbmRhckNvbW1vbk1vZHVsZSwgQ2FsZW5kYXJXZWVrTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ2FsZW5kYXJEYXlWaWV3Q29tcG9uZW50XSxcbiAgZXhwb3J0czogW0NhbGVuZGFyRGF5Vmlld0NvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyRGF5TW9kdWxlIHt9XG4iXX0=