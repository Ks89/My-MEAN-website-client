import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mmw-admin-ba-menu-item',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'baMenuItem.html',
})
export class BaMenuItemComponent {

  @Input() menuItem: any;
  @Input() child = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  onHoverItem($event: any): void {
    this.itemHover.emit($event);
  }

  onToggleSubMenu($event: any, item: any): boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }
}
