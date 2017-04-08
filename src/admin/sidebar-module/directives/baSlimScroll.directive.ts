import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[mmwBaSlimScroll]'
})
export class BaSlimScrollDirective implements OnChanges {

  @Input() public baSlimScrollOptions: any;

  constructor(private _elementRef: ElementRef) {}

  ngOnChanges(changes: any) {
    this._scroll();
  }

  private _scroll() {
    this._destroy();
    this._init();
  }

  private _init() {
    jQuery(this._elementRef.nativeElement).slimScroll(this.baSlimScrollOptions);
  }

  private _destroy() {
    jQuery(this._elementRef.nativeElement).slimScroll({destroy: true});
  }
}
