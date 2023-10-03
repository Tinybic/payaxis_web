import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order.component";
import { NgModule } from "@angular/core";
import { AddOrderComponent } from "./add-order/add-order.component";

const routes: Routes = [
    { path: '', component: OrderComponent },
    { path: 'detail/:id', component: AddOrderComponent },
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrderRoutingModule { }