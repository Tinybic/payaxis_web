import { Component, Input, OnInit } from '@angular/core';
import { companygroup_new, companygroup_update } from "../../../core/gql/project";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { EventService } from "../../../core/service/event.service";
import { ApolloService } from "../../../core/service/apollo.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @Input() modalRef;
  @Input() group;
  
  newGroupError = '';
  idCompany=0;
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eventService: EventService,
    private apolloService: ApolloService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ){ }
  
  ngOnInit() {
    this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
    if(this.group != ''){
      this.newGroupFormValues['name'].setValue(this.group.txtName);
    }
  }
  
  
  
  newGroupForm: UntypedFormGroup = this.fb.group({
    name: ['',
      [
        Validators.required,
        Validators.maxLength(128)
      ]]
  })
  
  
  /**
   * convenience getter for easy access to form fields
   */
  get newGroupFormValues(){
    return this.newGroupForm.controls;
  }
  
  submitNewGroupForm(){
    if(this.newGroupFormValues['name'].value == ''){
      this.toastrService.info('Name is required, please enter the Name.');
      return;
    }
    let serviceName;
    let params;
    if(this.group == ''){
      serviceName = companygroup_new;
      params = {
        idCompany: this.idCompany,
        txtName: this.newGroupFormValues['name'].value
      }
    }else {
      serviceName = companygroup_update;
      params = {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        id: this.group.id,
        revision: this.group.revision,
        txtName: this.newGroupFormValues['name'].value
      }
    }
    this.apolloService.mutate(serviceName, params).then((res) => {
      let result: any = Object.values(res)[0];
      if(!result.error){
        this.modalRef.close(this.newGroupFormValues['name'].value);
        this.toastrService.info('Group created successfully!', '');
      } else{
        this.toastrService.info(result.message, 'Error');
      }
    }).catch((error) => {
      this.newGroupError = error;
    });
  }
}
