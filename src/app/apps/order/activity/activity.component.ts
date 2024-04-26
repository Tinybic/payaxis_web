import { Component } from '@angular/core';
import { ApolloService } from '../../../core/service/apollo.service';
import { ToastrService } from 'ngx-toastr';
import { projectorder_activity } from '../../../core/gql/orders';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  
  loading = true;
  orderId = 0;
  activityList = [];
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info'
  ];
  
  constructor(
    private apolloService: ApolloService,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService
  ){}
  
  ngOnInit():void{
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = parseInt(params['id']);
      this.getActivity();
    });
  }
  
  getActivity(){
    if(this.localStorage.getItem('idcompany') && this.orderId){
      this.apolloService.query(projectorder_activity, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idOrder1: this.orderId
      }).then((res) => {
        const result = res.projectorder_activity;
        if(!result.error){
          this.activityList = result.data;
          this.loading = false;
        }
      })
    }
    else{
      this.loading = false;
    }
  }
}
