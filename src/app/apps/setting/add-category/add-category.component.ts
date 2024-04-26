import { Component, Input } from '@angular/core';
import { companycategory_list, companycategory_new } from "../../../core/gql/costcode";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "../../../core/service/local-storage.service";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  @Input() modal: NgbModalRef;
  @Input() idProject?: number = 0;
  
  
  idCompany?: number = 0;
  categoryName = '';
  categoryNameError = false;
  categoryList =[];
  
  constructor(
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ){}
  
  ngOnInit() {
    if(this.localStorage.getItem('idcompany')){
      this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
      this.getCategoryList();
    }else {
        this.toastrService.info('No Id Company found','');
    }
  }
  
  getCategoryList() {
    if (this.idCompany != 0) {
      this.apolloService
      .query(companycategory_list, { idCompany: this.idCompany })
      .then((res) => {
        const result = res.companycategory_list;
        if (!result.error) {
          this.categoryList = result.data;
        }
      });
    }
  }
  
  checkCategoryExist(name) {
    for (let i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].txtName.toLowerCase() == name.toLowerCase()) {
        return false;
      }
    }
    return true;
  }
  
  createCategory() {
    if (this.checkCategoryExist(this.categoryName)) {
      this.apolloService
      .mutate(companycategory_new, {
        idCompany: this.idCompany,
        txtName: this.categoryName,
        idProject: this.idProject,
      })
      .then((res) => {
        const result = res.companycategory_new;
        let message = '';
        if (!result.error) {
          message = 'Add category successfully';
          this.modal.close();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
    } else {
      this.categoryNameError = true;
    }
  }

}
