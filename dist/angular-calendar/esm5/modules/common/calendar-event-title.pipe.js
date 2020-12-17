import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { CalendarEventTitleFormatter } from './calendar-event-title-formatter.provider';
var CalendarEventTitlePipe = /** @class */ (function () {
    function CalendarEventTitlePipe(calendarEventTitle) {
        this.calendarEventTitle = calendarEventTitle;
    }
    CalendarEventTitlePipe.prototype.transform = function (title, titleType, event) {
        return this.calendarEventTitle[titleType](event, title);
    };
    CalendarEventTitlePipe.ctorParameters = function () { return [
        { type: CalendarEventTitleFormatter }
    ]; };
    CalendarEventTitlePipe = __decorate([
        Pipe({
            name: 'calendarEventTitle',
        }),
        __metadata("design:paramtypes", [CalendarEventTitleFormatter])
    ], CalendarEventTitlePipe);
    return CalendarEventTitlePipe;
}());
export { CalendarEventTitlePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZXZlbnQtdGl0bGUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2FsZW5kYXIvIiwic291cmNlcyI6WyJtb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1ldmVudC10aXRsZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUVwRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUt4RjtJQUNFLGdDQUFvQixrQkFBK0M7UUFBL0MsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUE2QjtJQUFJLENBQUM7SUFFeEUsMENBQVMsR0FBVCxVQUFVLEtBQWEsRUFBRSxTQUFpQixFQUFFLEtBQWM7UUFDeEQsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7O2dCQUp1QywyQkFBMkI7O0lBRHhELHNCQUFzQjtRQUhsQyxJQUFJLENBQUM7WUFDSixJQUFJLEVBQUUsb0JBQW9CO1NBQzNCLENBQUM7eUNBRXdDLDJCQUEyQjtPQUR4RCxzQkFBc0IsQ0FNbEM7SUFBRCw2QkFBQztDQUFBLEFBTkQsSUFNQztTQU5ZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1DRXZlbnQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudFRpdGxlRm9ybWF0dGVyIH0gZnJvbSAnLi9jYWxlbmRhci1ldmVudC10aXRsZS1mb3JtYXR0ZXIucHJvdmlkZXInO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdjYWxlbmRhckV2ZW50VGl0bGUnLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckV2ZW50VGl0bGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FsZW5kYXJFdmVudFRpdGxlOiBDYWxlbmRhckV2ZW50VGl0bGVGb3JtYXR0ZXIpIHsgfVxuXG4gIHRyYW5zZm9ybSh0aXRsZTogc3RyaW5nLCB0aXRsZVR5cGU6IHN0cmluZywgZXZlbnQ6IE1DRXZlbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNhbGVuZGFyRXZlbnRUaXRsZVt0aXRsZVR5cGVdKGV2ZW50LCB0aXRsZSk7XG4gIH1cbn1cbiJdfQ==