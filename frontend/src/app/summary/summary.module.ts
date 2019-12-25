import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SummaryRoutingModule} from './summary-routing.module';
import {SummaryComponent} from './summary.component';
import {SharedModule} from "../shared.module";


@NgModule({
	declarations: [SummaryComponent],
	imports: [
		CommonModule,
		SummaryRoutingModule,
		SharedModule
	]
})
export class SummaryModule {
}
