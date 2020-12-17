import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { trackByWeekDayHeaderDate } from '../common/util';
var CalendarWeekViewHeaderComponent = /** @class */ (function () {
    function CalendarWeekViewHeaderComponent() {
        this.dayHeaderClicked = new EventEmitter();
        this.eventDropped = new EventEmitter();
        this.dragEnter = new EventEmitter();
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    }
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], CalendarWeekViewHeaderComponent.prototype, "days", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CalendarWeekViewHeaderComponent.prototype, "locale", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarWeekViewHeaderComponent.prototype, "customTemplate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarWeekViewHeaderComponent.prototype, "dayHeaderClicked", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarWeekViewHeaderComponent.prototype, "eventDropped", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], CalendarWeekViewHeaderComponent.prototype, "dragEnter", void 0);
    CalendarWeekViewHeaderComponent = __decorate([
        Component({
            selector: 'mwl-calendar-week-view-header',
            template: "\n    <ng-template\n      #defaultTemplate\n      let-days=\"days\"\n      let-locale=\"locale\"\n      let-dayHeaderClicked=\"dayHeaderClicked\"\n      let-eventDropped=\"eventDropped\"\n      let-trackByWeekDayHeaderDate=\"trackByWeekDayHeaderDate\"\n      let-dragEnter=\"dragEnter\"\n    >\n      <div class=\"cal-day-headers\" role=\"row\">\n        <div\n          class=\"cal-header\"\n          *ngFor=\"let day of days; trackBy: trackByWeekDayHeaderDate\"\n          [class.cal-past]=\"day.isPast\"\n          [class.cal-today]=\"day.isToday\"\n          [class.cal-future]=\"day.isFuture\"\n          [class.cal-weekend]=\"day.isWeekend\"\n          [ngClass]=\"day.cssClass\"\n          (mwlClick)=\"dayHeaderClicked.emit({ day: day, sourceEvent: $event })\"\n          mwlDroppable\n          dragOverClass=\"cal-drag-over\"\n          (drop)=\"\n            eventDropped.emit({\n              event: $event.dropData.event,\n              newStart: day.date\n            })\n          \"\n          (dragEnter)=\"dragEnter.emit({ date: day.date })\"\n          tabindex=\"0\"\n          role=\"columnheader\"\n        >\n          <b>{{ day.date | calendarDate: 'weekViewColumnHeader':locale }}</b\n          ><br />\n          <span>{{\n            day.date | calendarDate: 'weekViewColumnSubHeader':locale\n          }}</span>\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        days: days,\n        locale: locale,\n        dayHeaderClicked: dayHeaderClicked,\n        eventDropped: eventDropped,\n        dragEnter: dragEnter,\n        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate\n      }\"\n    >\n    </ng-template>\n  "
        })
    ], CalendarWeekViewHeaderComponent);
    return CalendarWeekViewHeaderComponent;
}());
export { CalendarWeekViewHeaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWstdmlldy1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFdBQVcsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQTBEMUQ7SUFBQTtRQU9ZLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUd6QyxDQUFDO1FBRUssaUJBQVksR0FBRyxJQUFJLFlBQVksRUFHckMsQ0FBQztRQUVLLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBa0IsQ0FBQztRQUV6RCw2QkFBd0IsR0FBRyx3QkFBd0IsQ0FBQztJQUN0RCxDQUFDO0lBbkJVO1FBQVIsS0FBSyxFQUFFOztpRUFBbUI7SUFFbEI7UUFBUixLQUFLLEVBQUU7O21FQUFnQjtJQUVmO1FBQVIsS0FBSyxFQUFFO2tDQUFpQixXQUFXOzJFQUFNO0lBRWhDO1FBQVQsTUFBTSxFQUFFOzs2RUFHSjtJQUVLO1FBQVQsTUFBTSxFQUFFOzt5RUFHSjtJQUVLO1FBQVQsTUFBTSxFQUFFOztzRUFBZ0Q7SUFqQjlDLCtCQUErQjtRQXhEM0MsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLCtCQUErQjtZQUN6QyxRQUFRLEVBQUUsNHVEQW9EVDtTQUNGLENBQUM7T0FDVywrQkFBK0IsQ0FvQjNDO0lBQUQsc0NBQUM7Q0FBQSxBQXBCRCxJQW9CQztTQXBCWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQ0V2ZW50LCBNQ1dlZWtEYXkgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItd2Vlay12aWV3LWhlYWRlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjZGVmYXVsdFRlbXBsYXRlXG4gICAgICBsZXQtZGF5cz1cImRheXNcIlxuICAgICAgbGV0LWxvY2FsZT1cImxvY2FsZVwiXG4gICAgICBsZXQtZGF5SGVhZGVyQ2xpY2tlZD1cImRheUhlYWRlckNsaWNrZWRcIlxuICAgICAgbGV0LWV2ZW50RHJvcHBlZD1cImV2ZW50RHJvcHBlZFwiXG4gICAgICBsZXQtdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlPVwidHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlXCJcbiAgICAgIGxldC1kcmFnRW50ZXI9XCJkcmFnRW50ZXJcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtZGF5LWhlYWRlcnNcIiByb2xlPVwicm93XCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cImNhbC1oZWFkZXJcIlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBkYXkgb2YgZGF5czsgdHJhY2tCeTogdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlXCJcbiAgICAgICAgICBbY2xhc3MuY2FsLXBhc3RdPVwiZGF5LmlzUGFzdFwiXG4gICAgICAgICAgW2NsYXNzLmNhbC10b2RheV09XCJkYXkuaXNUb2RheVwiXG4gICAgICAgICAgW2NsYXNzLmNhbC1mdXR1cmVdPVwiZGF5LmlzRnV0dXJlXCJcbiAgICAgICAgICBbY2xhc3MuY2FsLXdlZWtlbmRdPVwiZGF5LmlzV2Vla2VuZFwiXG4gICAgICAgICAgW25nQ2xhc3NdPVwiZGF5LmNzc0NsYXNzXCJcbiAgICAgICAgICAobXdsQ2xpY2spPVwiZGF5SGVhZGVyQ2xpY2tlZC5lbWl0KHsgZGF5OiBkYXksIHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcIlxuICAgICAgICAgIG13bERyb3BwYWJsZVxuICAgICAgICAgIGRyYWdPdmVyQ2xhc3M9XCJjYWwtZHJhZy1vdmVyXCJcbiAgICAgICAgICAoZHJvcCk9XCJcbiAgICAgICAgICAgIGV2ZW50RHJvcHBlZC5lbWl0KHtcbiAgICAgICAgICAgICAgZXZlbnQ6ICRldmVudC5kcm9wRGF0YS5ldmVudCxcbiAgICAgICAgICAgICAgbmV3U3RhcnQ6IGRheS5kYXRlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIFwiXG4gICAgICAgICAgKGRyYWdFbnRlcik9XCJkcmFnRW50ZXIuZW1pdCh7IGRhdGU6IGRheS5kYXRlIH0pXCJcbiAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIlxuICAgICAgICA+XG4gICAgICAgICAgPGI+e3sgZGF5LmRhdGUgfCBjYWxlbmRhckRhdGU6ICd3ZWVrVmlld0NvbHVtbkhlYWRlcic6bG9jYWxlIH19PC9iXG4gICAgICAgICAgPjxiciAvPlxuICAgICAgICAgIDxzcGFuPnt7XG4gICAgICAgICAgICBkYXkuZGF0ZSB8IGNhbGVuZGFyRGF0ZTogJ3dlZWtWaWV3Q29sdW1uU3ViSGVhZGVyJzpsb2NhbGVcbiAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIGRheXM6IGRheXMsXG4gICAgICAgIGxvY2FsZTogbG9jYWxlLFxuICAgICAgICBkYXlIZWFkZXJDbGlja2VkOiBkYXlIZWFkZXJDbGlja2VkLFxuICAgICAgICBldmVudERyb3BwZWQ6IGV2ZW50RHJvcHBlZCxcbiAgICAgICAgZHJhZ0VudGVyOiBkcmFnRW50ZXIsXG4gICAgICAgIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTogdHJhY2tCeVdlZWtEYXlIZWFkZXJEYXRlXG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0hlYWRlckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGRheXM6IE1DV2Vla0RheVtdO1xuXG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBPdXRwdXQoKSBkYXlIZWFkZXJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZGF5OiBNQ1dlZWtEYXk7XG4gICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQ7XG4gIH0+KCk7XG5cbiAgQE91dHB1dCgpIGV2ZW50RHJvcHBlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xuICAgIGV2ZW50OiBNQ0V2ZW50O1xuICAgIG5ld1N0YXJ0OiBEYXRlO1xuICB9PigpO1xuXG4gIEBPdXRwdXQoKSBkcmFnRW50ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZGF0ZTogRGF0ZSB9PigpO1xuXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSA9IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTtcbn1cbiJdfQ==