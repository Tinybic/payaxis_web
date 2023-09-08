import { Component, Input, OnInit } from '@angular/core';
import { companygroup_new } from "../../../core/gql/project";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { EventService } from "../../../core/service/event.service";
import { ApolloService } from "../../../core/service/apollo.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @Input() modalRef;
  
  newGroupError = '';
  idCompany=0;
  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eventService: EventService,
    private apolloService: ApolloService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService
  ){ }
  
  ngOnInit() {
    this.idCompany = parseInt(localStorage.getItem('idcompany'));
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
      this.toastrService.warning('Name is required, please enter the Name.');
      return;
    }
    this.apolloService.mutate(companygroup_new, {
      idCompany: this.idCompany,
      txtName: this.newGroupFormValues['name'].value
    }).then((res) => {
      let result = res.companygroup_new;
      if(!result.error){
        this.modalRef.newGroupModalRef.close('save success');
        this.toastrService.info('Save success', '');
      } else{
        this.toastrService.info(result.message, 'Error');
      }
    }).catch((error) => {
      this.newGroupError = error;
    });
  }
}
