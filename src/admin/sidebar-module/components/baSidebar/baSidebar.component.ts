import {Component, ElementRef, HostListener, ViewEncapsulation} from '@angular/core';
import {BaMenu} from '../baMenu';
import * as _ from 'lodash';

import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'ba-sidebar',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['baSidebar.scss'],
  templateUrl: 'baSidebar.html',
})
export class BaSidebar {

  private layoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
  };

  // here we declare which routes we want to use as a menu in our sidebar
  public routes = _.cloneDeep(PAGES_MENU); // we're creating a deep copy since we are going to change that object


  public menuHeight:number;
  public isMenuCollapsed:boolean = false;
  public isMenuShouldCollapsed:boolean = false;


  constructor(private _elementRef:ElementRef) {
  }

  public ngOnInit():void {
    if (this._shouldMenuCollapse()) {
      this.menuCollapse();
    }
  }

  public ngAfterViewInit():void {
    setTimeout(() => this.updateSidebarHeight());
  }

  @HostListener('window:resize')
  public onWindowResize():void {

    var isMenuShouldCollapsed = this._shouldMenuCollapse();

    if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
      this.menuCollapseStateChange(isMenuShouldCollapsed);
    }
    this.isMenuShouldCollapsed = isMenuShouldCollapsed;
    this.updateSidebarHeight();
  }

  public menuExpand():void {
    this.menuCollapseStateChange(false);
  }

  public menuCollapse():void {
    this.menuCollapseStateChange(true);
  }

  public menuCollapseStateChange(isCollapsed:boolean):void {
    this.isMenuCollapsed = isCollapsed;
  }

  public updateSidebarHeight():void {
    // TODO: get rid of magic 84 constant
    this.menuHeight = this._elementRef.nativeElement.childNodes[0].clientHeight - 84;
  }

  private _shouldMenuCollapse():boolean {
    return window.innerWidth <= this.layoutSizes.resWidthCollapseSidebar;
  }
}
