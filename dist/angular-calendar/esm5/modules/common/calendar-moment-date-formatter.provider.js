import { __decorate, __metadata, __param } from "tslib";
import { InjectionToken, Inject, Injectable } from '@angular/core';
import { getWeekViewPeriod } from './util';
import { DateAdapter } from '../../date-adapters/date-adapter';
export var MOMENT = new InjectionToken('Moment');
/**
 * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
 *
 * ```typescript
 * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
 * import moment from 'moment';
 *
 * // in your component
 * provide: [{
 *   provide: MOMENT, useValue: moment
 * }, {
 *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
 * }]
 *
 * ```
 */
var CalendarMomentDateFormatter = /** @class */ (function () {
    /**
     * @hidden
     */
    function CalendarMomentDateFormatter(moment, dateAdapter) {
        this.moment = moment;
        this.dateAdapter = dateAdapter;
    }
    /**
     * The month view header week day labels
     */
    CalendarMomentDateFormatter.prototype.monthViewColumnHeader = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('dddd');
    };
    /**
     * The month view cell day number
     */
    CalendarMomentDateFormatter.prototype.monthViewDayNumber = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('D');
    };
    /**
     * The month view title
     */
    CalendarMomentDateFormatter.prototype.monthViewTitle = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('MMMM YYYY');
    };
    /**
     * The week view header week day labels
     */
    CalendarMomentDateFormatter.prototype.weekViewColumnHeader = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('dddd');
    };
    /**
     * The week view sub header day and month labels
     */
    CalendarMomentDateFormatter.prototype.weekViewColumnSubHeader = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('MMM D');
    };
    /**
     * The week view title
     */
    CalendarMomentDateFormatter.prototype.weekViewTitle = function (_a) {
        var _this = this;
        var date = _a.date, locale = _a.locale, weekStartsOn = _a.weekStartsOn, excludeDays = _a.excludeDays, daysInWeek = _a.daysInWeek;
        var _b = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek), viewStart = _b.viewStart, viewEnd = _b.viewEnd;
        var format = function (dateToFormat, showYear) {
            return _this.moment(dateToFormat)
                .locale(locale)
                .format('MMM D' + (showYear ? ', YYYY' : ''));
        };
        return format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear()) + " - " + format(viewEnd, true);
    };
    /**
     * The time formatting down the left hand side of the week view
     */
    CalendarMomentDateFormatter.prototype.weekViewHour = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('ha');
    };
    /**
     * The time formatting down the left hand side of the day view
     */
    CalendarMomentDateFormatter.prototype.dayViewHour = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('ha');
    };
    /**
     * The day view title
     */
    CalendarMomentDateFormatter.prototype.dayViewTitle = function (_a) {
        var date = _a.date, locale = _a.locale;
        return this.moment(date).locale(locale).format('dddd, D MMMM, YYYY');
    };
    CalendarMomentDateFormatter.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [MOMENT,] }] },
        { type: DateAdapter }
    ]; };
    CalendarMomentDateFormatter = __decorate([
        Injectable(),
        __param(0, Inject(MOMENT)),
        __metadata("design:paramtypes", [Object, DateAdapter])
    ], CalendarMomentDateFormatter);
    return CalendarMomentDateFormatter;
}());
export { CalendarMomentDateFormatter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9tZW50LWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLW1vbWVudC1kYXRlLWZvcm1hdHRlci5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBS25FLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFL0QsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUEyQixJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUzRTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSDtJQUVFOztPQUVHO0lBQ0gscUNBQzRCLE1BQVcsRUFDM0IsV0FBd0I7UUFEUixXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQzNCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQ2pDLENBQUM7SUFFSjs7T0FFRztJQUNJLDJEQUFxQixHQUE1QixVQUE2QixFQUFxQztZQUFuQyxjQUFJLEVBQUUsa0JBQU07UUFDekMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0RBQWtCLEdBQXpCLFVBQTBCLEVBQXFDO1lBQW5DLGNBQUksRUFBRSxrQkFBTTtRQUN0QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxvREFBYyxHQUFyQixVQUFzQixFQUFxQztZQUFuQyxjQUFJLEVBQUUsa0JBQU07UUFDbEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksMERBQW9CLEdBQTNCLFVBQTRCLEVBQXFDO1lBQW5DLGNBQUksRUFBRSxrQkFBTTtRQUN4QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw2REFBdUIsR0FBOUIsVUFBK0IsRUFHVDtZQUZwQixjQUFJLEVBQ0osa0JBQU07UUFFTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxtREFBYSxHQUFwQixVQUFxQixFQU1DO1FBTnRCLGlCQXNCQztZQXJCQyxjQUFJLEVBQ0osa0JBQU0sRUFDTiw4QkFBWSxFQUNaLDRCQUFXLEVBQ1gsMEJBQVU7UUFFSixJQUFBLHFGQU1MLEVBTk8sd0JBQVMsRUFBRSxvQkFNbEIsQ0FBQztRQUNGLElBQU0sTUFBTSxHQUFHLFVBQUMsWUFBa0IsRUFBRSxRQUFpQjtZQUNuRCxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2lCQUN0QixNQUFNLENBQUMsTUFBTSxDQUFDO2lCQUNkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFGL0MsQ0FFK0MsQ0FBQztRQUNsRCxPQUFVLE1BQU0sQ0FDZCxTQUFTLEVBQ1QsU0FBUyxDQUFDLGNBQWMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FDeEQsV0FBTSxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBRyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRztJQUNJLGtEQUFZLEdBQW5CLFVBQW9CLEVBQXFDO1lBQW5DLGNBQUksRUFBRSxrQkFBTTtRQUNoQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxpREFBVyxHQUFsQixVQUFtQixFQUFxQztZQUFuQyxjQUFJLEVBQUUsa0JBQU07UUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksa0RBQVksR0FBbkIsVUFBb0IsRUFBcUM7WUFBbkMsY0FBSSxFQUFFLGtCQUFNO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdkUsQ0FBQzs7Z0RBeEZFLE1BQU0sU0FBQyxNQUFNO2dCQUNTLFdBQVc7O0lBUHpCLDJCQUEyQjtRQUR2QyxVQUFVLEVBQUU7UUFPUixXQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtpREFDUSxXQUFXO09BUHpCLDJCQUEyQixDQStGdkM7SUFBRCxrQ0FBQztDQUFBLEFBL0ZELElBK0ZDO1NBL0ZZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuLCBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbGVuZGFyRGF0ZUZvcm1hdHRlckludGVyZmFjZSxcbiAgRGF0ZUZvcm1hdHRlclBhcmFtcyxcbn0gZnJvbSAnLi9jYWxlbmRhci1kYXRlLWZvcm1hdHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZ2V0V2Vla1ZpZXdQZXJpb2QgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5cbmV4cG9ydCBjb25zdCBNT01FTlQ6IEluamVjdGlvblRva2VuPHN0cmluZz4gPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ01vbWVudCcpO1xuXG4vKipcbiAqIFRoaXMgd2lsbCB1c2UgPGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+bW9tZW50PC9hPiB0byBkbyBhbGwgZGF0ZSBmb3JtYXR0aW5nLiBUbyB1c2UgdGhpcyBjbGFzczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIsIENhbGVuZGFyTW9tZW50RGF0ZUZvcm1hdHRlciwgTU9NRU5UIH0gZnJvbSAnYW5ndWxhci1jYWxlbmRhcic7XG4gKiBpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG4gKlxuICogLy8gaW4geW91ciBjb21wb25lbnRcbiAqIHByb3ZpZGU6IFt7XG4gKiAgIHByb3ZpZGU6IE1PTUVOVCwgdXNlVmFsdWU6IG1vbWVudFxuICogfSwge1xuICogICBwcm92aWRlOiBDYWxlbmRhckRhdGVGb3JtYXR0ZXIsIHVzZUNsYXNzOiBDYWxlbmRhck1vbWVudERhdGVGb3JtYXR0ZXJcbiAqIH1dXG4gKlxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYWxlbmRhck1vbWVudERhdGVGb3JtYXR0ZXJcbiAgaW1wbGVtZW50cyBDYWxlbmRhckRhdGVGb3JtYXR0ZXJJbnRlcmZhY2Uge1xuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNT01FTlQpIHByb3RlY3RlZCBtb21lbnQ6IGFueSxcbiAgICBwcm90ZWN0ZWQgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyXG4gICkge31cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgaGVhZGVyIHdlZWsgZGF5IGxhYmVsc1xuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld0NvbHVtbkhlYWRlcih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb21lbnQoZGF0ZSkubG9jYWxlKGxvY2FsZSkuZm9ybWF0KCdkZGRkJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vbnRoIHZpZXcgY2VsbCBkYXkgbnVtYmVyXG4gICAqL1xuICBwdWJsaWMgbW9udGhWaWV3RGF5TnVtYmVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKS5sb2NhbGUobG9jYWxlKS5mb3JtYXQoJ0QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld1RpdGxlKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKS5sb2NhbGUobG9jYWxlKS5mb3JtYXQoJ01NTU0gWVlZWScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgaGVhZGVyIHdlZWsgZGF5IGxhYmVsc1xuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3Q29sdW1uSGVhZGVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKS5sb2NhbGUobG9jYWxlKS5mb3JtYXQoJ2RkZGQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd2VlayB2aWV3IHN1YiBoZWFkZXIgZGF5IGFuZCBtb250aCBsYWJlbHNcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld0NvbHVtblN1YkhlYWRlcih7XG4gICAgZGF0ZSxcbiAgICBsb2NhbGUsXG4gIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKS5sb2NhbGUobG9jYWxlKS5mb3JtYXQoJ01NTSBEJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHdlZWsgdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3VGl0bGUoe1xuICAgIGRhdGUsXG4gICAgbG9jYWxlLFxuICAgIHdlZWtTdGFydHNPbixcbiAgICBleGNsdWRlRGF5cyxcbiAgICBkYXlzSW5XZWVrLFxuICB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IHZpZXdTdGFydCwgdmlld0VuZCB9ID0gZ2V0V2Vla1ZpZXdQZXJpb2QoXG4gICAgICB0aGlzLmRhdGVBZGFwdGVyLFxuICAgICAgZGF0ZSxcbiAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVEYXlzLFxuICAgICAgZGF5c0luV2Vla1xuICAgICk7XG4gICAgY29uc3QgZm9ybWF0ID0gKGRhdGVUb0Zvcm1hdDogRGF0ZSwgc2hvd1llYXI6IGJvb2xlYW4pID0+XG4gICAgICB0aGlzLm1vbWVudChkYXRlVG9Gb3JtYXQpXG4gICAgICAgIC5sb2NhbGUobG9jYWxlKVxuICAgICAgICAuZm9ybWF0KCdNTU0gRCcgKyAoc2hvd1llYXIgPyAnLCBZWVlZJyA6ICcnKSk7XG4gICAgcmV0dXJuIGAke2Zvcm1hdChcbiAgICAgIHZpZXdTdGFydCxcbiAgICAgIHZpZXdTdGFydC5nZXRVVENGdWxsWWVhcigpICE9PSB2aWV3RW5kLmdldFVUQ0Z1bGxZZWFyKClcbiAgICApfSAtICR7Zm9ybWF0KHZpZXdFbmQsIHRydWUpfWA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgd2VlayB2aWV3XG4gICAqL1xuICBwdWJsaWMgd2Vla1ZpZXdIb3VyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1vbWVudChkYXRlKS5sb2NhbGUobG9jYWxlKS5mb3JtYXQoJ2hhJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgZGF5IHZpZXdcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3SG91cih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb21lbnQoZGF0ZSkubG9jYWxlKGxvY2FsZSkuZm9ybWF0KCdoYScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIGRheVZpZXdUaXRsZSh7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tb21lbnQoZGF0ZSkubG9jYWxlKGxvY2FsZSkuZm9ybWF0KCdkZGRkLCBEIE1NTU0sIFlZWVknKTtcbiAgfVxufVxuIl19