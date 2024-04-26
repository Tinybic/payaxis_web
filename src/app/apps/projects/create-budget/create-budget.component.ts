import { Component, Input } from '@angular/core';
import { UntypedFormBuilder } from "@angular/forms";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { companycategory_list } from "../../../core/gql/costcode";
import { companyproject_new, companyproject_updatebudget } from "../../../core/gql/project";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';


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
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ){}
  
  error: string = '';
  allocatedBudget = 0;
  progressBarPercentage = 0;
  idCompany = 0;
  categoryList = [];
  editingCategory = -1;
  keepBudgetAllocation = [];
  
  
  ngOnInit(): void{
    this.keepBudgetAllocation = JSON.parse(JSON.stringify(this.budgetAllocation));
    this.calculateBudget();
    this.getCategoryList();
  }
  
  
  getCategoryList(){
    this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
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
  
  setEditingCategory(i, obj){
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
      if(type == ''){
        this.project.projectBudget = '';
      } else{
        item[type] = '';
      }
    }
    setTimeout(() => {
      let t = e.target;
      t.scrollLeft = t.scrollWidth;
      t.setSelectionRange(1000, 1000);
    }, 150)
    
    if(type == ''){
      this.editingCategory = -1;
      this.cleanCategoryList();
    }
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
    this.budgetAllocation[this.editingCategory]['anchor'] = 'P';  // P: Percentage; A: Amount
    this.keepBudgetAllocation = JSON.parse(JSON.stringify(this.budgetAllocation));
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
        budgetAmount: '',
        anchor: 'P'
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
    this.budgetAllocation.map(item => {
      allocatedBudgetTotal += item.budgetAmount;
    })
    this.allocatedBudget = allocatedBudgetTotal;
    this.keepBudgetAllocation = JSON.parse(JSON.stringify(this.budgetAllocation));
    
    if(this.project.projectBudget == 0 || this.project.projectBudget == ''){
      this.progressBarPercentage = 100;
    } else if(this.allocatedBudget > this.project.projectBudget){
      this.progressBarPercentage = this.project.projectBudget / this.allocatedBudget * 100;
    } else{
      this.progressBarPercentage = this.allocatedBudget / this.project.projectBudget * 100;
    }
  }
  
  budgetBlur(){
    if(this.project.projectBudget){
      this.project.projectBudget = parseFloat(this.project.projectBudget).toFixed(2);
    }
  }
  
  budgetKeydown(e, maxValue){
    const preValue = e.target.value;
    setTimeout(() => {
      if(e.target.value && e.target.value.length > 0){
        const currentValue = parseFloat(e.target.value.replace(/[$,]/g, ''));
        if(currentValue > maxValue){
          e.target.value = preValue;
        }
      }
    }, 0)
  }
  
  budgetChange(){
    this.budgetAllocation = JSON.parse(JSON.stringify(this.keepBudgetAllocation));
    let allocatedBudgetTotal = 0;
    this.budgetAllocation.map(item => {
      if([0,
        ''].includes(this.project.projectBudget)){
        if(item.anchor == 'P'){
          item.budgetAmount = 0.00;
        }
        if(item.anchor == 'A'){
          item.budgetPercentage = 0;
        }
        allocatedBudgetTotal += item.budgetAmount;
        this.progressBarPercentage = 100;
      } else{
        if(item.anchor == 'P' && item.budgetPercentage && item.budgetPercentage != 0){
          item.budgetAmount = this.project.projectBudget * item.budgetPercentage / 100;
        } else{
          if(item.anchor == 'A' && item.budgetAmount && item.budgetAmount != 0){
            item.budgetPercentage = item.budgetAmount * 100 / this.project.projectBudget;
            const arr = item.budgetPercentage.toString().split('.')
            if(arr.length > 1){
              if(arr[1].length > 3){
                item.budgetPercentage = item.budgetPercentage.toFixed(3)
              }
            }
          }
        }
        allocatedBudgetTotal += item.budgetAmount;
      }
    })
    this.keepBudgetAllocation = JSON.parse(JSON.stringify(this.budgetAllocation));
    this.allocatedBudget = allocatedBudgetTotal;
    if(this.allocatedBudget > this.project.projectBudget){
      this.progressBarPercentage = this.project.projectBudget / this.allocatedBudget * 100;
    } else{
      this.progressBarPercentage = this.allocatedBudget / this.project.projectBudget * 100;
    }
  }
  
  budgetPercentageChange(budget){
    budget.anchor = "P";
    if(this.project.projectBudget !== 0 && this.project.projectBudget !== ''){
      budget.budgetAmount = this.project.projectBudget * budget.budgetPercentage / 100;
    }
    this.calculateBudget();
  }
  
  budgetAmountChange(budget){
    budget.anchor = "A";
    if(this.project.projectBudget !== 0 && this.project.projectBudget !== ''){
      budget.budgetPercentage = budget.budgetAmount / this.project.projectBudget * 100;
      const arr = budget.budgetPercentage.toString().split('.')
      if(arr.length > 1){
        if(arr[1].length > 3){
          budget.budgetPercentage = budget.budgetPercentage.toFixed(3)
        }
      }
    }
    this.calculateBudget();
  }
  
  
  submitProject(){
    this.cleanCategoryList();
    
    if(this.project.projectName == ''){
      this.toastrService.info('Project Name is required, please back to enter the Project Name.');
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
        budgetPercentage: item.budgetPercentage ? parseFloat(item.budgetPercentage) : 0,
        budgetAmount: item.budgetAmount ? parseFloat(item.budgetAmount) : 0
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
        projectBudget: this.project.projectBudget ? parseFloat(this.project.projectBudget) : 0,
        projectSqft: this.project.projectSqft ? parseFloat(this.project.projectSqft) : 0,
        budgetAllocation: list
      }
    } else{
      serviceName = companyproject_updatebudget;
      params = {
        idCompany: this.idCompany,
        id: this.project.id,
        revision: this.project.revision,
        projectBudget: parseFloat(this.project.projectBudget),
        budgetAllocation: list
      }
    }
    
    this.apolloService.mutate(serviceName, params).then((res) => {
      let result: any = Object.values(res)[0];
      if(!result.error){
        this.modalRef.close(result.data.id);
        this.toastrService.info('Save success', '');
      } else{
        this.toastrService.info(result.message, 'Error');
      }
    }).catch((error) => {
      this.error = error;
    });
  }
  
  
  closeModal(){
    this.cleanCategoryList();
    this.modalRef.dismiss({
      budgetAllocation: this.budgetAllocation,
      projectBudget: this.project.projectBudget
    });
  }
}

