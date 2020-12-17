import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef, } from '@angular/core';
var CalendarEventTitleComponent = /** @class */ (function () {
    function CalendarEventTitleComponent() {
        this.quicklinkClick = new EventEmitter();
        this.isLive = false;
    }
    CalendarEventTitleComponent.prototype.ngOnChanges = function () {
        var _this = this;
        setInterval(function () {
            _this.isLive =
                _this.event.videoURL &&
                    new Date() >= _this.event.start &&
                    new Date() < _this.event.end;
        }, 60);
    };
    CalendarEventTitleComponent.prototype.navigateToLiveStream = function () {
        this.quicklinkClick.emit(this.event.videoURL);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], CalendarEventTitleComponent.prototype, "event", void 0);
    __decorate([
        Input(),
        __metadata("design:type", TemplateRef)
    ], CalendarEventTitleComponent.prototype, "customTemplate", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], CalendarEventTitleComponent.prototype, "view", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], CalendarEventTitleComponent.prototype, "quicklinkClick", void 0);
    CalendarEventTitleComponent = __decorate([
        Component({
            selector: 'mwl-calendar-event-title',
            template: "\n    <ng-template #defaultTemplate let-event=\"event\" let-view=\"view\">\n      <div class=\"cal-event-arrow\">\n        <svg\n          xmlns=\"http://www.w3.org/2000/svg\"\n          height=\"24\"\n          viewBox=\"0 0 24 24\"\n          width=\"24\"\n        >\n          <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n          <path d=\"M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z\" />\n        </svg>\n      </div>\n      <span\n        class=\"cal-event-title\"\n        [innerHTML]=\"event.title | calendarEventTitle: view:event\"\n        [attr.aria-hidden]=\"{} | calendarA11y: 'hideEventTitle'\"\n      >\n      </span>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        event: event,\n        view: view\n      }\"\n    >\n    </ng-template>\n  "
        })
    ], CalendarEventTitleComponent);
    return CalendarEventTitleComponent;
}());
export { CalendarEventTitleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpdGxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFtQ3ZCO0lBQUE7UUFRRSxtQkFBYyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBRWxFLFdBQU0sR0FBRyxLQUFLLENBQUM7SUFjakIsQ0FBQztJQVpDLGlEQUFXLEdBQVg7UUFBQSxpQkFPQztRQU5DLFdBQVcsQ0FBQztZQUNWLEtBQUksQ0FBQyxNQUFNO2dCQUNULEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtvQkFDbkIsSUFBSSxJQUFJLEVBQUUsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7b0JBQzlCLElBQUksSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDaEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELDBEQUFvQixHQUFwQjtRQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQXRCUTtRQUFSLEtBQUssRUFBRTs7OERBQWdCO0lBRWY7UUFBUixLQUFLLEVBQUU7a0NBQWlCLFdBQVc7dUVBQU07SUFFakM7UUFBUixLQUFLLEVBQUU7OzZEQUFjO0lBR3RCO1FBREMsTUFBTSxFQUFFO2tDQUNPLFlBQVk7dUVBQXNDO0lBUnZELDJCQUEyQjtRQWhDdkMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLDBCQUEwQjtZQUNwQyxRQUFRLEVBQUUsdTJCQTRCVDtTQUNGLENBQUM7T0FDVywyQkFBMkIsQ0F3QnZDO0lBQUQsa0NBQUM7Q0FBQSxBQXhCRCxJQXdCQztTQXhCWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQ0V2ZW50IH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL21jLWNhbGVuZGFyLXV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZSBsZXQtZXZlbnQ9XCJldmVudFwiIGxldC12aWV3PVwidmlld1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbC1ldmVudC1hcnJvd1wiPlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgaGVpZ2h0PVwiMjRcIlxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgIHdpZHRoPVwiMjRcIlxuICAgICAgICA+XG4gICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMFYwelwiIGZpbGw9XCJub25lXCIgLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTguNTkgMTYuNTlMMTMuMTcgMTIgOC41OSA3LjQxIDEwIDZsNiA2LTYgNi0xLjQxLTEuNDF6XCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzPVwiY2FsLWV2ZW50LXRpdGxlXCJcbiAgICAgICAgW2lubmVySFRNTF09XCJldmVudC50aXRsZSB8IGNhbGVuZGFyRXZlbnRUaXRsZTogdmlldzpldmVudFwiXG4gICAgICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cInt9IHwgY2FsZW5kYXJBMTF5OiAnaGlkZUV2ZW50VGl0bGUnXCJcbiAgICAgID5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgdmlldzogdmlld1xuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyRXZlbnRUaXRsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGV2ZW50OiBNQ0V2ZW50O1xuXG4gIEBJbnB1dCgpIGN1c3RvbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIHZpZXc6IHN0cmluZztcblxuICBAT3V0cHV0KClcbiAgcXVpY2tsaW5rQ2xpY2s6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgaXNMaXZlID0gZmFsc2U7XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5pc0xpdmUgPVxuICAgICAgICB0aGlzLmV2ZW50LnZpZGVvVVJMICYmXG4gICAgICAgIG5ldyBEYXRlKCkgPj0gdGhpcy5ldmVudC5zdGFydCAmJlxuICAgICAgICBuZXcgRGF0ZSgpIDwgdGhpcy5ldmVudC5lbmQ7XG4gICAgfSwgNjApO1xuICB9XG5cbiAgbmF2aWdhdGVUb0xpdmVTdHJlYW0oKSB7XG4gICAgdGhpcy5xdWlja2xpbmtDbGljay5lbWl0KHRoaXMuZXZlbnQudmlkZW9VUkwpO1xuICB9XG59XG4iXX0=