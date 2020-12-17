import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
/**
 * Shows all events on a given day. Example usage:
 *
 * ```typescript
 * <mwl-calendar-day-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-day-view>
 * ```
 */
var CalendarDayViewComponent = /** @class */ (function () {
    function CalendarDayViewComponent() {
        /**
         * An array of events to display on view
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * The number of segments in an hour. Must be <= 6
         */
        this.hourSegments = 2;
        /**
         * The height in pixels of each hour segment
         */
        this.hourSegmentHeight = 30;
        /**
         * The day start hours in 24 hour time. Must be 0-23
         */
        this.dayStartHour = 0;
        /**
         * The day start minutes. Must be 0-59
         */
        this.dayStartMinute = 0;
        /**
         * The day end hours in 24 hour time. Must be 0-23
         */
        this.dayEndHour = 23;
        /**
         * The day end minutes. Must be 0-59
         */
        this.dayEndMinute = 59;
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'auto';
        this.tooltipDisabled = true;
        /**
         * Whether to append tooltips to the body or next to the trigger element
         */
        this.tooltipAppendToBody = true;
        /**
         * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
         * will be displayed immediately.
         */
        this.tooltipDelay = null;
        /**
         * Whether to snap events to a grid when dragging
         */
        this.snapDraggedEvents = true;
        /**
         * Called when an event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an hour segment is clicked
         */
        this.hourSegmentClicked = new EventEmitter();
        /**
         * Called when an event is resized or dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * An output that will be called before the view is rendered for the current day.
         * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
         */
        this.beforeViewRender = new EventEmitter();
    }
    __decorate([
        Input(),
        __metadata("design:type", Date)
    ], CalendarDayViewComponent.prototype, "viewDate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], CalendarDayViewComponent.prototype, "events", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "hourSegments", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "hourSegmentHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "dayStartHour", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "dayStartMinute", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "dayEndHour", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "dayEndMinute", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Subject)
    ], CalendarDayViewComponent.prototype, "refresh", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CalendarDayViewComponent.prototype, "locale", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "eventSnapSize", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CalendarDayViewComponent.prototype, "tooltipPlacement", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "tooltipTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CalendarDayViewComponent.prototype, "tooltipDisabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CalendarDayViewComponent.prototype, "tooltipAppendToBody", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarDayViewComponent.prototype, "tooltipDelay", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "hourSegmentTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "eventTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "eventTitleTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "eventActionsTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CalendarDayViewComponent.prototype, "snapDraggedEvents", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "allDayEventsLabelTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarDayViewComponent.prototype, "currentTimeMarkerTemplate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarDayViewComponent.prototype, "eventClicked", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarDayViewComponent.prototype, "hourSegmentClicked", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarDayViewComponent.prototype, "eventTimesChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarDayViewComponent.prototype, "beforeViewRender", void 0);
    CalendarDayViewComponent = __decorate([
        Component({
            selector: 'mwl-calendar-day-view',
            template: "\n    <mwl-calendar-week-view\n      class=\"cal-day-view\"\n      [daysInWeek]=\"1\"\n      [viewDate]=\"viewDate\"\n      [events]=\"events\"\n      [hourSegments]=\"hourSegments\"\n      [hourSegmentHeight]=\"hourSegmentHeight\"\n      [dayStartHour]=\"dayStartHour\"\n      [dayStartMinute]=\"dayStartMinute\"\n      [dayEndHour]=\"dayEndHour\"\n      [dayEndMinute]=\"dayEndMinute\"\n      [refresh]=\"refresh\"\n      [locale]=\"locale\"\n      [eventSnapSize]=\"eventSnapSize\"\n      [tooltipPlacement]=\"tooltipPlacement\"\n      [tooltipDisabled]=\"tooltipDisabled\"\n      [tooltipTemplate]=\"tooltipTemplate\"\n      [tooltipAppendToBody]=\"tooltipAppendToBody\"\n      [tooltipDelay]=\"tooltipDelay\"\n      [hourSegmentTemplate]=\"hourSegmentTemplate\"\n      [eventTemplate]=\"eventTemplate\"\n      [eventTitleTemplate]=\"eventTitleTemplate\"\n      [eventActionsTemplate]=\"eventActionsTemplate\"\n      [snapDraggedEvents]=\"snapDraggedEvents\"\n      [allDayEventsLabelTemplate]=\"allDayEventsLabelTemplate\"\n      [currentTimeMarkerTemplate]=\"currentTimeMarkerTemplate\"\n      (eventClicked)=\"eventClicked.emit($event)\"\n      (hourSegmentClicked)=\"hourSegmentClicked.emit($event)\"\n      (eventTimesChanged)=\"eventTimesChanged.emit($event)\"\n      (beforeViewRender)=\"beforeViewRender.emit($event)\"\n    ></mwl-calendar-week-view>\n  "
        })
    ], CalendarDayViewComponent);
    return CalendarDayViewComponent;
}());
export { CalendarDayViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZGF5LXZpZXcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvZGF5L2NhbGVuZGFyLWRheS12aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQU0vQjs7Ozs7Ozs7O0dBU0c7QUFxQ0g7SUFBQTtRQU1FOzs7V0FHRztRQUNNLFdBQU0sR0FBYyxFQUFFLENBQUM7UUFFaEM7O1dBRUc7UUFDTSxpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUVsQzs7V0FFRztRQUNNLHNCQUFpQixHQUFXLEVBQUUsQ0FBQztRQUV4Qzs7V0FFRztRQUNNLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBRWxDOztXQUVHO1FBQ00sbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFFcEM7O1dBRUc7UUFDTSxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBRWpDOztXQUVHO1FBQ00saUJBQVksR0FBVyxFQUFFLENBQUM7UUFpQm5DOztXQUVHO1FBQ00scUJBQWdCLEdBQW1CLE1BQU0sQ0FBQztRQVExQyxvQkFBZSxHQUFHLElBQUksQ0FBQztRQUVoQzs7V0FFRztRQUNNLHdCQUFtQixHQUFZLElBQUksQ0FBQztRQUU3Qzs7O1dBR0c7UUFDTSxpQkFBWSxHQUFrQixJQUFJLENBQUM7UUFzQjVDOztXQUVHO1FBQ00sc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBWTNDOztXQUVHO1FBQ08saUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWpEOztXQUVHO1FBQ08sdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBRTNDLENBQUM7UUFFTDs7V0FFRztRQUNPLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUUzQyxDQUFDO1FBRUo7OztXQUdHO1FBQ08scUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBRTFDLENBQUM7SUFDTixDQUFDO0lBMUlVO1FBQVIsS0FBSyxFQUFFO2tDQUFXLElBQUk7OERBQUM7SUFNZjtRQUFSLEtBQUssRUFBRTs7NERBQXdCO0lBS3ZCO1FBQVIsS0FBSyxFQUFFOztrRUFBMEI7SUFLekI7UUFBUixLQUFLLEVBQUU7O3VFQUFnQztJQUsvQjtRQUFSLEtBQUssRUFBRTs7a0VBQTBCO0lBS3pCO1FBQVIsS0FBSyxFQUFFOztvRUFBNEI7SUFLM0I7UUFBUixLQUFLLEVBQUU7O2dFQUF5QjtJQUt4QjtRQUFSLEtBQUssRUFBRTs7a0VBQTJCO0lBSzFCO1FBQVIsS0FBSyxFQUFFO2tDQUFVLE9BQU87NkRBQU07SUFLdEI7UUFBUixLQUFLLEVBQUU7OzREQUFnQjtJQUtmO1FBQVIsS0FBSyxFQUFFOzttRUFBdUI7SUFLdEI7UUFBUixLQUFLLEVBQUU7O3NFQUEyQztJQUsxQztRQUFSLEtBQUssRUFBRTtrQ0FBa0IsV0FBVztxRUFBTTtJQUdsQztRQUFSLEtBQUssRUFBRTs7cUVBQXdCO0lBS3ZCO1FBQVIsS0FBSyxFQUFFOzt5RUFBcUM7SUFNcEM7UUFBUixLQUFLLEVBQUU7O2tFQUFvQztJQUtuQztRQUFSLEtBQUssRUFBRTtrQ0FBc0IsV0FBVzt5RUFBTTtJQUt0QztRQUFSLEtBQUssRUFBRTtrQ0FBZ0IsV0FBVzttRUFBTTtJQUtoQztRQUFSLEtBQUssRUFBRTtrQ0FBcUIsV0FBVzt3RUFBTTtJQUtyQztRQUFSLEtBQUssRUFBRTtrQ0FBdUIsV0FBVzswRUFBTTtJQUt2QztRQUFSLEtBQUssRUFBRTs7dUVBQW1DO0lBS2xDO1FBQVIsS0FBSyxFQUFFO2tDQUE0QixXQUFXOytFQUFNO0lBSzVDO1FBQVIsS0FBSyxFQUFFO2tDQUE0QixXQUFXOytFQUFNO0lBSzNDO1FBQVQsTUFBTSxFQUFFOztrRUFBd0M7SUFLdkM7UUFBVCxNQUFNLEVBQUU7O3dFQUVKO0lBS0s7UUFBVCxNQUFNLEVBQUU7O3VFQUVMO0lBTU07UUFBVCxNQUFNLEVBQUU7O3NFQUVMO0lBN0lPLHdCQUF3QjtRQXBDcEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxRQUFRLEVBQUUsdzFDQWdDVDtTQUNGLENBQUM7T0FDVyx3QkFBd0IsQ0E4SXBDO0lBQUQsK0JBQUM7Q0FBQSxBQTlJRCxJQThJQztTQTlJWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7IE1DRXZlbnQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50IH0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpbWVzLWNoYW5nZWQtZXZlbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdCZWZvcmVSZW5kZXJFdmVudCB9IGZyb20gJy4uL3dlZWsvY2FsZW5kYXItd2Vlay5tb2R1bGUnO1xuXG5leHBvcnQgdHlwZSBDYWxlbmRhckRheVZpZXdCZWZvcmVSZW5kZXJFdmVudCA9IENhbGVuZGFyV2Vla1ZpZXdCZWZvcmVSZW5kZXJFdmVudDtcblxuLyoqXG4gKiBTaG93cyBhbGwgZXZlbnRzIG9uIGEgZ2l2ZW4gZGF5LiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIDxtd2wtY2FsZW5kYXItZGF5LXZpZXdcbiAqICBbdmlld0RhdGVdPVwidmlld0RhdGVcIlxuICogIFtldmVudHNdPVwiZXZlbnRzXCI+XG4gKiA8L213bC1jYWxlbmRhci1kYXktdmlldz5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItZGF5LXZpZXcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxtd2wtY2FsZW5kYXItd2Vlay12aWV3XG4gICAgICBjbGFzcz1cImNhbC1kYXktdmlld1wiXG4gICAgICBbZGF5c0luV2Vla109XCIxXCJcbiAgICAgIFt2aWV3RGF0ZV09XCJ2aWV3RGF0ZVwiXG4gICAgICBbZXZlbnRzXT1cImV2ZW50c1wiXG4gICAgICBbaG91clNlZ21lbnRzXT1cImhvdXJTZWdtZW50c1wiXG4gICAgICBbaG91clNlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgW2RheVN0YXJ0SG91cl09XCJkYXlTdGFydEhvdXJcIlxuICAgICAgW2RheVN0YXJ0TWludXRlXT1cImRheVN0YXJ0TWludXRlXCJcbiAgICAgIFtkYXlFbmRIb3VyXT1cImRheUVuZEhvdXJcIlxuICAgICAgW2RheUVuZE1pbnV0ZV09XCJkYXlFbmRNaW51dGVcIlxuICAgICAgW3JlZnJlc2hdPVwicmVmcmVzaFwiXG4gICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICBbZXZlbnRTbmFwU2l6ZV09XCJldmVudFNuYXBTaXplXCJcbiAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxuICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICBbdG9vbHRpcERlbGF5XT1cInRvb2x0aXBEZWxheVwiXG4gICAgICBbaG91clNlZ21lbnRUZW1wbGF0ZV09XCJob3VyU2VnbWVudFRlbXBsYXRlXCJcbiAgICAgIFtldmVudFRlbXBsYXRlXT1cImV2ZW50VGVtcGxhdGVcIlxuICAgICAgW2V2ZW50VGl0bGVUZW1wbGF0ZV09XCJldmVudFRpdGxlVGVtcGxhdGVcIlxuICAgICAgW2V2ZW50QWN0aW9uc1RlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgIFtzbmFwRHJhZ2dlZEV2ZW50c109XCJzbmFwRHJhZ2dlZEV2ZW50c1wiXG4gICAgICBbYWxsRGF5RXZlbnRzTGFiZWxUZW1wbGF0ZV09XCJhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlXCJcbiAgICAgIFtjdXJyZW50VGltZU1hcmtlclRlbXBsYXRlXT1cImN1cnJlbnRUaW1lTWFya2VyVGVtcGxhdGVcIlxuICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgIChob3VyU2VnbWVudENsaWNrZWQpPVwiaG91clNlZ21lbnRDbGlja2VkLmVtaXQoJGV2ZW50KVwiXG4gICAgICAoZXZlbnRUaW1lc0NoYW5nZWQpPVwiZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgIChiZWZvcmVWaWV3UmVuZGVyKT1cImJlZm9yZVZpZXdSZW5kZXIuZW1pdCgkZXZlbnQpXCJcbiAgICA+PC9td2wtY2FsZW5kYXItd2Vlay12aWV3PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckRheVZpZXdDb21wb25lbnQge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKSB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgb24gdmlld1xuICAgKiBUaGUgc2NoZW1hIGlzIGF2YWlsYWJsZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvY2FsZW5kYXItdXRpbHMvYmxvYi9jNTE2ODk5ODVmNTlhMjcxOTQwZTMwYmM0ZTJjNGUxZmVlM2ZjYjVjL3NyYy9jYWxlbmRhclV0aWxzLnRzI0w0OS1MNjNcbiAgICovXG4gIEBJbnB1dCgpIGV2ZW50czogTUNFdmVudFtdID0gW107XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgaW4gYW4gaG91ci4gTXVzdCBiZSA8PSA2XG4gICAqL1xuICBASW5wdXQoKSBob3VyU2VnbWVudHM6IG51bWJlciA9IDI7XG5cbiAgLyoqXG4gICAqIFRoZSBoZWlnaHQgaW4gcGl4ZWxzIG9mIGVhY2ggaG91ciBzZWdtZW50XG4gICAqL1xuICBASW5wdXQoKSBob3VyU2VnbWVudEhlaWdodDogbnVtYmVyID0gMzA7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgc3RhcnQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICovXG4gIEBJbnB1dCgpIGRheVN0YXJ0SG91cjogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogVGhlIGRheSBzdGFydCBtaW51dGVzLiBNdXN0IGJlIDAtNTlcbiAgICovXG4gIEBJbnB1dCgpIGRheVN0YXJ0TWludXRlOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IGVuZCBob3VycyBpbiAyNCBob3VyIHRpbWUuIE11c3QgYmUgMC0yM1xuICAgKi9cbiAgQElucHV0KCkgZGF5RW5kSG91cjogbnVtYmVyID0gMjM7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgZW5kIG1pbnV0ZXMuIE11c3QgYmUgMC01OVxuICAgKi9cbiAgQElucHV0KCkgZGF5RW5kTWludXRlOiBudW1iZXIgPSA1OTtcblxuICAvKipcbiAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IHdoZW4gZW1pdHRlZCBvbiB3aWxsIHJlLXJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAqL1xuICBASW5wdXQoKSByZWZyZXNoOiBTdWJqZWN0PGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgdXNlZCB0byBmb3JtYXQgZGF0ZXNcbiAgICovXG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZ3JpZCBzaXplIHRvIHNuYXAgcmVzaXppbmcgYW5kIGRyYWdnaW5nIG9mIGV2ZW50cyB0b1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRTbmFwU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcGxhY2VtZW50IG9mIHRoZSBldmVudCB0b29sdGlwXG4gICAqL1xuICBASW5wdXQoKSB0b29sdGlwUGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICdhdXRvJztcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB0aGUgZXZlbnQgdG9vbHRpcHNcbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXBwZW5kIHRvb2x0aXBzIHRvIHRoZSBib2R5IG9yIG5leHQgdG8gdGhlIHRyaWdnZXIgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSB0b29sdGlwIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIG5vdCBwcm92aWRlZCB0aGUgdG9vbHRpcFxuICAgKiB3aWxsIGJlIGRpc3BsYXllZCBpbW1lZGlhdGVseS5cbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBEZWxheTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBob3VyIHNlZ21lbnRcbiAgICovXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgZGF5IHZpZXcgZXZlbnRzXG4gICAqL1xuICBASW5wdXQoKSBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IHRpdGxlc1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IGFjdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHNuYXAgZXZlbnRzIHRvIGEgZ3JpZCB3aGVuIGRyYWdnaW5nXG4gICAqL1xuICBASW5wdXQoKSBzbmFwRHJhZ2dlZEV2ZW50czogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGFsbCBkYXkgZXZlbnRzIGxhYmVsIHRleHRcbiAgICovXG4gIEBJbnB1dCgpIGFsbERheUV2ZW50c0xhYmVsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGN1cnJlbnQgdGltZSBtYXJrZXJcbiAgICovXG4gIEBJbnB1dCgpIGN1cnJlbnRUaW1lTWFya2VyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGFuIGV2ZW50IHRpdGxlIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gaG91ciBzZWdtZW50IGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBob3VyU2VnbWVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBkYXRlOiBEYXRlO1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhbiBldmVudCBpcyByZXNpemVkIG9yIGRyYWdnZWQgYW5kIGRyb3BwZWRcbiAgICovXG4gIEBPdXRwdXQoKSBldmVudFRpbWVzQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50XG4gID4oKTtcblxuICAvKipcbiAgICogQW4gb3V0cHV0IHRoYXQgd2lsbCBiZSBjYWxsZWQgYmVmb3JlIHRoZSB2aWV3IGlzIHJlbmRlcmVkIGZvciB0aGUgY3VycmVudCBkYXkuXG4gICAqIElmIHlvdSBhZGQgdGhlIGBjc3NDbGFzc2AgcHJvcGVydHkgdG8gYW4gaG91ciBncmlkIHNlZ21lbnQgaXQgd2lsbCBhZGQgdGhhdCBjbGFzcyB0byB0aGUgaG91ciBzZWdtZW50IGluIHRoZSB0ZW1wbGF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIGJlZm9yZVZpZXdSZW5kZXIgPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIENhbGVuZGFyRGF5Vmlld0JlZm9yZVJlbmRlckV2ZW50XG4gID4oKTtcbn1cbiJdfQ==