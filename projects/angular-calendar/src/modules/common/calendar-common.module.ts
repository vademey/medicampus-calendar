import { CommonModule, I18nPluralPipe } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
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
import {
  CalendarTooltipDirective,
  CalendarTooltipWindowComponent
} from './calendar-tooltip.directive';
import { CalendarUtils } from './calendar-utils.provider';
import { ClickDirective } from './click.directive';
import { KeydownEnterDirective } from './keydown-enter.directive';

export interface CalendarModuleConfig {
  eventTitleFormatter?: Provider;
  dateFormatter?: Provider;
  utils?: Provider;
  a11y?: Provider;
}

export {
  CalendarEvent,

  DAYS_OF_WEEK, EventAction as CalendarEventAction,

  ViewPeriod as CalendarViewPeriod
} from 'calendar-utils';
export * from '../../date-adapters/date-adapter';
export * from './calendar-a11y.interface';
export * from './calendar-a11y.provider';
export * from './calendar-angular-date-formatter.provider';
export * from './calendar-date-formatter.interface';
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
@NgModule({
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
export class CalendarCommonModule {
  static forRoot(
    dateAdapter: Provider,
    config: CalendarModuleConfig = {}
  ): ModuleWithProviders<CalendarCommonModule> {
    return {
      ngModule: CalendarCommonModule,
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
