import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreRoutingModule} from './store-routing.module';
import {StoreComponent} from './store.component';


@NgModule({
	declarations: [StoreComponent],
	imports: [
		CommonModule,
		StoreRoutingModule
	]
})
export class StoreModule {
}
