import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {FormsModule} from "@angular/forms";
import {ModalModule, PaginationModule} from "ngx-bootstrap";


@NgModule({
	declarations: [AdminComponent],
	imports: [
		CommonModule,
		AdminRoutingModule,
		FormsModule,
		ModalModule.forRoot(),
		PaginationModule.forRoot()
	]
})
export class AdminModule {
}
