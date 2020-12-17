import { __decorate, __metadata } from "tslib";
import { Component, Input, TemplateRef, EventEmitter, Output, } from '@angular/core';
import { trackByWeekDayHeaderDate } from '../common/util';
var CalendarMonthViewHeaderComponent = /** @class */ (function () {
    function CalendarMonthViewHeaderComponent() {
        this.columnHeaderClicked = new EventEmitter();
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    }
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], CalendarMonthViewHeaderComponent.prototype, "days", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CalendarMonthViewHeaderComponent.prototype, "locale", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarMonthViewHeaderComponent.prototype, "customTemplate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarMonthViewHeaderComponent.prototype, "columnHeaderClicked", void 0);
    CalendarMonthViewHeaderComponent = __decorate([
        Component({
            selector: 'mwl-calendar-month-view-header',
            template: "\n    <ng-template\n      #defaultTemplate\n      let-days=\"days\"\n      let-locale=\"locale\"\n      let-trackByWeekDayHeaderDate=\"trackByWeekDayHeaderDate\"\n    >\n      <div class=\"cal-cell-row cal-header\" role=\"row\">\n        <div\n          class=\"cal-cell\"\n          *ngFor=\"let day of days; trackBy: trackByWeekDayHeaderDate\"\n          [class.cal-past]=\"day.isPast\"\n          [class.cal-today]=\"day.isToday\"\n          [class.cal-future]=\"day.isFuture\"\n          [class.cal-weekend]=\"day.isWeekend\"\n          (click)=\"\n            columnHeaderClicked.emit({\n              isoDayNumber: day.day,\n              sourceEvent: $event\n            })\n          \"\n          [ngClass]=\"day.cssClass\"\n          tabindex=\"0\"\n          role=\"columnheader\"\n        >\n          {{ day.date | calendarDate: 'monthViewColumnHeader':locale }}\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        days: days,\n        locale: locale,\n        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate\n      }\"\n    >\n    </ng-template>\n  "
        })
    ], CalendarMonthViewHeaderComponent);
    return CalendarMonthViewHeaderComponent;
}());
export { CalendarMonthViewHeaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9udGgtdmlldy1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvbW9udGgvY2FsZW5kYXItbW9udGgtdmlldy1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQTZDMUQ7SUFBQTtRQU9ZLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUc1QyxDQUFDO1FBRUwsNkJBQXdCLEdBQUcsd0JBQXdCLENBQUM7SUFDdEQsQ0FBQztJQVpVO1FBQVIsS0FBSyxFQUFFOztrRUFBbUI7SUFFbEI7UUFBUixLQUFLLEVBQUU7O29FQUFnQjtJQUVmO1FBQVIsS0FBSyxFQUFFO2tDQUFpQixXQUFXOzRFQUFNO0lBRWhDO1FBQVQsTUFBTSxFQUFFOztpRkFHSjtJQVZNLGdDQUFnQztRQTFDNUMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGdDQUFnQztZQUMxQyxRQUFRLEVBQUUsMHFDQXNDVDtTQUNGLENBQUM7T0FDVyxnQ0FBZ0MsQ0FhNUM7SUFBRCx1Q0FBQztDQUFBLEFBYkQsSUFhQztTQWJZLGdDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0cmFja0J5V2Vla0RheUhlYWRlckRhdGUgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBNQ1dlZWtEYXkgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItbW9udGgtdmlldy1oZWFkZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWRheXM9XCJkYXlzXCJcbiAgICAgIGxldC1sb2NhbGU9XCJsb2NhbGVcIlxuICAgICAgbGV0LXRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZT1cInRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZVwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbC1jZWxsLXJvdyBjYWwtaGVhZGVyXCIgcm9sZT1cInJvd1wiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJjYWwtY2VsbFwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGRheSBvZiBkYXlzOyB0cmFja0J5OiB0cmFja0J5V2Vla0RheUhlYWRlckRhdGVcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtcGFzdF09XCJkYXkuaXNQYXN0XCJcbiAgICAgICAgICBbY2xhc3MuY2FsLXRvZGF5XT1cImRheS5pc1RvZGF5XCJcbiAgICAgICAgICBbY2xhc3MuY2FsLWZ1dHVyZV09XCJkYXkuaXNGdXR1cmVcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtd2Vla2VuZF09XCJkYXkuaXNXZWVrZW5kXCJcbiAgICAgICAgICAoY2xpY2spPVwiXG4gICAgICAgICAgICBjb2x1bW5IZWFkZXJDbGlja2VkLmVtaXQoe1xuICAgICAgICAgICAgICBpc29EYXlOdW1iZXI6IGRheS5kYXksXG4gICAgICAgICAgICAgIHNvdXJjZUV2ZW50OiAkZXZlbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXCJcbiAgICAgICAgICBbbmdDbGFzc109XCJkYXkuY3NzQ2xhc3NcIlxuICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiXG4gICAgICAgID5cbiAgICAgICAgICB7eyBkYXkuZGF0ZSB8IGNhbGVuZGFyRGF0ZTogJ21vbnRoVmlld0NvbHVtbkhlYWRlcic6bG9jYWxlIH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBkYXlzOiBkYXlzLFxuICAgICAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICAgICAgdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlOiB0cmFja0J5V2Vla0RheUhlYWRlckRhdGVcbiAgICAgIH1cIlxuICAgID5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhck1vbnRoVmlld0hlYWRlckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGRheXM6IE1DV2Vla0RheVtdO1xuXG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBPdXRwdXQoKSBjb2x1bW5IZWFkZXJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgaXNvRGF5TnVtYmVyOiBudW1iZXI7XG4gICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQ7XG4gIH0+KCk7XG5cbiAgdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlID0gdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlO1xufVxuIl19