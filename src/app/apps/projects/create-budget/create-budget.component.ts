import { Component, Input } from '@angular/core';
import { UntypedFormBuilder } from "@angular/forms";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { companycategory_list } from "../../../core/gql/costcode";
import { companyproject_new, companyproject_updatebudget } from "../../../core/gql/project";


@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss']
})
export class CreateBudgetComponent {
  @Input() project;
  @Input() budgetAllocation;
  @Input() modalRef;
  
  
  constructor(
    private fb: UntypedFormBuilder,
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ){}
  
  error: string = '';
  allocatedBudget = 0;
  progressBarPercentage = 0;
  idCompany = 0;
  categoryList = [];
  editingCategory = -1;
  
  
  ngOnInit(): void{
    this.project.projectBudget = this.project.projectBudget ? this.project.projectBudget : 0;
    this.project.projectSqft = this.project.projectSqft ? this.project.projectSqft : 0;
    
    this.calculateBudget();
    this.getCategoryList();
  }
  
  
  getCategoryList(){
    this.idCompany = parseInt(localStorage.getItem('idcompany'));
    if(this.idCompany != 0){
      this.apolloService.query(companycategory_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companycategory_list;
        if(!result.error){
          this.categoryList = result.data;
          this.categoryList.map((category) => {
            this.budgetAllocation.map((item) => {
              if(category.id === item.idCategory){
                category.selected = true;
              }
            })
          })
        }
      });
    }
  }
  
  
  cleanCategoryList(){
    let list = [];
    this.budgetAllocation.map(item => {
      if(item.idCategory !== ''){
        list.push(item);
      }
    })
    this.budgetAllocation = list;
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
  
  setCursorPosition(e, item, val, type){
    if(val == 0){
      item[type] = '';
    }
    setTimeout(() => {
      let t = e.target;
      t.scrollLeft = t.scrollWidth;
      t.setSelectionRange(1000, 1000);
    }, 150)
  }
  
  selectedCategory(category){
    category.selected = true;
    this.categoryList.map(item => {
      if(item.id === this.budgetAllocation[this.editingCategory].idCategory){
        item.selected = false;
      }
    })
    this.budgetAllocation[this.editingCategory].idCategory = category.id;
    this.budgetAllocation[this.editingCategory].category = category.txtName;
  }
  
  deleteCategory(i){
    this.categoryList.map(item => {
      if(item.id === this.budgetAllocation[i].idCategory){
        item.selected = false;
      }
    })
    this.budgetAllocation.splice(i, 1);
    this.cleanCategoryList();
    this.calculateBudget();
  }
  
  addCategory(){
    let isEditing = this.budgetAllocation.some(item => {
      return item.idCategory === '';
    })
    if(!isEditing){
      this.budgetAllocation.push({
        idCategory: '',
        category: '',
        budgetPercentage: '',
        budgetAmount: ''
      })
      
      this.editingCategory = this.budgetAllocation.length - 1;
      
      setTimeout(() => {
        document.getElementById('categoryDropdownBtn_' + this.editingCategory).click();
      }, 50)
    }
  }
  
  openCategoryDropdownMenu(i){
    this.editingCategory = i;
  }
  
  calculateBudget(){
    let allocatedBudgetTotal = 0;
    let progressBarPercentageTotal = 0;
    this.budgetAllocation.map(item => {
      allocatedBudgetTotal += item.budgetAmount;
      progressBarPercentageTotal += item.budgetPercentage;
    })
    this.allocatedBudget = allocatedBudgetTotal;
    if(this.project.projectBudget == 0){
      this.progressBarPercentage = 100;
    } else if(this.allocatedBudget > this.project.projectBudget){
      this.progressBarPercentage = this.project.projectBudget / this.allocatedBudget * 100;
    } else{
      this.progressBarPercentage = this.allocatedBudget / this.project.projectBudget * 100;
    }
  }
  
  budgetPercentageChange(budget){
    if(this.project.projectBudget !== 0){
      budget.budgetAmount = this.project.projectBudget * budget.budgetPercentage / 100;
    }
    this.calculateBudget();
  }
  
  budgetAmountChange(budget){
    if(this.project.projectBudget !== 0){
      budget.budgetPercentage = budget.budgetAmount / this.project.projectBudget * 100;
    }
    this.calculateBudget();
  }
  
  
  submitProject(){
    this.cleanCategoryList();
    
    if(this.project.projectName == ''){
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
    this.budgetAllocation.map(item => {
      list.push({
        idCategory: item.idCategory,
        budgetPercentage: item.budgetPercentage,
        budgetAmount: item.budgetAmount
      })
    })
    
    let serviceName;
    let params;
    
    if(this.project.id === ''){
      serviceName = companyproject_new;
      params = {
        idCompany: this.idCompany,
        projectName: this.project.projectName,
        projectAddress: this.project.projectAddress,
        idGroup: this.project.idGroup,
        projectBudget: this.project.projectBudget,
        projectSqft: this.project.projectSqft,
        budgetAllocation: list
      }
    }else {
      serviceName = companyproject_updatebudget;
      params = {
        id: this.project.id,
        revision: this.project.revision,
        projectBudget: this.project.projectBudget,
        budgetAllocation: list
      }
    }
    
    this.apolloService.mutate(serviceName, params).then((res) => {
      let result: any = Object.values(res)[0];
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
    this.cleanCategoryList();
    this.modalRef.dismiss(this.budgetAllocation);
  }
}

