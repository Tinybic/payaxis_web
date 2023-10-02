import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', component: OrderComponent },
  ];
  
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OrderRoutingModule { }