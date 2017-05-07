import { Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, Routes, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { BaMenuService } from './baMenu.service';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'mmw-ba-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'baMenu.html'
})
export class BaMenuComponent implements OnInit, OnDestroy {

  menuRoutes: Routes = [];
  @Input() sidebarCollapsed = false;
  @Input() menuHeight: number;

  @Output() expandMenu = new EventEmitter<any>();

  menuItems: any[];
  showHoverElem: boolean;
  hoverElemHeight: number;
  hoverElemLeft: number;
  hoverElemTop: number;
  outOfArea: -200;

  protected _onRouteChange: Subscription;
  private menuSubscription: Subscription;

  constructor(private _router: Router, private _service: BaMenuService, private menuService: MenuService) {
    this._onRouteChange = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.menuItems) {
          this.selectMenuAndNotify();
        } else {
          // on page load we have to wait as event is fired before menu elements are prepared
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    });
  }

  selectMenuAndNotify(): void {
    if (this.menuItems) {
      this.menuItems = this._service.selectMenuItem(this.menuItems);
    }
  }

  ngOnInit(): void {
    this.menuSubscription = this.menuService.getMenu().subscribe(
      val => {
        let routes = _.cloneDeep(val);
        this.menuItems = this._service.convertRoutesToMenus(routes);
        return this.menuItems;
      },
      e => console.log('error')
    );
  }

  ngOnDestroy(): void {
    if (this._onRouteChange) {
      this._onRouteChange.unsubscribe();
    }
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }

  hoverItem($event: any): void {
    this.showHoverElem = true;
    this.hoverElemHeight = $event.currentTarget.clientHeight;

    // TODO: get rid of magic constants
    this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 54;
    this.hoverElemLeft = $event.currentTarget.clientWidth + 11;
  }

  toggleSubMenu($event: any): boolean {
    let submenu = jQuery($event.currentTarget).next();

    if (this.sidebarCollapsed) {
      this.expandMenu.emit(null);
      if (!$event.item.expanded) {
        $event.item.expanded = true;
      }
    } else {
      $event.item.expanded = !$event.item.expanded;
      submenu.slideToggle();
    }

    return false;
  }
}
