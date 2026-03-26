import { Component, effect, inject, OnInit } from '@angular/core';
import { CheckedMenu } from 'shared-modules';
import { PropertyStore } from '../properties/properties.signal-store';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-base-menu-component',
  imports: [],
  templateUrl: './base-menu-component.html',
  styleUrl: './base-menu-component.scss',
})
export class BaseMenuComponent extends CheckedMenu implements OnInit {
  public override items: MenuItem[] = [];
  protected readonly store = inject(PropertyStore);

  constructor() {
    super();
    effect(() => {
      const userProperty = this.store.userProperty();
      if (userProperty) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.store.getUserProperty();
  }
}
