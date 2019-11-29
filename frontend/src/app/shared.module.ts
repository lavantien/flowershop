import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {ModalModule, PaginationModule} from "ngx-bootstrap";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LightboxModule} from "ngx-lightbox";


@NgModule({
	declarations: [],
	imports: [
		CommonModule
	],
	exports: [
		TranslateModule,
		FormsModule,
		FontAwesomeModule,
		ModalModule,
		PaginationModule,
		LightboxModule
	]
})
export class SharedModule {
}
