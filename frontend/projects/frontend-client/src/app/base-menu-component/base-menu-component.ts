import { Component, effect, inject, OnInit } from '@angular/core';
import { CheckedMenu } from 'shared-modules';
import { PropertyStore } from '../properties/properties.signal-store';

@Component({
  selector: 'app-base-menu-component',
  imports: [],
  templateUrl: './base-menu-component.html',
  styleUrl: './base-menu-component.scss',
})
export class BaseMenuComponent extends CheckedMenu implements OnInit {
  protected readonly store = inject(PropertyStore);
  constructor() {
    super();
    effect(() => {
      const userProperty = this.store.userProperty();
      if (userProperty) {
        this.ngOnInit();
      }
    });
    this.store.getUserProperty();
  }

  ngOnInit(): void {}
}
