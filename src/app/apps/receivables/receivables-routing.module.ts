import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivableListComponent } from './receivable-list/receivable-list.component';
import { ReceivableDetailComponent } from './receivable-detail/receivable-detail.component';

const routes: Routes = [{ path: '', component: ReceivableListComponent },
 { path: 'detail/:id', component: ReceivableDetailComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivablesRoutingModule { }
