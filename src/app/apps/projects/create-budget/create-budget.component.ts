import { Component, Input } from '@angular/core';
import { UntypedFormBuilder } from "@angular/forms";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { companycategory_list } from "../../../core/gql/costcode";
import { companyproject_new } from "../../../core/gql/project";


@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})
export class CreateBudgetComponent {
  @Input() params;
  @Input() modalRef;
  
  
  constructor(
    private fb: UntypedFormBuilder,
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ){}
  
  error: string = '';
  allocatedBudget = 0;
  idCompany = 0;
  categoryList = [];
  editingCategory = 0;
  createProject = {
    name: '',
    address: '',
    idGroup: 0,
    budget: 0,
    sqft: 0,
    categoryList: []
  }
  
  
  ngOnInit(): void{
    this.createProject = this.params;
    this.budgetChange();
    this.getCategoryList();
  }
  
  
  getCategoryList(){
    this.idCompany = parseInt(localStorage.getItem('idcompany'));
    if(this.idCompany != 0){
      this.apolloService.query(companycategory_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companycategory_list;
        if(!result.error){
          this.categoryList = result.data;
        }
      });
    }
  }
  
  
  cleanCategoryList(){
    let list = [];
    this.createProject.categoryList.map(item => {
      if(item.idCategory !== ''){
        list.push(item);
      }
    })
    this.createProject.categoryList = list;
  }
  
  setEdtingCategory(i, obj){
    this.editingCategory = i;
    setTimeout(() => {
      if(obj == 'Name'){
        document.getElementById('categoryDropdownBtn_' + i).click();
      }
      if(obj == 'BP'){
        document.getElementById('budgetPercentage_' + i).focus();
      }
      if(obj == 'BA'){
        document.getElementById('budgetAmount_' + i).focus();
      }
      this.cleanCategoryList();
    }, 50)
  }
  
  selectedCategory(category){
    category.selected = true;
    this.categoryList.map(item => {
      if(item.id === this.createProject.categoryList[this.editingCategory].idCategory){
        item.selected = false;
      }
    })
    this.createProject.categoryList[this.editingCategory].idCategory = category.id;
    this.createProject.categoryList[this.editingCategory].txtName = category.txtName;
  }
  
  deleteCategory(i){
    this.categoryList.map(item => {
      if(item.id === this.createProject.categoryList[i].idCategory){
        item.selected = false;
      }
    })
    this.createProject.categoryList.splice(i, 1);
    this.cleanCategoryList();
    this.budgetChange();
  }
  
  addCategory(){
    let isEditing = this.createProject.categoryList.some(item => {
      return item.idCategory === '';
    })
    if(!isEditing){
      this.createProject.categoryList.push({
        idCategory: '',
        txtName: '',
        budgetPercentage: 0,
        budgetAmount: 0
      })
      
      this.editingCategory = this.createProject.categoryList.length - 1;
      
      setTimeout(() => {
        document.getElementById('categoryDropdownBtn_' + this.editingCategory).click();
      }, 50)
    }
  }
  
  openCategoryDropdownMenu(i){
    this.editingCategory = i;
  }
  
  budgetChange(){
    let total = 0;
    this.createProject.categoryList.map(item => {
      total += item.budgetAmount * item.budgetPercentage / 100;
    })
    this.allocatedBudget = total;
  }
  
  getProgressBarWidth(){
    let percent = this.allocatedBudget / this.createProject.budget * 100;
    return percent + '%';
  }
  
  
  submitProject(){
    this.cleanCategoryList();
    
    if(this.createProject.name == ''){
      this.toastrService.warning('Project Name is required, please back to enter the Project Name.');
      return;
    }
    
    // if(this.createProject.budget == ''){
    //   this.toastrService.warning('Project Budget is required, please back to enter the Project Budget.');
    //   return;
    // }
    //
    // if(this.createProject.sqft == ''){
    //   this.toastrService.warning('Project Size, sqft is required, please back to enter the Project Size, sqft.');
    //   return;
    // }
    
    let list = [];
    this.createProject.categoryList.map(item => {
      list.push({
        idCategory: item.idCategory,
        budgetPercentage: item.budgetPercentage,
        budgetAmount: item.budgetAmount
      })
    })
    
    
    this.apolloService.mutate(companyproject_new, {
      idCompany: this.idCompany,
      projectName: this.createProject.name,
      projectAddress: this.createProject.address,
      idGroup: this.createProject.idGroup,
      projectBudget: this.createProject.budget,
      projectSqft: this.createProject.sqft,
      budgetAllocation: list
    }).then((res) => {
      let result = res.companyproject_new;
      if(!result.error){
        this.modalRef.close('save success');
        this.toastrService.success('Save success', '');
      } else{
        this.toastrService.error(result.message, 'Error');
      }
    }).catch((error) => {
      this.error = error;
    });
  }
  
  
  closeModal(){
    this.modalRef.dismiss(this.createProject.categoryList);
  }
  
  
}

