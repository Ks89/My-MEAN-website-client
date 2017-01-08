import {Component, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import {Router, Routes, NavigationEnd} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import {BaMenuService} from './baMenu.service';
import {MenuService} from "../../../common/services/menu.service";

@Component({
  selector: 'ba-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'baMenu.html'
})
export class BaMenu {

  public menuRoutes:Routes = [];
  @Input() sidebarCollapsed:boolean = false;
  @Input() menuHeight:number;

  @Output() expandMenu = new EventEmitter<any>();

  public menuItems:any[];
  public showHoverElem:boolean;
  public hoverElemHeight:number;
  public hoverElemLeft: number;
  public hoverElemTop:number;
  protected _onRouteChange:Subscription;
  public outOfArea:number = -200;

  constructor(private _router:Router, private _service:BaMenuService, private menuService: MenuService) {
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

  public selectMenuAndNotify():void {
    if (this.menuItems) {
      this.menuItems = this._service.selectMenuItem(this.menuItems);
    }
  }

  public ngOnInit():void {
    this.menuService.getMenu().subscribe(
      val => {
        let routes = _.cloneDeep(val);
        this.menuItems = this._service.convertRoutesToMenus(routes);
        return this.menuItems;
      },
        e => console.log('error')
    );
  }

  public ngOnDestroy():void {
    this._onRouteChange.unsubscribe();
  }

  public hoverItem($event: any):void {
    this.showHoverElem = true;
    this.hoverElemHeight = $event.currentTarget.clientHeight;

    // TODO: get rid of magic constants
    this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 54;
    this.hoverElemLeft = $event.currentTarget.clientWidth + 11;
  }

  public toggleSubMenu($event: any):boolean {
    var submenu = jQuery($event.currentTarget).next();

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
