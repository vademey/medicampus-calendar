import { __decorate, __metadata } from "tslib";
import { Component, Input, NgZone, OnChanges, SimpleChanges, TemplateRef, } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMapTo, startWith, map, switchMap } from 'rxjs/operators';
import { DateAdapter } from '../../date-adapters/date-adapter';
let CalendarWeekViewCurrentTimeMarkerComponent = class CalendarWeekViewCurrentTimeMarkerComponent {
    constructor(dateAdapter, zone) {
        this.dateAdapter = dateAdapter;
        this.zone = zone;
        this.columnDate$ = new BehaviorSubject(this.columnDate);
        this.marker$ = this.zone.onStable.pipe(switchMap(() => interval(60 * 1000)), startWith(0), switchMapTo(this.columnDate$), map((columnDate) => {
            const startOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayStartHour), this.dayStartMinute);
            const endOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayEndHour), this.dayEndMinute);
            const hourHeightModifier = (this.hourSegments * this.hourSegmentHeight) / 60;
            const now = new Date();
            return {
                isVisible: this.dateAdapter.isSameDay(columnDate, now) &&
                    now >= startOfDay &&
                    now <= endOfDay,
                top: this.dateAdapter.differenceInMinutes(now, startOfDay) *
                    hourHeightModifier,
            };
        }));
    }
    ngOnChanges(changes) {
        if (changes.columnDate) {
            this.columnDate$.next(changes.columnDate.currentValue);
        }
    }
};
CalendarWeekViewCurrentTimeMarkerComponent.ctorParameters = () => [
    { type: DateAdapter },
    { type: NgZone }
];
__decorate([
    Input(),
    __metadata("design:type", Date)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "columnDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayStartHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayStartMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayEndHour", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "dayEndMinute", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "hourSegments", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "hourSegmentHeight", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarWeekViewCurrentTimeMarkerComponent.prototype, "customTemplate", void 0);
CalendarWeekViewCurrentTimeMarkerComponent = __decorate([
    Component({
        selector: 'mwl-calendar-week-view-current-time-marker',
        template: `
    <ng-template
      #defaultTemplate
      let-columnDate="columnDate"
      let-dayStartHour="dayStartHour"
      let-dayStartMinute="dayStartMinute"
      let-dayEndHour="dayEndHour"
      let-dayEndMinute="dayEndMinute"
      let-isVisible="isVisible"
      let-topPx="topPx"
    >
      <div
        class="cal-current-time-marker"
        *ngIf="isVisible"
        [style.top.px]="topPx"
      >
        <div style="position: absolute;height: 18px;width: 18px;top: -8px;left: -6px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px" style="fill: red;">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        columnDate: columnDate,
        dayStartHour: dayStartHour,
        dayStartMinute: dayStartMinute,
        dayEndHour: dayEndHour,
        dayEndMinute: dayEndMinute,
        isVisible: (marker$ | async)?.isVisible,
        topPx: (marker$ | async)?.top
      }"
    >
    </ng-template>
  `
    }),
    __metadata("design:paramtypes", [DateAdapter, NgZone])
], CalendarWeekViewCurrentTimeMarkerComponent);
export { CalendarWeekViewCurrentTimeMarkerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWN1cnJlbnQtdGltZS1tYXJrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvd2Vlay9jYWxlbmRhci13ZWVrLXZpZXctY3VycmVudC10aW1lLW1hcmtlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsYUFBYSxFQUNiLFdBQVcsR0FDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUM3RCxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBMkMvRCxJQUFhLDBDQUEwQyxHQUF2RCxNQUFhLDBDQUEwQztJQWtEckQsWUFBb0IsV0FBd0IsRUFBVSxJQUFZO1FBQTlDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQWpDbEUsZ0JBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFekQsWUFBTyxHQUdGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FDMUIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDcEMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUNaLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQzdCLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUN4RCxJQUFJLENBQUMsY0FBYyxDQUNwQixDQUFDO1lBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3RELElBQUksQ0FBQyxZQUFZLENBQ2xCLENBQUM7WUFDRixNQUFNLGtCQUFrQixHQUN0QixDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3BELE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkIsT0FBTztnQkFDTCxTQUFTLEVBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztvQkFDM0MsR0FBRyxJQUFJLFVBQVU7b0JBQ2pCLEdBQUcsSUFBSSxRQUFRO2dCQUNqQixHQUFHLEVBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDO29CQUNyRCxrQkFBa0I7YUFDckIsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUNILENBQUM7SUFFb0UsQ0FBQztJQUV2RSxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0NBQ0YsQ0FBQTs7WUFQa0MsV0FBVztZQUFnQixNQUFNOztBQWpEekQ7SUFBUixLQUFLLEVBQUU7OEJBQWEsSUFBSTs4RUFBQztBQUVqQjtJQUFSLEtBQUssRUFBRTs7Z0ZBQXNCO0FBRXJCO0lBQVIsS0FBSyxFQUFFOztrRkFBd0I7QUFFdkI7SUFBUixLQUFLLEVBQUU7OzhFQUFvQjtBQUVuQjtJQUFSLEtBQUssRUFBRTs7Z0ZBQXNCO0FBRXJCO0lBQVIsS0FBSyxFQUFFOztnRkFBc0I7QUFFckI7SUFBUixLQUFLLEVBQUU7O3FGQUEyQjtBQUUxQjtJQUFSLEtBQUssRUFBRTs4QkFBaUIsV0FBVztrRkFBTTtBQWYvQiwwQ0FBMEM7SUF6Q3RELFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSw0Q0FBNEM7UUFDdEQsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUNUO0tBQ0YsQ0FBQztxQ0FtRGlDLFdBQVcsRUFBZ0IsTUFBTTtHQWxEdkQsMENBQTBDLENBeUR0RDtTQXpEWSwwQ0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBpbnRlcnZhbCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwVG8sIHN0YXJ0V2l0aCwgbWFwLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLXdlZWstdmlldy1jdXJyZW50LXRpbWUtbWFya2VyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC1jb2x1bW5EYXRlPVwiY29sdW1uRGF0ZVwiXG4gICAgICBsZXQtZGF5U3RhcnRIb3VyPVwiZGF5U3RhcnRIb3VyXCJcbiAgICAgIGxldC1kYXlTdGFydE1pbnV0ZT1cImRheVN0YXJ0TWludXRlXCJcbiAgICAgIGxldC1kYXlFbmRIb3VyPVwiZGF5RW5kSG91clwiXG4gICAgICBsZXQtZGF5RW5kTWludXRlPVwiZGF5RW5kTWludXRlXCJcbiAgICAgIGxldC1pc1Zpc2libGU9XCJpc1Zpc2libGVcIlxuICAgICAgbGV0LXRvcFB4PVwidG9wUHhcIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtY3VycmVudC10aW1lLW1hcmtlclwiXG4gICAgICAgICpuZ0lmPVwiaXNWaXNpYmxlXCJcbiAgICAgICAgW3N0eWxlLnRvcC5weF09XCJ0b3BQeFwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7aGVpZ2h0OiAxOHB4O3dpZHRoOiAxOHB4O3RvcDogLThweDtsZWZ0OiAtNnB4O1wiPlxuICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjE4cHhcIiBoZWlnaHQ9XCIxOHB4XCIgc3R5bGU9XCJmaWxsOiByZWQ7XCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCI+PC9wYXRoPlxuICAgICAgICAgICAgPHBhdGggZD1cIk04IDV2MTRsMTEtN3pcIj48L3BhdGg+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBjb2x1bW5EYXRlOiBjb2x1bW5EYXRlLFxuICAgICAgICBkYXlTdGFydEhvdXI6IGRheVN0YXJ0SG91cixcbiAgICAgICAgZGF5U3RhcnRNaW51dGU6IGRheVN0YXJ0TWludXRlLFxuICAgICAgICBkYXlFbmRIb3VyOiBkYXlFbmRIb3VyLFxuICAgICAgICBkYXlFbmRNaW51dGU6IGRheUVuZE1pbnV0ZSxcbiAgICAgICAgaXNWaXNpYmxlOiAobWFya2VyJCB8IGFzeW5jKT8uaXNWaXNpYmxlLFxuICAgICAgICB0b3BQeDogKG1hcmtlciQgfCBhc3luYyk/LnRvcFxuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyV2Vla1ZpZXdDdXJyZW50VGltZU1hcmtlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGNvbHVtbkRhdGU6IERhdGU7XG5cbiAgQElucHV0KCkgZGF5U3RhcnRIb3VyOiBudW1iZXI7XG5cbiAgQElucHV0KCkgZGF5U3RhcnRNaW51dGU6IG51bWJlcjtcblxuICBASW5wdXQoKSBkYXlFbmRIb3VyOiBudW1iZXI7XG5cbiAgQElucHV0KCkgZGF5RW5kTWludXRlOiBudW1iZXI7XG5cbiAgQElucHV0KCkgaG91clNlZ21lbnRzOiBudW1iZXI7XG5cbiAgQElucHV0KCkgaG91clNlZ21lbnRIZWlnaHQ6IG51bWJlcjtcblxuICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb2x1bW5EYXRlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8RGF0ZT4odGhpcy5jb2x1bW5EYXRlKTtcblxuICBtYXJrZXIkOiBPYnNlcnZhYmxlPHtcbiAgICBpc1Zpc2libGU6IGJvb2xlYW47XG4gICAgdG9wOiBudW1iZXI7XG4gIH0+ID0gdGhpcy56b25lLm9uU3RhYmxlLnBpcGUoXG4gICAgc3dpdGNoTWFwKCgpID0+IGludGVydmFsKDYwICogMTAwMCkpLFxuICAgIHN0YXJ0V2l0aCgwKSxcbiAgICBzd2l0Y2hNYXBUbyh0aGlzLmNvbHVtbkRhdGUkKSxcbiAgICBtYXAoKGNvbHVtbkRhdGUpID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0T2ZEYXkgPSB0aGlzLmRhdGVBZGFwdGVyLnNldE1pbnV0ZXMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIuc2V0SG91cnMoY29sdW1uRGF0ZSwgdGhpcy5kYXlTdGFydEhvdXIpLFxuICAgICAgICB0aGlzLmRheVN0YXJ0TWludXRlXG4gICAgICApO1xuICAgICAgY29uc3QgZW5kT2ZEYXkgPSB0aGlzLmRhdGVBZGFwdGVyLnNldE1pbnV0ZXMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIuc2V0SG91cnMoY29sdW1uRGF0ZSwgdGhpcy5kYXlFbmRIb3VyKSxcbiAgICAgICAgdGhpcy5kYXlFbmRNaW51dGVcbiAgICAgICk7XG4gICAgICBjb25zdCBob3VySGVpZ2h0TW9kaWZpZXIgPVxuICAgICAgICAodGhpcy5ob3VyU2VnbWVudHMgKiB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0KSAvIDYwO1xuICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmlzaWJsZTpcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLmlzU2FtZURheShjb2x1bW5EYXRlLCBub3cpICYmXG4gICAgICAgICAgbm93ID49IHN0YXJ0T2ZEYXkgJiZcbiAgICAgICAgICBub3cgPD0gZW5kT2ZEYXksXG4gICAgICAgIHRvcDpcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLmRpZmZlcmVuY2VJbk1pbnV0ZXMobm93LCBzdGFydE9mRGF5KSAqXG4gICAgICAgICAgaG91ckhlaWdodE1vZGlmaWVyLFxuICAgICAgfTtcbiAgICB9KVxuICApO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLCBwcml2YXRlIHpvbmU6IE5nWm9uZSkgeyB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmNvbHVtbkRhdGUpIHtcbiAgICAgIHRoaXMuY29sdW1uRGF0ZSQubmV4dChjaGFuZ2VzLmNvbHVtbkRhdGUuY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==