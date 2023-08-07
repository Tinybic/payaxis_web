import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorlistComponent } from './vendorlist/vendorlist.component';

const routes: Routes = [{ path: '', component: VendorlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
