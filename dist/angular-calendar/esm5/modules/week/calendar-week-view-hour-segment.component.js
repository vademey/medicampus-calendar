import { __decorate, __metadata } from "tslib";
import { Component, Input, TemplateRef } from '@angular/core';
var CalendarWeekViewHourSegmentComponent = /** @class */ (function () {
    function CalendarWeekViewHourSegmentComponent() {
    }
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CalendarWeekViewHourSegmentComponent.prototype, "segment", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarWeekViewHourSegmentComponent.prototype, "segmentHeight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CalendarWeekViewHourSegmentComponent.prototype, "locale", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], CalendarWeekViewHourSegmentComponent.prototype, "isTimeLabel", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], CalendarWeekViewHourSegmentComponent.prototype, "daysInWeek", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarWeekViewHourSegmentComponent.prototype, "customTemplate", void 0);
    CalendarWeekViewHourSegmentComponent = __decorate([
        Component({
            selector: 'mwl-calendar-week-view-hour-segment',
            template: "\n    <ng-template\n      #defaultTemplate\n      let-segment=\"segment\"\n      let-locale=\"locale\"\n      let-segmentHeight=\"segmentHeight\"\n      let-isTimeLabel=\"isTimeLabel\"\n      let-daysInWeek=\"daysInWeek\"\n    >\n      <div\n        [attr.aria-hidden]=\"\n          {}\n            | calendarA11y\n              : (daysInWeek === 1\n                  ? 'hideDayHourSegment'\n                  : 'hideWeekHourSegment')\n        \"\n        class=\"cal-hour-segment\"\n        [style.height.px]=\"segmentHeight\"\n        [class.cal-hour-start]=\"segment.isStart\"\n        [class.cal-after-hour-start]=\"!segment.isStart\"\n        [ngClass]=\"segment.cssClass\"\n      >\n        <div class=\"cal-time\" *ngIf=\"isTimeLabel\" [style.height.px]=\"segmentHeight * 2\">\n          {{\n            segment.displayDate\n              | calendarDate\n                : (daysInWeek === 1 ? 'dayViewHour' : 'weekViewHour')\n                : locale\n          }}\n        </div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        segment: segment,\n        locale: locale,\n        segmentHeight: segmentHeight,\n        isTimeLabel: isTimeLabel,\n        daysInWeek: daysInWeek\n      }\"\n    >\n    </ng-template>\n  "
        })
    ], CalendarWeekViewHourSegmentComponent);
    return CalendarWeekViewHourSegmentComponent;
}());
export { CalendarWeekViewHourSegmentComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFtRDlEO0lBQUE7SUFZQSxDQUFDO0lBWFU7UUFBUixLQUFLLEVBQUU7O3lFQUFnQztJQUUvQjtRQUFSLEtBQUssRUFBRTs7K0VBQXVCO0lBRXRCO1FBQVIsS0FBSyxFQUFFOzt3RUFBZ0I7SUFFZjtRQUFSLEtBQUssRUFBRTs7NkVBQXNCO0lBRXJCO1FBQVIsS0FBSyxFQUFFOzs0RUFBb0I7SUFFbkI7UUFBUixLQUFLLEVBQUU7a0NBQWlCLFdBQVc7Z0ZBQU07SUFYL0Isb0NBQW9DO1FBaERoRCxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUNBQXFDO1lBQy9DLFFBQVEsRUFBRSw4ekNBNENUO1NBQ0YsQ0FBQztPQUNXLG9DQUFvQyxDQVloRDtJQUFELDJDQUFDO0NBQUEsQUFaRCxJQVlDO1NBWlksb0NBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1DV2Vla1ZpZXdIb3VyU2VnbWVudCB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9tYy1jYWxlbmRhci11dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC1zZWdtZW50PVwic2VnbWVudFwiXG4gICAgICBsZXQtbG9jYWxlPVwibG9jYWxlXCJcbiAgICAgIGxldC1zZWdtZW50SGVpZ2h0PVwic2VnbWVudEhlaWdodFwiXG4gICAgICBsZXQtaXNUaW1lTGFiZWw9XCJpc1RpbWVMYWJlbFwiXG4gICAgICBsZXQtZGF5c0luV2Vlaz1cImRheXNJbldlZWtcIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwiXG4gICAgICAgICAge31cbiAgICAgICAgICAgIHwgY2FsZW5kYXJBMTF5XG4gICAgICAgICAgICAgIDogKGRheXNJbldlZWsgPT09IDFcbiAgICAgICAgICAgICAgICAgID8gJ2hpZGVEYXlIb3VyU2VnbWVudCdcbiAgICAgICAgICAgICAgICAgIDogJ2hpZGVXZWVrSG91clNlZ21lbnQnKVxuICAgICAgICBcIlxuICAgICAgICBjbGFzcz1cImNhbC1ob3VyLXNlZ21lbnRcIlxuICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cInNlZ21lbnRIZWlnaHRcIlxuICAgICAgICBbY2xhc3MuY2FsLWhvdXItc3RhcnRdPVwic2VnbWVudC5pc1N0YXJ0XCJcbiAgICAgICAgW2NsYXNzLmNhbC1hZnRlci1ob3VyLXN0YXJ0XT1cIiFzZWdtZW50LmlzU3RhcnRcIlxuICAgICAgICBbbmdDbGFzc109XCJzZWdtZW50LmNzc0NsYXNzXCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhbC10aW1lXCIgKm5nSWY9XCJpc1RpbWVMYWJlbFwiIFtzdHlsZS5oZWlnaHQucHhdPVwic2VnbWVudEhlaWdodCAqIDJcIj5cbiAgICAgICAgICB7e1xuICAgICAgICAgICAgc2VnbWVudC5kaXNwbGF5RGF0ZVxuICAgICAgICAgICAgICB8IGNhbGVuZGFyRGF0ZVxuICAgICAgICAgICAgICAgIDogKGRheXNJbldlZWsgPT09IDEgPyAnZGF5Vmlld0hvdXInIDogJ3dlZWtWaWV3SG91cicpXG4gICAgICAgICAgICAgICAgOiBsb2NhbGVcbiAgICAgICAgICB9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgc2VnbWVudDogc2VnbWVudCxcbiAgICAgICAgbG9jYWxlOiBsb2NhbGUsXG4gICAgICAgIHNlZ21lbnRIZWlnaHQ6IHNlZ21lbnRIZWlnaHQsXG4gICAgICAgIGlzVGltZUxhYmVsOiBpc1RpbWVMYWJlbCxcbiAgICAgICAgZGF5c0luV2VlazogZGF5c0luV2Vla1xuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyV2Vla1ZpZXdIb3VyU2VnbWVudENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIHNlZ21lbnQ6IE1DV2Vla1ZpZXdIb3VyU2VnbWVudDtcblxuICBASW5wdXQoKSBzZWdtZW50SGVpZ2h0OiBudW1iZXI7XG5cbiAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaXNUaW1lTGFiZWw6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgZGF5c0luV2VlazogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xufVxuIl19