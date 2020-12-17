import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { getMonthView, getWeekView, getWeekViewHeader } from '../../utilities/mc-calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';
let CalendarUtils = class CalendarUtils {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    getMonthView(args) {
        return getMonthView(this.dateAdapter, args);
    }
    getWeekViewHeader(args) {
        return getWeekViewHeader(this.dateAdapter, args);
    }
    getWeekView(args) {
        return getWeekView(this.dateAdapter, args);
    }
};
CalendarUtils.ctorParameters = () => [
    { type: DateAdapter }
];
CalendarUtils = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DateAdapter])
], CalendarUtils);
export { CalendarUtils };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdXRpbHMucHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy9jb21tb24vY2FsZW5kYXItdXRpbHMucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQXNHLE1BQU0sbUNBQW1DLENBQUM7QUFDck0sT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRy9ELElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7SUFDeEIsWUFBc0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFBSSxDQUFDO0lBRW5ELFlBQVksQ0FBQyxJQUF3QjtRQUNuQyxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxJQUE2QjtRQUM3QyxPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUF1QjtRQUNqQyxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDRixDQUFBOztZQWJvQyxXQUFXOztBQURuQyxhQUFhO0lBRHpCLFVBQVUsRUFBRTtxQ0FFd0IsV0FBVztHQURuQyxhQUFhLENBY3pCO1NBZFksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGdldE1vbnRoVmlldywgZ2V0V2Vla1ZpZXcsIGdldFdlZWtWaWV3SGVhZGVyLCBNQ0dldE1vbnRoVmlld0FyZ3MsIE1DR2V0V2Vla1ZpZXdBcmdzLCBNQ0dldFdlZWtWaWV3SGVhZGVyQXJncywgTUNNb250aFZpZXcsIE1DV2Vla0RheSwgTUNXZWVrVmlldyB9IGZyb20gJy4uLy4uL3V0aWxpdGllcy9tYy1jYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyVXRpbHMge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyKSB7IH1cblxuICBnZXRNb250aFZpZXcoYXJnczogTUNHZXRNb250aFZpZXdBcmdzKTogTUNNb250aFZpZXcge1xuICAgIHJldHVybiBnZXRNb250aFZpZXcodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cblxuICBnZXRXZWVrVmlld0hlYWRlcihhcmdzOiBNQ0dldFdlZWtWaWV3SGVhZGVyQXJncyk6IE1DV2Vla0RheVtdIHtcbiAgICByZXR1cm4gZ2V0V2Vla1ZpZXdIZWFkZXIodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cblxuICBnZXRXZWVrVmlldyhhcmdzOiBNQ0dldFdlZWtWaWV3QXJncyk6IE1DV2Vla1ZpZXcge1xuICAgIHJldHVybiBnZXRXZWVrVmlldyh0aGlzLmRhdGVBZGFwdGVyLCBhcmdzKTtcbiAgfVxufVxuIl19