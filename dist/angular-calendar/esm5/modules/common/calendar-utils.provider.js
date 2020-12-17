import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { getMonthView, getWeekView, getWeekViewHeader } from '../../utilities/mc-calendar-utils';
import { DateAdapter } from '../../date-adapters/date-adapter';
var CalendarUtils = /** @class */ (function () {
    function CalendarUtils(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    CalendarUtils.prototype.getMonthView = function (args) {
        return getMonthView(this.dateAdapter, args);
    };
    CalendarUtils.prototype.getWeekViewHeader = function (args) {
        return getWeekViewHeader(this.dateAdapter, args);
    };
    CalendarUtils.prototype.getWeekView = function (args) {
        return getWeekView(this.dateAdapter, args);
    };
    CalendarUtils.ctorParameters = function () { return [
        { type: DateAdapter }
    ]; };
    CalendarUtils = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DateAdapter])
    ], CalendarUtils);
    return CalendarUtils;
}());
export { CalendarUtils };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdXRpbHMucHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy9jb21tb24vY2FsZW5kYXItdXRpbHMucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQXNHLE1BQU0sbUNBQW1DLENBQUM7QUFDck0sT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRy9EO0lBQ0UsdUJBQXNCLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQUksQ0FBQztJQUVuRCxvQ0FBWSxHQUFaLFVBQWEsSUFBd0I7UUFDbkMsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQseUNBQWlCLEdBQWpCLFVBQWtCLElBQTZCO1FBQzdDLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsbUNBQVcsR0FBWCxVQUFZLElBQXVCO1FBQ2pDLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7Z0JBWmtDLFdBQVc7O0lBRG5DLGFBQWE7UUFEekIsVUFBVSxFQUFFO3lDQUV3QixXQUFXO09BRG5DLGFBQWEsQ0FjekI7SUFBRCxvQkFBQztDQUFBLEFBZEQsSUFjQztTQWRZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBnZXRNb250aFZpZXcsIGdldFdlZWtWaWV3LCBnZXRXZWVrVmlld0hlYWRlciwgTUNHZXRNb250aFZpZXdBcmdzLCBNQ0dldFdlZWtWaWV3QXJncywgTUNHZXRXZWVrVmlld0hlYWRlckFyZ3MsIE1DTW9udGhWaWV3LCBNQ1dlZWtEYXksIE1DV2Vla1ZpZXcgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclV0aWxzIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcikgeyB9XG5cbiAgZ2V0TW9udGhWaWV3KGFyZ3M6IE1DR2V0TW9udGhWaWV3QXJncyk6IE1DTW9udGhWaWV3IHtcbiAgICByZXR1cm4gZ2V0TW9udGhWaWV3KHRoaXMuZGF0ZUFkYXB0ZXIsIGFyZ3MpO1xuICB9XG5cbiAgZ2V0V2Vla1ZpZXdIZWFkZXIoYXJnczogTUNHZXRXZWVrVmlld0hlYWRlckFyZ3MpOiBNQ1dlZWtEYXlbXSB7XG4gICAgcmV0dXJuIGdldFdlZWtWaWV3SGVhZGVyKHRoaXMuZGF0ZUFkYXB0ZXIsIGFyZ3MpO1xuICB9XG5cbiAgZ2V0V2Vla1ZpZXcoYXJnczogTUNHZXRXZWVrVmlld0FyZ3MpOiBNQ1dlZWtWaWV3IHtcbiAgICByZXR1cm4gZ2V0V2Vla1ZpZXcodGhpcy5kYXRlQWRhcHRlciwgYXJncyk7XG4gIH1cbn1cbiJdfQ==