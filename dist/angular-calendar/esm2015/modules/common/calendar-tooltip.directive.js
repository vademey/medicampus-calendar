import { __decorate, __metadata, __param } from "tslib";
import { Directive, Component, HostListener, OnDestroy, Input, ComponentRef, Injector, ComponentFactoryResolver, ViewContainerRef, ElementRef, ComponentFactory, Inject, Renderer2, TemplateRef, OnChanges, SimpleChanges, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { positionElements } from 'positioning';
import { of, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
let CalendarTooltipWindowComponent = class CalendarTooltipWindowComponent {
};
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarTooltipWindowComponent.prototype, "contents", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CalendarTooltipWindowComponent.prototype, "placement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarTooltipWindowComponent.prototype, "event", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], CalendarTooltipWindowComponent.prototype, "customTemplate", void 0);
CalendarTooltipWindowComponent = __decorate([
    Component({
        selector: 'mwl-calendar-tooltip-window',
        template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event"
    >
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }"
    >
    </ng-template>
  `
    })
], CalendarTooltipWindowComponent);
export { CalendarTooltipWindowComponent };
let CalendarTooltipDirective = class CalendarTooltipDirective {
    constructor(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document //tslint:disable-line
    ) {
        this.elementRef = elementRef;
        this.injector = injector;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.document = document;
        this.placement = 'auto'; // tslint:disable-line no-input-rename
        this.delay = null; // tslint:disable-line no-input-rename
        this.cancelTooltipDelay$ = new Subject();
        this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
    }
    ngOnChanges(changes) {
        if (this.tooltipRef &&
            (changes.contents || changes.customTemplate || changes.event)) {
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            this.tooltipRef.changeDetectorRef.markForCheck();
            if (!this.contents) {
                this.hide();
            }
        }
    }
    ngOnDestroy() {
        this.hide();
    }
    onMouseOver() {
        const delay$ = this.delay === null ? of('now') : timer(this.delay);
        delay$.pipe(takeUntil(this.cancelTooltipDelay$)).subscribe(() => {
            this.show();
        });
    }
    onMouseOut() {
        this.hide();
    }
    show() {
        if (!this.tooltipRef && this.contents) {
            this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            if (this.appendToBody) {
                this.document.body.appendChild(this.tooltipRef.location.nativeElement);
            }
            requestAnimationFrame(() => {
                this.positionTooltip();
            });
        }
    }
    hide() {
        if (this.tooltipRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
            this.tooltipRef = null;
        }
        this.cancelTooltipDelay$.next();
    }
    positionTooltip(previousPositions = []) {
        if (this.tooltipRef) {
            this.tooltipRef.changeDetectorRef.detectChanges();
            this.tooltipRef.instance.placement = positionElements(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
            // keep re-positioning the tooltip until the arrow position doesn't make a difference
            if (previousPositions.indexOf(this.tooltipRef.instance.placement) === -1) {
                this.positionTooltip([
                    ...previousPositions,
                    this.tooltipRef.instance.placement,
                ]);
            }
        }
    }
};
CalendarTooltipDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: Renderer2 },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
__decorate([
    Input('mwlCalendarTooltip'),
    __metadata("design:type", String)
], CalendarTooltipDirective.prototype, "contents", void 0);
__decorate([
    Input('tooltipPlacement'),
    __metadata("design:type", Object)
], CalendarTooltipDirective.prototype, "placement", void 0);
__decorate([
    Input('tooltipTemplate'),
    __metadata("design:type", TemplateRef)
], CalendarTooltipDirective.prototype, "customTemplate", void 0);
__decorate([
    Input('tooltipEvent'),
    __metadata("design:type", Object)
], CalendarTooltipDirective.prototype, "event", void 0);
__decorate([
    Input('tooltipAppendToBody'),
    __metadata("design:type", Boolean)
], CalendarTooltipDirective.prototype, "appendToBody", void 0);
__decorate([
    Input('tooltipDelay'),
    __metadata("design:type", Number)
], CalendarTooltipDirective.prototype, "delay", void 0);
__decorate([
    HostListener('mouseenter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarTooltipDirective.prototype, "onMouseOver", null);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarTooltipDirective.prototype, "onMouseOut", null);
CalendarTooltipDirective = __decorate([
    Directive({
        selector: '[mwlCalendarTooltip]',
    }),
    __param(5, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [ElementRef,
        Injector,
        Renderer2,
        ComponentFactoryResolver,
        ViewContainerRef, Object])
], CalendarTooltipDirective);
export { CalendarTooltipDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibW9kdWxlcy9jb21tb24vY2FsZW5kYXItdG9vbHRpcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsS0FBSyxFQUNMLFlBQVksRUFDWixRQUFRLEVBQ1Isd0JBQXdCLEVBQ3hCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLFNBQVMsRUFDVCxhQUFhLEdBQ2QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBa0IsZ0JBQWdCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDL0QsT0FBTyxFQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQTRCM0MsSUFBYSw4QkFBOEIsR0FBM0MsTUFBYSw4QkFBOEI7Q0FRMUMsQ0FBQTtBQVBVO0lBQVIsS0FBSyxFQUFFOztnRUFBa0I7QUFFakI7SUFBUixLQUFLLEVBQUU7O2lFQUFtQjtBQUVsQjtJQUFSLEtBQUssRUFBRTs7NkRBQWdCO0FBRWY7SUFBUixLQUFLLEVBQUU7OEJBQWlCLFdBQVc7c0VBQU07QUFQL0IsOEJBQThCO0lBekIxQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsNkJBQTZCO1FBQ3ZDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJUO0tBQ0YsQ0FBQztHQUNXLDhCQUE4QixDQVExQztTQVJZLDhCQUE4QjtBQWEzQyxJQUFhLHdCQUF3QixHQUFyQyxNQUFhLHdC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O1lBQ1osUUFBUTtZQUNSLFNBQVM7WUFDRCx3QkFBd0I7WUFDeEIsZ0JBQWdCOzRDQUN6QyxNQUFNLFNBQUMsUUFBUTs7QUF0Qlc7SUFBNUIsS0FBSyxDQUFDLG9CQUFvQixDQUFDOzswREFBa0I7QUFFbkI7SUFBMUIsS0FBSyxDQUFDLGtCQUFrQixDQUFDOzsyREFBb0M7QUFFcEM7SUFBekIsS0FBSyxDQUFDLGlCQUFpQixDQUFDOzhCQUFpQixXQUFXO2dFQUFNO0FBRXBDO0lBQXRCLEtBQUssQ0FBQyxjQUFjLENBQUM7O3VEQUFnQjtBQUVSO0lBQTdCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQzs7OERBQXVCO0FBRTdCO0lBQXRCLEtBQUssQ0FBQyxjQUFjLENBQUM7O3VEQUE2QjtBQXdDbkQ7SUFEQyxZQUFZLENBQUMsWUFBWSxDQUFDOzs7OzJEQU8xQjtBQUdEO0lBREMsWUFBWSxDQUFDLFlBQVksQ0FBQzs7OzswREFHMUI7QUE5RFUsd0JBQXdCO0lBSHBDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxzQkFBc0I7S0FDakMsQ0FBQztJQXdCRyxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtxQ0FMRyxVQUFVO1FBQ1osUUFBUTtRQUNSLFNBQVM7UUFDRCx3QkFBd0I7UUFDeEIsZ0JBQWdCO0dBdEJqQyx3QkFBd0IsQ0FrSHBDO1NBbEhZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgQ29tcG9uZW50LFxuICBIb3N0TGlzdGVuZXIsXG4gIE9uRGVzdHJveSxcbiAgSW5wdXQsXG4gIENvbXBvbmVudFJlZixcbiAgSW5qZWN0b3IsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgRWxlbWVudFJlZixcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgSW5qZWN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUGxhY2VtZW50QXJyYXksIHBvc2l0aW9uRWxlbWVudHMgfSBmcm9tICdwb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE1DRXZlbnQgfSBmcm9tICcuLi8uLi91dGlsaXRpZXMvbWMtY2FsZW5kYXItdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtd2wtY2FsZW5kYXItdG9vbHRpcC13aW5kb3cnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWNvbnRlbnRzPVwiY29udGVudHNcIlxuICAgICAgbGV0LXBsYWNlbWVudD1cInBsYWNlbWVudFwiXG4gICAgICBsZXQtZXZlbnQ9XCJldmVudFwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbC10b29sdGlwXCIgW25nQ2xhc3NdPVwiJ2NhbC10b29sdGlwLScgKyBwbGFjZW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNhbC10b29sdGlwLWFycm93XCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtdG9vbHRpcC1pbm5lclwiIFtpbm5lckh0bWxdPVwiY29udGVudHNcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgY29udGVudHM6IGNvbnRlbnRzLFxuICAgICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50IHtcbiAgQElucHV0KCkgY29udGVudHM6IHN0cmluZztcblxuICBASW5wdXQoKSBwbGFjZW1lbnQ6IHN0cmluZztcblxuICBASW5wdXQoKSBldmVudDogTUNFdmVudDtcblxuICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pjtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bENhbGVuZGFyVG9vbHRpcF0nLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclRvb2x0aXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgnbXdsQ2FsZW5kYXJUb29sdGlwJykgY29udGVudHM6IHN0cmluZzsgLy8gdHNsaW50OmRpc2FibGUtbGluZSBuby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBQbGFjZW1lbnQnKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2F1dG8nOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lIG5vLWlucHV0LXJlbmFtZVxuXG4gIEBJbnB1dCgndG9vbHRpcFRlbXBsYXRlJykgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47IC8vIHRzbGludDpkaXNhYmxlLWxpbmUgbm8taW5wdXQtcmVuYW1lXG5cbiAgQElucHV0KCd0b29sdGlwRXZlbnQnKSBldmVudDogTUNFdmVudDsgLy8gdHNsaW50OmRpc2FibGUtbGluZSBuby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBBcHBlbmRUb0JvZHknKSBhcHBlbmRUb0JvZHk6IGJvb2xlYW47IC8vIHRzbGludDpkaXNhYmxlLWxpbmUgbm8taW5wdXQtcmVuYW1lXG5cbiAgQElucHV0KCd0b29sdGlwRGVsYXknKSBkZWxheTogbnVtYmVyIHwgbnVsbCA9IG51bGw7IC8vIHRzbGludDpkaXNhYmxlLWxpbmUgbm8taW5wdXQtcmVuYW1lXG5cbiAgcHJpdmF0ZSB0b29sdGlwRmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnQ+O1xuICBwcml2YXRlIHRvb2x0aXBSZWY6IENvbXBvbmVudFJlZjxDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnQ+O1xuICBwcml2YXRlIGNhbmNlbFRvb2x0aXBEZWxheSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQgLy90c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICkge1xuICAgIHRoaXMudG9vbHRpcEZhY3RvcnkgPSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoXG4gICAgICBDYWxlbmRhclRvb2x0aXBXaW5kb3dDb21wb25lbnRcbiAgICApO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIHRoaXMudG9vbHRpcFJlZiAmJlxuICAgICAgKGNoYW5nZXMuY29udGVudHMgfHwgY2hhbmdlcy5jdXN0b21UZW1wbGF0ZSB8fCBjaGFuZ2VzLmV2ZW50KVxuICAgICkge1xuICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLmNvbnRlbnRzID0gdGhpcy5jb250ZW50cztcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5jdXN0b21UZW1wbGF0ZSA9IHRoaXMuY3VzdG9tVGVtcGxhdGU7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UuZXZlbnQgPSB0aGlzLmV2ZW50O1xuICAgICAgdGhpcy50b29sdGlwUmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICBpZiAoIXRoaXMuY29udGVudHMpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgb25Nb3VzZU92ZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZGVsYXkkOiBPYnNlcnZhYmxlPGFueT4gPVxuICAgICAgdGhpcy5kZWxheSA9PT0gbnVsbCA/IG9mKCdub3cnKSA6IHRpbWVyKHRoaXMuZGVsYXkpO1xuICAgIGRlbGF5JC5waXBlKHRha2VVbnRpbCh0aGlzLmNhbmNlbFRvb2x0aXBEZWxheSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgb25Nb3VzZU91dCgpOiB2b2lkIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvdygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudG9vbHRpcFJlZiAmJiB0aGlzLmNvbnRlbnRzKSB7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KFxuICAgICAgICB0aGlzLnRvb2x0aXBGYWN0b3J5LFxuICAgICAgICAwLFxuICAgICAgICB0aGlzLmluamVjdG9yLFxuICAgICAgICBbXVxuICAgICAgKTtcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5jb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UuY3VzdG9tVGVtcGxhdGUgPSB0aGlzLmN1c3RvbVRlbXBsYXRlO1xuICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLmV2ZW50ID0gdGhpcy5ldmVudDtcbiAgICAgIGlmICh0aGlzLmFwcGVuZFRvQm9keSkge1xuICAgICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50b29sdGlwUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdGhpcy5wb3NpdGlvblRvb2x0aXAoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGlkZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sdGlwUmVmKSB7XG4gICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYucmVtb3ZlKFxuICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLnRvb2x0aXBSZWYuaG9zdFZpZXcpXG4gICAgICApO1xuICAgICAgdGhpcy50b29sdGlwUmVmID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jYW5jZWxUb29sdGlwRGVsYXkkLm5leHQoKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zaXRpb25Ub29sdGlwKHByZXZpb3VzUG9zaXRpb25zOiBzdHJpbmdbXSA9IFtdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudG9vbHRpcFJlZikge1xuICAgICAgdGhpcy50b29sdGlwUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5wbGFjZW1lbnQgPSBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgdGhpcy50b29sdGlwUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sXG4gICAgICAgIHRoaXMucGxhY2VtZW50LFxuICAgICAgICB0aGlzLmFwcGVuZFRvQm9keVxuICAgICAgKTtcbiAgICAgIC8vIGtlZXAgcmUtcG9zaXRpb25pbmcgdGhlIHRvb2x0aXAgdW50aWwgdGhlIGFycm93IHBvc2l0aW9uIGRvZXNuJ3QgbWFrZSBhIGRpZmZlcmVuY2VcbiAgICAgIGlmIChcbiAgICAgICAgcHJldmlvdXNQb3NpdGlvbnMuaW5kZXhPZih0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UucGxhY2VtZW50KSA9PT0gLTFcbiAgICAgICkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uVG9vbHRpcChbXG4gICAgICAgICAgLi4ucHJldmlvdXNQb3NpdGlvbnMsXG4gICAgICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLnBsYWNlbWVudCxcbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=