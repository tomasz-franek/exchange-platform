import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessagesComponent} from "./messages.component";
import {StoreModule} from '@ngrx/store';
import {Features} from '../features';
import {messageReducers} from './state/message.reducers';

const routes: Routes = [
  {path: '', component: MessagesComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.messages, messageReducers)],
  exports: [RouterModule]
})
export class MessagesRoutingModule {
}
