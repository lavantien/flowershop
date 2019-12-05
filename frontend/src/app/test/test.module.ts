import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TestRoutingModule} from './test-routing.module';
import {TestComponent} from './test.component';
import {SharedModule} from '../shared.module';


@NgModule({
	declarations: [TestComponent],
	imports: [
		CommonModule,
		TestRoutingModule,
		SharedModule
	]
})
export class TestModule {
}
