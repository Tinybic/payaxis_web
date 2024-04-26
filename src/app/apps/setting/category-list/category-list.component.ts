import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { companycategory_deactivate, companycategory_list, companycategory_update } from "../../../core/gql/costcode";
import { LocalStorageService } from "../../../core/service/local-storage.service";
import { ApolloService } from "../../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  @Input() modal: any;
  @ViewChild('addCategoryModal') addCategoryModal: NgbModalRef;
  @ViewChild('deleteCategoryModal') deleteCategoryModal: NgbModalRef;
  addCategoryModalRef: NgbModalRef;
  deleteCategoryModalRef: NgbModalRef;
  
  idCompany?: number = 0;
  categoryList = [];
  categoryChanged: boolean = false;
  
  deleteConfirmObj = {
    title: 'Deleting Cost Code Category',
    message: '',
    btnConfirm: 'Confirm',
    serviceName: companycategory_deactivate,
    params: {},
    btnSide: 'end'
  }
  
  
  constructor(
    private modalService: NgbModal,
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ){}
  
  
  ngOnInit(){
    if(this.localStorage.getItem('idcompany')){
      this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
      this.getCategoryList();
    } else{
      this.toastrService.info('No Id Company found', '');
    }
  }
  
  getCategoryList(){
    if(this.idCompany != 0){
      this.apolloService.query(companycategory_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.companycategory_list;
        if(!result.error){
          this.categoryList = result.data;
        }
      });
    }
  }
  
  
  openAddCategoryModal(){
    this.addCategoryModalRef = this.modalService.open(this.addCategoryModal, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true
    });
    
    this.addCategoryModalRef.result.then((res) => {
      this.getCategoryList();
    }, (reason) => {
      console.log(reason);
    })
  }
  
  modifyCostCodeCategory(index){
    if(
      this.categoryList[index].id > 0 &&
      this.categoryList[index].txtName != 'Others'
    ){
      this.categoryList[index].edit = true;
      this.categoryList[index].editingName = this.categoryList[index].txtName;
    }
  }
  
  
  checkCategoryExist(name){
    for(let i = 0; i < this.categoryList.length; i++){
      if(this.categoryList[i].txtName.toLowerCase() == name.toLowerCase()){
        return false;
      }
    }
    return true;
  }
  
  updateCostCodeCategory(index){
    if(this.checkCategoryExist(this.categoryList[index].editingName)){
      this.apolloService.mutate(companycategory_update, {
        idCompany: this.idCompany,
        id: this.categoryList[index].id,
        revision: this.categoryList[index].revision,
        txtName: this.categoryList[index].editingName
      }).then((res) => {
        const result = res.companycategory_update;
        let message = '';
        if(!result.error){
          message = 'Category have been updated';
          this.categoryList[index].edit = false;
          this.categoryList[index].txtName = this.categoryList[index].editingName;
          this.categoryList[index].revision = result.data.revision;
          this.categoryChanged = true;
        } else{
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
    } else{
      this.toastrService.info(
        "Category cannot be named '" +
        this.categoryList[index].editingName +
        "'"
      );
    }
  }
  
  cancelCategory(i){
    this.categoryList[i].edit = false;
  }
  
  deleteCategory(i, name, costCodeCount){
    if(costCodeCount == 0){
      this.deleteConfirmObj.message = name + ' Category will be deleted.';
    } else{
      this.deleteConfirmObj.message = name +
        ' Category will be archived. ' + costCodeCount + ' Cost Codes assigned to this Category will be transfered to Others Category.';
    }
    this.deleteConfirmObj.params = {
      idCompany: this.idCompany,
      idCompany_category: this.categoryList[i].id,
      revision: this.categoryList[i].revision
    }
    
    this.deleteCategoryModalRef = this.modalService.open(this.deleteCategoryModal, {
      size: '443',
      centered: true
    });
    
    this.deleteCategoryModalRef.result.then((res) => {
      this.categoryList.splice(i, 1);
      this.categoryChanged = true;
    }, (reason) => {
      console.log(reason);
    })
    
    
  }
}
