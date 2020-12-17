import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, TemplateRef, } from '@angular/core';
let CalendarEventTitleComponent = class CalendarEventTitleComponent {
    constructor() {
        this.quicklinkClick = new EventEmitter();
        this.isLive = false;
    }
    ngOnChanges() {
        setInterval(() => {
            this.isLive =
                this.event.videoURL &&
                    new Date() >= this.event.start &&
                    new Date() < this.event.end;
        }, 60);
    }
    navigateToLiveStream() {
        this.quicklinkClick.emit(this.event.videoURL);
    }
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
        template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
      <div class="cal-event-arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </div>
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle: view:event"
        [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'"
      >
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }"
    >
    </ng-template>
  `
    })
], CalendarEventTitleComponent);
export { CalendarEventTitleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jYWxlbmRhci8iLCJzb3VyY2VzIjpbIm1vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpdGxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFtQ3ZCLElBQWEsMkJBQTJCLEdBQXhDLE1BQWEsMkJBQTJCO0lBQXhDO1FBUUUsbUJBQWMsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUVsRSxXQUFNLEdBQUcsS0FBSyxDQUFDO0lBY2pCLENBQUM7SUFaQyxXQUFXO1FBQ1QsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNO2dCQUNULElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtvQkFDbkIsSUFBSSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7b0JBQzlCLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDaEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FDRixDQUFBO0FBdkJVO0lBQVIsS0FBSyxFQUFFOzswREFBZ0I7QUFFZjtJQUFSLEtBQUssRUFBRTs4QkFBaUIsV0FBVzttRUFBTTtBQUVqQztJQUFSLEtBQUssRUFBRTs7eURBQWM7QUFHdEI7SUFEQyxNQUFNLEVBQUU7OEJBQ08sWUFBWTttRUFBc0M7QUFSdkQsMkJBQTJCO0lBaEN2QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsMEJBQTBCO1FBQ3BDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCVDtLQUNGLENBQUM7R0FDVywyQkFBMkIsQ0F3QnZDO1NBeEJZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1DRXZlbnQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItZXZlbnQtdGl0bGUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlIGxldC1ldmVudD1cImV2ZW50XCIgbGV0LXZpZXc9XCJ2aWV3XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2FsLWV2ZW50LWFycm93XCI+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICBoZWlnaHQ9XCIyNFwiXG4gICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgd2lkdGg9XCIyNFwiXG4gICAgICAgID5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIiAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNOC41OSAxNi41OUwxMy4xNyAxMiA4LjU5IDcuNDEgMTAgNmw2IDYtNiA2LTEuNDEtMS40MXpcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgICAgPHNwYW5cbiAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnQtdGl0bGVcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cImV2ZW50LnRpdGxlIHwgY2FsZW5kYXJFdmVudFRpdGxlOiB2aWV3OmV2ZW50XCJcbiAgICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwie30gfCBjYWxlbmRhckExMXk6ICdoaWRlRXZlbnRUaXRsZSdcIlxuICAgICAgPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICB2aWV3OiB2aWV3XG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJFdmVudFRpdGxlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgZXZlbnQ6IE1DRXZlbnQ7XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgdmlldzogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKVxuICBxdWlja2xpbmtDbGljazogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBpc0xpdmUgPSBmYWxzZTtcblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB0aGlzLmlzTGl2ZSA9XG4gICAgICAgIHRoaXMuZXZlbnQudmlkZW9VUkwgJiZcbiAgICAgICAgbmV3IERhdGUoKSA+PSB0aGlzLmV2ZW50LnN0YXJ0ICYmXG4gICAgICAgIG5ldyBEYXRlKCkgPCB0aGlzLmV2ZW50LmVuZDtcbiAgICB9LCA2MCk7XG4gIH1cblxuICBuYXZpZ2F0ZVRvTGl2ZVN0cmVhbSgpIHtcbiAgICB0aGlzLnF1aWNrbGlua0NsaWNrLmVtaXQodGhpcy5ldmVudC52aWRlb1VSTCk7XG4gIH1cbn1cbiJdfQ==