import { AfterViewInit, Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mmw-admin-ba-sidebar',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['baSidebar.scss'],
  templateUrl: 'baSidebar.html',
})
export class BaSidebarComponent implements OnInit, AfterViewInit {

  // public routes;
  menuHeight: number;
  isMenuCollapsed = false;
  isMenuShouldCollapsed = false;

  private layoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
  };

  constructor(private _elementRef: ElementRef) {}

  ngOnInit() {
    if (this._shouldMenuCollapse()) {
      this.menuCollapse();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateSidebarHeight());
  }

  // @HostListener('window:resize')
  // onWindowResize( {
  //
  //   var isMenuShouldCollapsed = this._shouldMenuCollapse();
  //
  //   if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
  //     this.menuCollapseStateChange(isMenuShouldCollapsed);
  //   }
  //   this.isMenuShouldCollapsed = isMenuShouldCollapsed;
  //   this.updateSidebarHeight();
  // }

  menuExpand() {
    this.menuCollapseStateChange(false);
  }

  menuCollapse() {
    this.menuCollapseStateChange(true);
  }

  menuCollapseStateChange(isCollapsed: boolean) {
    this.isMenuCollapsed = isCollapsed;
  }

  updateSidebarHeight() {
    // TODO: get rid of magic 84 constant
    this.menuHeight = this._elementRef.nativeElement.childNodes[0].clientHeight - 84;
  }

  private _shouldMenuCollapse(): boolean {
    return window.innerWidth <= this.layoutSizes.resWidthCollapseSidebar;
  }
}
