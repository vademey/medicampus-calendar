import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
var QuicklinksComponent = /** @class */ (function () {
    function QuicklinksComponent() {
        this.quicklinkClick = new EventEmitter();
        this.isLive = false;
    }
    QuicklinksComponent.prototype.ngOnChanges = function () {
        var _this = this;
        setInterval(function () {
            _this.isLive =
                _this.event.videoURL &&
                    new Date() >= _this.event.start &&
                    new Date() < _this.event.end;
        }, 60);
    };
    QuicklinksComponent.prototype.navigateToLink = function (link) {
        this.quicklinkClick.emit(link);
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], QuicklinksComponent.prototype, "event", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], QuicklinksComponent.prototype, "quicklinkClick", void 0);
    QuicklinksComponent = __decorate([
        Component({
            selector: 'mwl-mc-quicklinks',
            template: "<div class=\"mc-quicklink\" (click)=\"\n    event.lesson.hasLearningMaterial && event.lesson.iliasURL &&\n      navigateToLink('ref_id=' + event.lesson.iliasURL)\n  \">\n  <svg [ngStyle]=\"{\n      fill: (event.lesson.hasLearningMaterial && event.lesson.iliasURL ? event.color?.primary : 'gray'),\n      opacity: (event.lesson.hasLearningMaterial && event.lesson.iliasURL ? '1' : '0.8')\n    }\" xmlns=\"http://www.w3.org/2000/svg\" enable-background=\"new 0 0 24 24\" viewBox=\"0 0 24 24\" width=\"18px\"\n    height=\"18px\">\n    <path\n      d=\"M17.5,10.5c0.88,0,1.73,0.09,2.5,0.26V9.24C19.21,9.09,18.36,9,17.5,9c-1.7,0-3.24,0.29-4.5,0.83v1.66 C14.13,10.85,15.7,10.5,17.5,10.5z\" />\n    <path\n      d=\"M13,12.49v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26V11.9c-0.79-0.15-1.64-0.24-2.5-0.24 C15.8,11.66,14.26,11.96,13,12.49z\" />\n    <path\n      d=\"M17.5,14.33c-1.7,0-3.24,0.29-4.5,0.83v1.66c1.13-0.64,2.7-0.99,4.5-0.99c0.88,0,1.73,0.09,2.5,0.26v-1.52 C19.21,14.41,18.36,14.33,17.5,14.33z\" />\n    <rect fill=\"none\" height=\"24\" width=\"24\" />\n    <path\n      d=\"M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65 c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5 c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5 c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z\" />\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\">menu_book</mat-icon>-->\n</div>\n\n<!--<div\n  class=\"mc-quicklink\"\n  (click)=\"navigateToLink('../lesson/learning-objectives/43')\"\n>\n  <svg\n    [ngStyle]=\"{ fill: event.color?.primary }\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    viewBox=\"0 0 24 24\"\n    width=\"18px\"\n    height=\"18px\"\n  >\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M12.36 6l.08.39.32 1.61H18v6h-3.36l-.08-.39-.32-1.61H7V6h5.36M14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6L14 4z\"\n    />\n  </svg>-->\n<!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">assistant_photo</mat-icon>-->\n<!--</div>-->\n\n<!--<div class=\"mc-quicklink\" (click)=\"navigateToLink('../performance')\">\n  <svg\n    [ngStyle]=\"{ fill: event.color?.primary }\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    viewBox=\"0 0 24 24\"\n    width=\"18px\"\n    height=\"18px\"\n  >\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z\"\n    />\n  </svg>-->\n<!--<mat-icon [ngStyle]=\"{ 'color': color }\">playlist_add_check</mat-icon>-->\n<!--</div>-->\n\n<div *ngIf=\"event.onSite && !event.online\" class=\"mc-quicklink\"\n  (click)=\"event.room.roomLink && navigateToLink(event.room.roomLink)\">\n  <svg\n    [ngStyle]=\"{ fill: (event.room.roomLink ? event.color?.primary : 'gray'), opacity: (event.room.roomLink ? '1' : '0.8') }\"\n    xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18px\" height=\"18px\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z\" />\n    <circle cx=\"12\" cy=\"9\" r=\"2.5\" />\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">room</mat-icon>-->\n</div>\n<div *ngIf=\"!event.onSite && event.online\" class=\"mc-quicklink\" (click)=\"isLive && navigateToLink(event.videoURL)\">\n  <svg [ngStyle]=\"{\n      fill: isLive ? event.color?.primary : 'gray',\n      opacity: isLive ? '1' : '0.8'\n    }\" xmlns=\"http://www.w3.org/2000/svg\" height=\"18px\" viewBox=\"0 0 24 24\" width=\"18px\">\n    <!--<path\n      d=\"M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z\" />-->\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\"></path>\n    <path\n      d=\"M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z\">\n    </path>\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">ondemand_video</mat-icon>-->\n</div>\n\n<div *ngIf=\"event.onSite && event.online\" class=\"mc-quicklink\"\n  (click)=\"(event.room.roomLink || isLive) && navigateToLink('hybrid')\">\n  <svg\n    [ngStyle]=\"{ fill: ((event.room.roomLink || isLive) ? event.color?.primary : 'gray'), opacity: ((event.room.roomLink || isLive) ? '1' : '0.8') }\"\n    xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"26px\" height=\"26px\" style=\"margin: auto;\">\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" style=\"transform: scale(0.7);\" />\n    <!--<path xmlns=\"http://www.w3.org/2000/svg\"\n      d=\"M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z\"\n      style=\"transform: scale(0.5) translate(24px, 24px);\" />-->\n    <path\n      d=\"M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z\"\n      style=\"transform: scale(0.6) translate(18px, 18px);\"></path>\n    <path\n      d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z\"\n      style=\"transform: scale(0.6);\" />\n    <circle xmlns=\"http://www.w3.org/2000/svg\" cx=\"12\" cy=\"9\" r=\"2.5\" style=\"transform: scale(0.6);\" />\n    <line xmlns=\"http://www.w3.org/2000/svg\" [ngStyle]=\"{ stroke: event.color?.primary }\" x1=\"20\" y1=\"4\" x2=\"4\"\n      y2=\"20\" />\n  </svg>\n  <!--<mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">ondemand_video</mat-icon>-->\n</div>\n\n<!--<div class=\"mc-quicklink\" (click)=\"navigateToLink('lesson/evaluation/43')\">\n  <svg [ngStyle]=\"{ fill: event.color?.primary }\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"18px\"\n    height=\"18px\">\n    <path d=\"M0 0h24v24H0V0zm0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z\" />\n  </svg>\n  <mat-icon [ngStyle]=\"{ 'color': color }\" class=\"material-icons-outlined\">thumb_up</mat-icon>\n</div>-->\n\n<!--<div\n  class=\"mc-quicklink\"\n  (click)=\"navigateToLink('../lesson/event-swapping/43')\"\n>\n  <svg\n    [ngStyle]=\"{ fill: event.color?.primary }\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    viewBox=\"0 0 24 24\"\n    width=\"18px\"\n    height=\"18px\"\n  >\n    <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n    <path\n      d=\"M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z\"\n    />\n  </svg>-->\n<!--<mat-icon [ngStyle]=\"{ 'color': color }\">date_range</mat-icon>-->\n<!--</div>-->\n",
            styles: [":host{display:flex;justify-content:flex-start;flex-wrap:wrap;padding:0 10px 10px}:host .mc-quicklink{box-shadow:0 0 4px 1px #ccc;height:36px;width:36px;background:#f6f6f6;display:flex;margin:5px;border:1px solid transparent}:host .mc-quicklink:hover{opacity:.7}:host .mc-quicklink svg{margin:auto;height:20px;width:20px;font-size:20px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}:host .mc-quicklink svg *{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}"]
        }),
        __metadata("design:paramtypes", [])
    ], QuicklinksComponent);
    return QuicklinksComponent;
}());
export { QuicklinksComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2tsaW5rcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy93ZWVrL3F1aWNrbGlua3MvcXVpY2tsaW5rcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFHTSxNQUFNLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBUXZCO0lBU0U7UUFKQSxtQkFBYyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBRWxFLFdBQU0sR0FBRyxLQUFLLENBQUM7SUFFQyxDQUFDO0lBRWpCLHlDQUFXLEdBQVg7UUFBQSxpQkFPQztRQU5DLFdBQVcsQ0FBQztZQUNWLEtBQUksQ0FBQyxNQUFNO2dCQUNULEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtvQkFDbkIsSUFBSSxJQUFJLEVBQUUsSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7b0JBQzlCLElBQUksSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDaEMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELDRDQUFjLEdBQWQsVUFBZSxJQUFZO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFwQkQ7UUFEQyxLQUFLLEVBQUU7O3NEQUNPO0lBR2Y7UUFEQyxNQUFNLEVBQUU7a0NBQ08sWUFBWTsrREFBc0M7SUFMdkQsbUJBQW1CO1FBTC9CLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsNnBPQUEwQzs7U0FFM0MsQ0FBQzs7T0FDVyxtQkFBbUIsQ0F1Qi9CO0lBQUQsMEJBQUM7Q0FBQSxBQXZCRCxJQXVCQztTQXZCWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG5cblxuICBPbkNoYW5nZXMsIE91dHB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1DRXZlbnQgfSBmcm9tICcuLi8uLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtbWMtcXVpY2tsaW5rcycsXG4gIHRlbXBsYXRlVXJsOiAnLi9xdWlja2xpbmtzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcXVpY2tsaW5rcy5jb21wb25lbnQuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBRdWlja2xpbmtzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KClcbiAgZXZlbnQ6IE1DRXZlbnQ7XG5cbiAgQE91dHB1dCgpXG4gIHF1aWNrbGlua0NsaWNrOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIGlzTGl2ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5pc0xpdmUgPVxuICAgICAgICB0aGlzLmV2ZW50LnZpZGVvVVJMICYmXG4gICAgICAgIG5ldyBEYXRlKCkgPj0gdGhpcy5ldmVudC5zdGFydCAmJlxuICAgICAgICBuZXcgRGF0ZSgpIDwgdGhpcy5ldmVudC5lbmQ7XG4gICAgfSwgNjApO1xuICB9XG5cbiAgbmF2aWdhdGVUb0xpbmsobGluazogc3RyaW5nKSB7XG4gICAgdGhpcy5xdWlja2xpbmtDbGljay5lbWl0KGxpbmspO1xuICB9XG59XG4iXX0=