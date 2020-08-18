import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import {
  CalendarA11y,
  CalendarCommonModule,
  CalendarDateFormatter,
  CalendarEventTitleFormatter,
  CalendarModuleConfig,
} from './common/calendar-common.module';
import { CalendarUtils } from './common/calendar-utils.provider';
import { CalendarDayModule } from './day/calendar-day.module';
import { CalendarMonthModule } from './month/calendar-month.module';
import { CalendarWeekModule } from './week/calendar-week.module';

export * from './common/calendar-common.module';
export * from './day/calendar-day.module';
export * from './month/calendar-month.module';
export * from './week/calendar-week.module';

/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
@NgModule({
  imports: [
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
  ],
  exports: [
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
  ],
})
export class CalendarModule {
  static forRoot(
    dateAdapter: Provider,
    config: CalendarModuleConfig = {}
  ): ModuleWithProviders<CalendarModule> {
    return {
      ngModule: CalendarModule,
      providers: [
        dateAdapter,
        config.eventTitleFormatter || CalendarEventTitleFormatter,
        config.dateFormatter || CalendarDateFormatter,
        config.utils || CalendarUtils,
        config.a11y || CalendarA11y,
      ],
    };
  }
}
