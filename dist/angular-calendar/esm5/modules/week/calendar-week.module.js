import { __decorate } from "tslib";
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
import { QuicklinksComponent } from './quicklinks/quicklinks.component';
export { getWeekViewPeriod } from '../common/util';
export { CalendarWeekViewComponent } from './calendar-week-view.component';
var CalendarWeekModule = /** @class */ (function () {
    function CalendarWeekModule() {
    }
    CalendarWeekModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                ResizableModule,
                DragAndDropModule,
                CalendarCommonModule
            ],
            declarations: [
                CalendarWeekViewComponent,
                CalendarWeekViewHeaderComponent,
                CalendarWeekViewEventComponent,
                CalendarWeekViewHourSegmentComponent,
                CalendarWeekViewCurrentTimeMarkerComponent,
                QuicklinksComponent
            ],
            exports: [
                ResizableModule,
                DragAndDropModule,
                CalendarWeekViewComponent,
                CalendarWeekViewHeaderComponent,
                CalendarWeekViewEventComponent,
                CalendarWeekViewHourSegmentComponent,
                CalendarWeekViewCurrentTimeMarkerComponent,
                QuicklinksComponent
            ],
        })
    ], CalendarWeekModule);
    return CalendarWeekModule;
}());
export { CalendarWeekModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWsubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDNUQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDeEUsT0FBTyxFQUFFLDBDQUEwQyxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDaEgsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDeEYsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDbkcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFPeEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFxQyx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBNEI5RztJQUFBO0lBQWtDLENBQUM7SUFBdEIsa0JBQWtCO1FBMUI5QixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsWUFBWTtnQkFDWixlQUFlO2dCQUNmLGlCQUFpQjtnQkFDakIsb0JBQW9CO2FBQ3JCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLHlCQUF5QjtnQkFDekIsK0JBQStCO2dCQUMvQiw4QkFBOEI7Z0JBQzlCLG9DQUFvQztnQkFDcEMsMENBQTBDO2dCQUMxQyxtQkFBbUI7YUFDcEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsZUFBZTtnQkFDZixpQkFBaUI7Z0JBQ2pCLHlCQUF5QjtnQkFDekIsK0JBQStCO2dCQUMvQiw4QkFBOEI7Z0JBQzlCLG9DQUFvQztnQkFDcEMsMENBQTBDO2dCQUMxQyxtQkFBbUI7YUFDcEI7U0FDRixDQUFDO09BQ1csa0JBQWtCLENBQUk7SUFBRCx5QkFBQztDQUFBLEFBQW5DLElBQW1DO1NBQXRCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ0FuZERyb3BNb2R1bGUgfSBmcm9tICdhbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUnO1xuaW1wb3J0IHsgUmVzaXphYmxlTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckNvbW1vbk1vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdDdXJyZW50VGltZU1hcmtlckNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWN1cnJlbnQtdGltZS1tYXJrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhcldlZWtWaWV3SGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci13ZWVrLXZpZXctaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhcldlZWtWaWV3SG91clNlZ21lbnRDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXdlZWstdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHsgUXVpY2tsaW5rc0NvbXBvbmVudCB9IGZyb20gJy4vcXVpY2tsaW5rcy9xdWlja2xpbmtzLmNvbXBvbmVudCc7XG5cbmV4cG9ydCB7XG4gIE1DR2V0V2Vla1ZpZXdBcmdzIGFzIENhbGVuZGFyR2V0V2Vla1ZpZXdBcmdzLFxuICBNQ1dlZWtWaWV3QWxsRGF5RXZlbnQgYXMgQ2FsZW5kYXJXZWVrVmlld0FsbERheUV2ZW50LFxuICBNQ1dlZWtWaWV3QWxsRGF5RXZlbnRSb3cgYXMgQ2FsZW5kYXJXZWVrVmlld0FsbERheUV2ZW50Um93XG59IGZyb20gJy4uLy4uL3V0aWxpdGllcy9tYy1jYWxlbmRhci11dGlscyc7XG5leHBvcnQgeyBnZXRXZWVrVmlld1BlcmlvZCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmV4cG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdCZWZvcmVSZW5kZXJFdmVudCwgQ2FsZW5kYXJXZWVrVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgUmVzaXphYmxlTW9kdWxlLFxuICAgIERyYWdBbmREcm9wTW9kdWxlLFxuICAgIENhbGVuZGFyQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENhbGVuZGFyV2Vla1ZpZXdDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0hlYWRlckNvbXBvbmVudCxcbiAgICBDYWxlbmRhcldlZWtWaWV3RXZlbnRDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0hvdXJTZWdtZW50Q29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdDdXJyZW50VGltZU1hcmtlckNvbXBvbmVudCxcbiAgICBRdWlja2xpbmtzQ29tcG9uZW50XG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBSZXNpemFibGVNb2R1bGUsXG4gICAgRHJhZ0FuZERyb3BNb2R1bGUsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0NvbXBvbmVudCxcbiAgICBDYWxlbmRhcldlZWtWaWV3SGVhZGVyQ29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCxcbiAgICBDYWxlbmRhcldlZWtWaWV3SG91clNlZ21lbnRDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0N1cnJlbnRUaW1lTWFya2VyQ29tcG9uZW50LFxuICAgIFF1aWNrbGlua3NDb21wb25lbnRcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrTW9kdWxlIHsgfVxuIl19