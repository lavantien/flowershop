import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
	{
		path: '',
		redirectTo: 'test',
		pathMatch: 'full'
	},
	{path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule)},
	{path: 'store', loadChildren: () => import('./store/store.module').then(m => m.StoreModule)},
	{path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)},
	{path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
	{path: 'info', loadChildren: () => import('./info/info.module').then(m => m.InfoModule)}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
