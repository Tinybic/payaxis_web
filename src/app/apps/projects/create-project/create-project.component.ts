import { Component, Input, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { companygroup_list, companyproject_updatedetail } from "../../../core/gql/project";


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  @Input() project;
  @Input() createProjectWithGroup?;
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
    id: '',
    projectName: '',
    projectAddress: '',
    idGroup: 0,
    projectBudget: '',
    projectSqft: ''
  }
  budgetAllocation = [];
  groupList = [];
  selectedGroup = {
    idGroup: -1,
    txtName: 'Assign Group',
    projectCount: 0
  }
  createBudgetModalRef: NgbModalRef;
  newGroupModalRef: NgbModalRef;
  
  template = [];
  
  // template = [{
  //   id: 1,
  //   name: '1 BD 1BR',
  //   isSelected: false
  // },
  //   {
  //     id: 2,
  //     name: '2 BD 1BR',
  //     isSelected: false
  //   },
  //   {
  //     id: 3,
  //     name: '3 BD 1BR',
  //     isSelected: false
  //   },
  //   {
  //     id: 4,
  //     name: '4 BD 1BR',
  //     isSelected: false
  //   },
  //   {
  //     id: 5,
  //     name: '5 BD 1BR',
  //     isSelected: false
  //   },
  //   {
  //     id: 6,
  //     name: '6 BD 1BR',
  //     isSelected: false
  //   }]
  
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
        Validators.pattern('\\$?(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,2})?')
      ]],
    sqft: ['',
      [
        Validators.pattern('(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,5})?')
      ]],
    template: ['',
      [
        Validators.required
      ]]
  })
  createProjectStep3Form: UntypedFormGroup = this.fb.group({
    editName: ['',
      [
        Validators.required,
        Validators.maxLength(128)
      ]],
    editAddress: ['',
      [
        Validators.maxLength(255)
      ]],
    editSqft: ['',
      [
        Validators.pattern('(([1-9](\\d*|\\d{0,2}(,\\d{3})*))|0)(\\.\\d{1,5})?')
      ]]
  })
  
  ngOnInit(): void{
    this.idCompany = parseInt(localStorage.getItem('idcompany'));
    this.getGroupList();
    if(this.project){
      this.step = 3;
      this.formStep3Values['editName'].setValue(this.project.projectName);
      this.formStep3Values['editAddress'].setValue(this.project.projectAddress);
      this.selectedGroup = {
        idGroup: this.project.idGroup,
        txtName: this.project.groupName,
        projectCount: 0
      }
      this.formStep3Values['editSqft'].setValue(this.project.projectSqft);
    } else{
      if(this.createProjectWithGroup){
        this.selectedGroup = {
          idGroup: this.createProjectWithGroup.id,
          txtName: this.createProjectWithGroup.txtName,
          projectCount: 0
        }
      }
    }
  }
  
  
  getGroupList(){
    if(this.idCompany != 0){
      this.apolloService.query(companygroup_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companygroup_list;
        if(!result.error){
          this.groupList = result.data;
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
  
  get formStep3Values(){
    return this.createProjectStep3Form.controls;
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
      this.getGroupList();
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
      this.toastrService.info('Project Name is required, please back to enter the Project Name.');
      return;
    }
    
    if(this.selectedGroup.idGroup == -1){
      this.toastrService.info('Group is required, please back to select Group.');
      return;
    }
    
    // if(this.formStep2Values['budget'].value == ''){
    //   // this.formStep2Values['budget'].setValue(0);
    //   this.toastrService.warning('Project Budget is required, please enter the Project Budget.');
    //   return;
    // }
    
    // if(this.formStep2Values['sqft'].value == ''){
    //   // this.formStep2Values['sqft'].setValue(0);
    //   this.toastrService.warning('Project Size, sqft is required, please enter the Project Size, sqft.');
    //   return;
    // }
    
    this.createProject = {
      id: '',
      projectName: this.formStep1Values['name'].value,
      projectAddress: this.formStep1Values['address'].value,
      idGroup: this.selectedGroup.idGroup,
      projectBudget: this.formStep2Values['budget'].value,
      projectSqft: this.formStep2Values['sqft'].value
    }
    e.preventDefault();
    this.createBudgetModalRef = this.modalService.open(this.createBudgetModal, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    })
    this.createBudgetModalRef.result.then((result) => {
      this.modalRef.close();
    }, (reason) => {
      this.budgetAllocation = reason.budgetAllocation;
      this.formStep2Values['budget'].setValue(reason.projectBudget);
      console.log(reason);
    })
  }
  
  onSubmit(){}
  
  
  editProject(){
    if(this.formStep3Values['editName'].value == ''){
      this.toastrService.info('Project Name is required, please back to enter the Project Name.');
      return;
    }
    
    if(this.selectedGroup.idGroup == -1){
      this.toastrService.info('Group is required, please back to select Group.');
      return;
    }
    
    this.apolloService.mutate(companyproject_updatedetail, {
      idCompany:this.idCompany,
      id: this.project.id,
      revision: this.project.revision,
      projectName: this.formStep3Values['editName'].value,
      projectAddress: this.formStep3Values['editAddress'].value,
      idGroup: this.selectedGroup.idGroup,
      projectSqft: this.formStep3Values['editSqft'].value
    }).then((res) => {
      let result = res.companyproject_updatedetail;
      if(!result.error){
        this.modalRef.close('save success');
        this.toastrService.info('Save success', '');
      } else{
        this.toastrService.info(result.message, 'Error');
      }
    }).catch((error) => {
      this.error = error;
    });
  }
  
  closeModal(e){
    e.preventDefault();
    this.modalRef.dismiss();
  }
}
