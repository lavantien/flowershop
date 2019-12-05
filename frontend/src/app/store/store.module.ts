import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreRoutingModule} from './store-routing.module';
import {StoreComponent} from './store.component';
import {SharedModule} from '../shared.module';


@NgModule({
	declarations: [StoreComponent],
	imports: [
		CommonModule,
		StoreRoutingModule,
		SharedModule
	]
})
export class StoreModule {
}
