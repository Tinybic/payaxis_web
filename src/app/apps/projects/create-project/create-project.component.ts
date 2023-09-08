import { Component, Input, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { companygroup_list } from "../../../core/gql/project";


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  @Input() idProject;
  @Input() modalRef;
  
  @ViewChild('createBudgetModal') createBudgetModal: NgbModalRef;
  @ViewChild('newGroupModal') newGroupModal: NgbModalRef;
  
  
  constructor(
    private fb: UntypedFormBuilder,
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ){}
  
  
  error: string = '';
  step: number = 1;
  idCompany = 0;
  createProject = {
    name: '',
    address: '',
    idGroup: 0,
    budget: '',
    sqft: '',
    categoryList: []
  }
  companyGroupList = [];
  selectedGroup = {
    idGroup: 0,
    txtName: '',
    projectCount: 0
  }
  createBudgetModalRef: any;
  newGroupModalRef: NgbModalRef;
  
  template = [{
    id: 1,
    name: '1 BD 1BR',
    isSelected: false
  },
    {
      id: 2,
      name: '2 BD 1BR',
      isSelected: false
    },
    {
      id: 3,
      name: '3 BD 1BR',
      isSelected: false
    },
    {
      id: 4,
      name: '4 BD 1BR',
      isSelected: false
    },
    {
      id: 5,
      name: '5 BD 1BR',
      isSelected: false
    },
    {
      id: 6,
      name: '6 BD 1BR',
      isSelected: false
    }]
  
  createProjectStep1Form: UntypedFormGroup = this.fb.group({
    name: ['',
      [
        Validators.required,
        Validators.maxLength(128)
      ]],
    address: ['',
      [
        Validators.maxLength(255)
      ]]
  })
  
  createProjectStep2Form: UntypedFormGroup = this.fb.group({
    budget: ['',
      [
        Validators.required,
        Validators.pattern('\\$?(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,2})?')
      ]],
    sqft: ['',
      [
        Validators.required,
        Validators.pattern('(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,5})?')
      ]],
    template: ['',
      [
        Validators.required
      ]]
  })
  
  ngOnInit(): void{
    this.idCompany = parseInt(localStorage.getItem('idcompany'));
    this.getCompanyGroupList();
  }
  
  
  getCompanyGroupList(){
    if(this.idCompany != 0){
      this.apolloService.query(companygroup_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companygroup_list;
        if(!result.error){
          this.companyGroupList = result.data;
          
          // if(this.companyGroupList.length > 0){
          //   this.selectedGroup = {
          //     idGroup: this.companyGroupList[this.companyGroupList.length - 1].id,
          //     txtName: this.companyGroupList[this.companyGroupList.length - 1].txtName,
          //     projectCount: this.companyGroupList[this.companyGroupList.length - 1].projectcount
          //   }
          // }
        }
      });
    }
  }
  
  /**
   * convenience getter for easy access to form fields
   */
  get formStep1Values(){
    return this.createProjectStep1Form.controls;
  }
  
  get formStep2Values(){
    return this.createProjectStep2Form.controls;
  }
  
  
  selectGroupProject(group){
    this.selectedGroup = {
      idGroup: group.id,
      txtName: group.txtName,
      projectCount: group.projectcount
    }
  }
  
  
  newGroup(e){
    e.preventDefault();
    this.newGroupModalRef = this.modalService.open(this.newGroupModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    })
    
    this.newGroupModalRef.result.then((result) => {
      this.getCompanyGroupList();
    }, (reason) => {
      console.log(reason);
    })
  }
  
  selectedTemplate(id){
    this.template.map(item => {
      if(item.id == id){
        item.isSelected = !item.isSelected;
      } else{
        item.isSelected = false;
      }
    })
  }
  
  createBudget(e){
    if(this.formStep1Values['name'].value == ''){
      this.toastrService.warning('Project Name is required, please back to enter the Project Name.');
      return;
    }
    
    if(this.selectedGroup.txtName == ''){
      this.toastrService.warning('Group is required, please back to select Group.');
      return;
    }
    
    if(this.formStep2Values['budget'].value == ''){
      this.toastrService.warning('Project Budget is required, please enter the Project Budget.');
      return;
    }
    
    if(this.formStep2Values['sqft'].value == ''){
      this.toastrService.warning('Project Size, sqft is required, please enter the Project Size, sqft.');
      return;
    }
    
    this.createProject = {
      name: this.formStep1Values['name'].value,
      address: this.formStep1Values['address'].value,
      idGroup: this.selectedGroup.idGroup,
      budget: this.formStep2Values['budget'].value,
      sqft: this.formStep2Values['sqft'].value,
      categoryList: []
    }
    e.preventDefault();
    this.createBudgetModalRef = this.modalService.open(this.createBudgetModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    })
    this.createBudgetModalRef.result.then((result) => {
      this.modalRef.modalRef.close();
    }, (reason) => {
      console.log(reason);
    })
  }
  
  onSubmit(){}
  
  closeModal(e){
    e.preventDefault();
    this.modalRef.modalRef.dismiss();
  }
}
