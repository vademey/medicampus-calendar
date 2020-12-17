var CalendarCommonModule_1;
import { __decorate } from "tslib";
import { CommonModule, I18nPluralPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarA11yPipe } from './calendar-a11y.pipe';
import { CalendarA11y } from './calendar-a11y.provider';
import { CalendarDateFormatter } from './calendar-date-formatter.provider';
import { CalendarDatePipe } from './calendar-date.pipe';
import { CalendarEventActionsComponent } from './calendar-event-actions.component';
import { CalendarEventTitleFormatter } from './calendar-event-title-formatter.provider';
import { CalendarEventTitleComponent } from './calendar-event-title.component';
import { CalendarEventTitlePipe } from './calendar-event-title.pipe';
import { CalendarNextViewDirective } from './calendar-next-view.directive';
import { CalendarPreviousViewDirective } from './calendar-previous-view.directive';
import { CalendarTodayDirective } from './calendar-today.directive';
import { CalendarTooltipDirective, CalendarTooltipWindowComponent } from './calendar-tooltip.directive';
import { CalendarUtils } from './calendar-utils.provider';
import { ClickDirective } from './click.directive';
import { KeydownEnterDirective } from './keydown-enter.directive';
export { DAYS_OF_WEEK } from 'calendar-utils';
export * from '../../date-adapters/date-adapter';
export * from './calendar-a11y.provider';
export * from './calendar-angular-date-formatter.provider';
export * from './calendar-date-formatter.provider';
export * from './calendar-event-times-changed-event.interface';
export * from './calendar-event-title-formatter.provider';
export * from './calendar-moment-date-formatter.provider';
export * from './calendar-native-date-formatter.provider';
export * from './calendar-utils.provider';
export * from './calendar-view.enum';
/**
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
let CalendarCommonModule = CalendarCommonModule_1 = class CalendarCommonModule {
    static forRoot(dateAdapter, config = {}) {
        return {
            ngModule: CalendarCommonModule_1,
            providers: [
                dateAdapter,
                config.eventTitleFormatter || CalendarEventTitleFormatter,
                config.dateFormatter || CalendarDateFormatter,
                config.utils || CalendarUtils,
                config.a11y || CalendarA11y,
            ],
        };
    }
};
CalendarCommonModule = CalendarCommonModule_1 = __decorate([
    NgModule({
        declarations: [
            CalendarEventActionsComponent,
            CalendarEventTitleComponent,
            CalendarTooltipWindowComponent,
            CalendarTooltipDirective,
            CalendarPreviousViewDirective,
            CalendarNextViewDirective,
            CalendarTodayDirective,
            CalendarDatePipe,
            CalendarEventTitlePipe,
            CalendarA11yPipe,
            ClickDirective,
            KeydownEnterDirective
        ],
        imports: [CommonModule],
        exports: [
            CalendarEventActionsComponent,
            CalendarEventTitleComponent,
            CalendarTooltipWindowComponent,
            CalendarTooltipDirective,
            CalendarPreviousViewDirective,
            CalendarNextViewDirective,
            CalendarTodayDirective,
            CalendarDatePipe,
            CalendarEventTitlePipe,
            CalendarA11yPipe,
            ClickDirective,
            KeydownEnterDirective,
        ],
        providers: [I18nPluralPipe],
        entryComponents: [CalendarTooltipWindowComponent],
    })
], CalendarCommonModule);
export { CalendarCommonModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItY29tbW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXIvIiwic291cmNlcyI6WyJtb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1jb21tb24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQXVCLFFBQVEsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDM0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDeEYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDckUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDbkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUNMLHdCQUF3QixFQUN4Qiw4QkFBOEIsRUFDL0IsTUFBTSw4QkFBOEIsQ0FBQztBQUN0QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBU2xFLE9BQU8sRUFHTCxZQUFZLEVBR2IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixjQUFjLGtDQUFrQyxDQUFDO0FBRWpELGNBQWMsMEJBQTBCLENBQUM7QUFDekMsY0FBYyw0Q0FBNEMsQ0FBQztBQUUzRCxjQUFjLG9DQUFvQyxDQUFDO0FBQ25ELGNBQWMsZ0RBQWdELENBQUM7QUFDL0QsY0FBYywyQ0FBMkMsQ0FBQztBQUMxRCxjQUFjLDJDQUEyQyxDQUFDO0FBQzFELGNBQWMsMkNBQTJDLENBQUM7QUFDMUQsY0FBYywyQkFBMkIsQ0FBQztBQUMxQyxjQUFjLHNCQUFzQixDQUFDO0FBR3JDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQWtDSCxJQUFhLG9CQUFvQiw0QkFBakMsTUFBYSxvQkFBb0I7SUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FDWixXQUFxQixFQUNyQixTQUErQixFQUFFO1FBRWpDLE9BQU87WUFDTCxRQUFRLEVBQUUsc0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDVCxXQUFXO2dCQUNYLE1BQU0sQ0FBQyxtQkFBbUIsSUFBSSwyQkFBMkI7Z0JBQ3pELE1BQU0sQ0FBQyxhQUFhLElBQUkscUJBQXFCO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxJQUFJLGFBQWE7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLElBQUksWUFBWTthQUM1QjtTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQTtBQWhCWSxvQkFBb0I7SUFqQ2hDLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLDZCQUE2QjtZQUM3QiwyQkFBMkI7WUFDM0IsOEJBQThCO1lBQzlCLHdCQUF3QjtZQUN4Qiw2QkFBNkI7WUFDN0IseUJBQXlCO1lBQ3pCLHNCQUFzQjtZQUN0QixnQkFBZ0I7WUFDaEIsc0JBQXNCO1lBQ3RCLGdCQUFnQjtZQUNoQixjQUFjO1lBQ2QscUJBQXFCO1NBQ3RCO1FBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRTtZQUNQLDZCQUE2QjtZQUM3QiwyQkFBMkI7WUFDM0IsOEJBQThCO1lBQzlCLHdCQUF3QjtZQUN4Qiw2QkFBNkI7WUFDN0IseUJBQXlCO1lBQ3pCLHNCQUFzQjtZQUN0QixnQkFBZ0I7WUFDaEIsc0JBQXNCO1lBQ3RCLGdCQUFnQjtZQUNoQixjQUFjO1lBQ2QscUJBQXFCO1NBQ3RCO1FBQ0QsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDO1FBQzNCLGVBQWUsRUFBRSxDQUFDLDhCQUE4QixDQUFDO0tBQ2xELENBQUM7R0FDVyxvQkFBb0IsQ0FnQmhDO1NBaEJZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSwgSTE4blBsdXJhbFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckExMXlQaXBlIH0gZnJvbSAnLi9jYWxlbmRhci1hMTF5LnBpcGUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJBMTF5IH0gZnJvbSAnLi9jYWxlbmRhci1hMTF5LnByb3ZpZGVyJztcbmltcG9ydCB7IENhbGVuZGFyRGF0ZUZvcm1hdHRlciB9IGZyb20gJy4vY2FsZW5kYXItZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgQ2FsZW5kYXJEYXRlUGlwZSB9IGZyb20gJy4vY2FsZW5kYXItZGF0ZS5waXBlJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnRBY3Rpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1ldmVudC1hY3Rpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIgfSBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpdGxlLWZvcm1hdHRlci5wcm92aWRlcic7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpdGxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50VGl0bGVQaXBlIH0gZnJvbSAnLi9jYWxlbmRhci1ldmVudC10aXRsZS5waXBlJztcbmltcG9ydCB7IENhbGVuZGFyTmV4dFZpZXdEaXJlY3RpdmUgfSBmcm9tICcuL2NhbGVuZGFyLW5leHQtdmlldy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJQcmV2aW91c1ZpZXdEaXJlY3RpdmUgfSBmcm9tICcuL2NhbGVuZGFyLXByZXZpb3VzLXZpZXcuZGlyZWN0aXZlJztcbmltcG9ydCB7IENhbGVuZGFyVG9kYXlEaXJlY3RpdmUgfSBmcm9tICcuL2NhbGVuZGFyLXRvZGF5LmRpcmVjdGl2ZSc7XG5pbXBvcnQge1xuICBDYWxlbmRhclRvb2x0aXBEaXJlY3RpdmUsXG4gIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudFxufSBmcm9tICcuL2NhbGVuZGFyLXRvb2x0aXAuZGlyZWN0aXZlJztcbmltcG9ydCB7IENhbGVuZGFyVXRpbHMgfSBmcm9tICcuL2NhbGVuZGFyLXV0aWxzLnByb3ZpZGVyJztcbmltcG9ydCB7IENsaWNrRGlyZWN0aXZlIH0gZnJvbSAnLi9jbGljay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgS2V5ZG93bkVudGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9rZXlkb3duLWVudGVyLmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsZW5kYXJNb2R1bGVDb25maWcge1xuICBldmVudFRpdGxlRm9ybWF0dGVyPzogUHJvdmlkZXI7XG4gIGRhdGVGb3JtYXR0ZXI/OiBQcm92aWRlcjtcbiAgdXRpbHM/OiBQcm92aWRlcjtcbiAgYTExeT86IFByb3ZpZGVyO1xufVxuXG5leHBvcnQge1xuICBDYWxlbmRhckV2ZW50LFxuXG4gIERBWVNfT0ZfV0VFSywgRXZlbnRBY3Rpb24gYXMgQ2FsZW5kYXJFdmVudEFjdGlvbixcblxuICBWaWV3UGVyaW9kIGFzIENhbGVuZGFyVmlld1BlcmlvZFxufSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5leHBvcnQgKiBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWExMXkuaW50ZXJmYWNlJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItYTExeS5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWFuZ3VsYXItZGF0ZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1kYXRlLWZvcm1hdHRlci5pbnRlcmZhY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci1kYXRlLWZvcm1hdHRlci5wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2NhbGVuZGFyLWV2ZW50LXRpbWVzLWNoYW5nZWQtZXZlbnQuaW50ZXJmYWNlJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItZXZlbnQtdGl0bGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItbW9tZW50LWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItbmF0aXZlLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vY2FsZW5kYXItdXRpbHMucHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9jYWxlbmRhci12aWV3LmVudW0nO1xuXG5cbi8qKlxuICogSW1wb3J0IHRoaXMgbW9kdWxlIHRvIGlmIHlvdSdyZSBqdXN0IHVzaW5nIGEgc2luZ3VsYXIgdmlldyBhbmQgd2FudCB0byBzYXZlIG9uIGJ1bmRsZSBzaXplLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IENhbGVuZGFyQ29tbW9uTW9kdWxlLCBDYWxlbmRhck1vbnRoTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1jYWxlbmRhcic7XG4gKlxuICogQE5nTW9kdWxlKHtcbiAqICAgaW1wb3J0czogW1xuICogICAgIENhbGVuZGFyQ29tbW9uTW9kdWxlLmZvclJvb3QoKSxcbiAqICAgICBDYWxlbmRhck1vbnRoTW9kdWxlXG4gKiAgIF1cbiAqIH0pXG4gKiBjbGFzcyBNeU1vZHVsZSB7fVxuICogYGBgXG4gKlxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBDYWxlbmRhckV2ZW50QWN0aW9uc0NvbXBvbmVudCxcbiAgICBDYWxlbmRhckV2ZW50VGl0bGVDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50LFxuICAgIENhbGVuZGFyVG9vbHRpcERpcmVjdGl2ZSxcbiAgICBDYWxlbmRhclByZXZpb3VzVmlld0RpcmVjdGl2ZSxcbiAgICBDYWxlbmRhck5leHRWaWV3RGlyZWN0aXZlLFxuICAgIENhbGVuZGFyVG9kYXlEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJEYXRlUGlwZSxcbiAgICBDYWxlbmRhckV2ZW50VGl0bGVQaXBlLFxuICAgIENhbGVuZGFyQTExeVBpcGUsXG4gICAgQ2xpY2tEaXJlY3RpdmUsXG4gICAgS2V5ZG93bkVudGVyRGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgQ2FsZW5kYXJFdmVudEFjdGlvbnNDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJFdmVudFRpdGxlQ29tcG9uZW50LFxuICAgIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudCxcbiAgICBDYWxlbmRhclRvb2x0aXBEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJQcmV2aW91c1ZpZXdEaXJlY3RpdmUsXG4gICAgQ2FsZW5kYXJOZXh0Vmlld0RpcmVjdGl2ZSxcbiAgICBDYWxlbmRhclRvZGF5RGlyZWN0aXZlLFxuICAgIENhbGVuZGFyRGF0ZVBpcGUsXG4gICAgQ2FsZW5kYXJFdmVudFRpdGxlUGlwZSxcbiAgICBDYWxlbmRhckExMXlQaXBlLFxuICAgIENsaWNrRGlyZWN0aXZlLFxuICAgIEtleWRvd25FbnRlckRpcmVjdGl2ZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbSTE4blBsdXJhbFBpcGVdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckNvbW1vbk1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KFxuICAgIGRhdGVBZGFwdGVyOiBQcm92aWRlcixcbiAgICBjb25maWc6IENhbGVuZGFyTW9kdWxlQ29uZmlnID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxDYWxlbmRhckNvbW1vbk1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogQ2FsZW5kYXJDb21tb25Nb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgZGF0ZUFkYXB0ZXIsXG4gICAgICAgIGNvbmZpZy5ldmVudFRpdGxlRm9ybWF0dGVyIHx8IENhbGVuZGFyRXZlbnRUaXRsZUZvcm1hdHRlcixcbiAgICAgICAgY29uZmlnLmRhdGVGb3JtYXR0ZXIgfHwgQ2FsZW5kYXJEYXRlRm9ybWF0dGVyLFxuICAgICAgICBjb25maWcudXRpbHMgfHwgQ2FsZW5kYXJVdGlscyxcbiAgICAgICAgY29uZmlnLmExMXkgfHwgQ2FsZW5kYXJBMTF5LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=