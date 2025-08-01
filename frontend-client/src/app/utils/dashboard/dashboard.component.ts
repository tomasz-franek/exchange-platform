import { Component, inject, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { PropertyState, selectUserProperty } from "../../properties/state/properties.selectors";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { getUserPropertyAction } from "../../properties/state/properties.actions";
import { UserProperty } from "../../api/model/userProperty";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [TranslatePipe, FooterComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css"
})
export class DashboardComponent implements OnInit {
  private _storeProperty$: Store<PropertyState> = inject(Store);
  private translateService: TranslateService = inject(TranslateService);

  ngOnInit() {
    this._storeProperty$.dispatch(getUserPropertyAction());
    this._storeProperty$.select(selectUserProperty).subscribe((data: UserProperty) => {
      if (data != undefined) {
        this.translateService.use(data.language).pipe().subscribe();
      }
    });
  }
}
