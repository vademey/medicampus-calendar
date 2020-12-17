import { __decorate, __metadata } from "tslib";
import { Component, Input, TemplateRef } from '@angular/core';
let CalendarWeekViewHourSegmentComponent = class CalendarWeekViewHourSegmentComponent {
};
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
        template: `
    <ng-template
      #defaultTemplate
      let-segment="segment"
      let-locale="locale"
      let-segmentHeight="segmentHeight"
      let-isTimeLabel="isTimeLabel"
      let-daysInWeek="daysInWeek"
    >
      <div
        [attr.aria-hidden]="
          {}
            | calendarA11y
              : (daysInWeek === 1
                  ? 'hideDayHourSegment'
                  : 'hideWeekHourSegment')
        "
        class="cal-hour-segment"
        [style.height.px]="segmentHeight"
        [class.cal-hour-start]="segment.isStart"
        [class.cal-after-hour-start]="!segment.isStart"
        [ngClass]="segment.cssClass"
      >
        <div class="cal-time" *ngIf="isTimeLabel" [style.height.px]="segmentHeight * 2">
          {{
            segment.displayDate
              | calendarDate
                : (daysInWeek === 1 ? 'dayViewHour' : 'weekViewHour')
                : locale
          }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        segment: segment,
        locale: locale,
        segmentHeight: segmentHeight,
        isTimeLabel: isTimeLabel,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `
    })
], CalendarWeekViewHourSegmentComponent);
export { CalendarWeekViewHourSegmentComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFtRDlELElBQWEsb0NBQW9DLEdBQWpELE1BQWEsb0NBQW9DO0NBWWhELENBQUE7QUFYVTtJQUFSLEtBQUssRUFBRTs7cUVBQWdDO0FBRS9CO0lBQVIsS0FBSyxFQUFFOzsyRUFBdUI7QUFFdEI7SUFBUixLQUFLLEVBQUU7O29FQUFnQjtBQUVmO0lBQVIsS0FBSyxFQUFFOzt5RUFBc0I7QUFFckI7SUFBUixLQUFLLEVBQUU7O3dFQUFvQjtBQUVuQjtJQUFSLEtBQUssRUFBRTs4QkFBaUIsV0FBVzs0RUFBTTtBQVgvQixvQ0FBb0M7SUFoRGhELFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxxQ0FBcUM7UUFDL0MsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDVDtLQUNGLENBQUM7R0FDVyxvQ0FBb0MsQ0FZaEQ7U0FaWSxvQ0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUNXZWVrVmlld0hvdXJTZWdtZW50IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LXNlZ21lbnQ9XCJzZWdtZW50XCJcbiAgICAgIGxldC1sb2NhbGU9XCJsb2NhbGVcIlxuICAgICAgbGV0LXNlZ21lbnRIZWlnaHQ9XCJzZWdtZW50SGVpZ2h0XCJcbiAgICAgIGxldC1pc1RpbWVMYWJlbD1cImlzVGltZUxhYmVsXCJcbiAgICAgIGxldC1kYXlzSW5XZWVrPVwiZGF5c0luV2Vla1wiXG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBbYXR0ci5hcmlhLWhpZGRlbl09XCJcbiAgICAgICAgICB7fVxuICAgICAgICAgICAgfCBjYWxlbmRhckExMXlcbiAgICAgICAgICAgICAgOiAoZGF5c0luV2VlayA9PT0gMVxuICAgICAgICAgICAgICAgICAgPyAnaGlkZURheUhvdXJTZWdtZW50J1xuICAgICAgICAgICAgICAgICAgOiAnaGlkZVdlZWtIb3VyU2VnbWVudCcpXG4gICAgICAgIFwiXG4gICAgICAgIGNsYXNzPVwiY2FsLWhvdXItc2VnbWVudFwiXG4gICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwic2VnbWVudEhlaWdodFwiXG4gICAgICAgIFtjbGFzcy5jYWwtaG91ci1zdGFydF09XCJzZWdtZW50LmlzU3RhcnRcIlxuICAgICAgICBbY2xhc3MuY2FsLWFmdGVyLWhvdXItc3RhcnRdPVwiIXNlZ21lbnQuaXNTdGFydFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInNlZ21lbnQuY3NzQ2xhc3NcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXRpbWVcIiAqbmdJZj1cImlzVGltZUxhYmVsXCIgW3N0eWxlLmhlaWdodC5weF09XCJzZWdtZW50SGVpZ2h0ICogMlwiPlxuICAgICAgICAgIHt7XG4gICAgICAgICAgICBzZWdtZW50LmRpc3BsYXlEYXRlXG4gICAgICAgICAgICAgIHwgY2FsZW5kYXJEYXRlXG4gICAgICAgICAgICAgICAgOiAoZGF5c0luV2VlayA9PT0gMSA/ICdkYXlWaWV3SG91cicgOiAnd2Vla1ZpZXdIb3VyJylcbiAgICAgICAgICAgICAgICA6IGxvY2FsZVxuICAgICAgICAgIH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBzZWdtZW50OiBzZWdtZW50LFxuICAgICAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICAgICAgc2VnbWVudEhlaWdodDogc2VnbWVudEhlaWdodCxcbiAgICAgICAgaXNUaW1lTGFiZWw6IGlzVGltZUxhYmVsLFxuICAgICAgICBkYXlzSW5XZWVrOiBkYXlzSW5XZWVrXG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJXZWVrVmlld0hvdXJTZWdtZW50Q29tcG9uZW50IHtcbiAgQElucHV0KCkgc2VnbWVudDogTUNXZWVrVmlld0hvdXJTZWdtZW50O1xuXG4gIEBJbnB1dCgpIHNlZ21lbnRIZWlnaHQ6IG51bWJlcjtcblxuICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcblxuICBASW5wdXQoKSBpc1RpbWVMYWJlbDogYm9vbGVhbjtcblxuICBASW5wdXQoKSBkYXlzSW5XZWVrOiBudW1iZXI7XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG59XG4iXX0=