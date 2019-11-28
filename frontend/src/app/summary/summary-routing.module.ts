import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SummaryComponent} from './summary.component';

const routes: Routes = [{path: '', component: SummaryComponent}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SummaryRoutingModule {
}
