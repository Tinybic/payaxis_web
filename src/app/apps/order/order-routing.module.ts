import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order.component";
import { NgModule } from "@angular/core";
import { AddOrderComponent } from "./add-order/add-order.component";
import { OrderDetailComponent } from "./order-detail/order-detail.component";

const routes: Routes = [
    { path: '', component: OrderComponent },
    { path: 'detail/:id', component: AddOrderComponent },
    { path: 'info/:id', component: OrderDetailComponent },
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrderRoutingModule { }