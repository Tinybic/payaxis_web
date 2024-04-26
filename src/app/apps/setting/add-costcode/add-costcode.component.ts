import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  companycategory_deactivate,
  companycategory_list,
  companycategory_new,
  companycategory_update,
  companycostcode_new,
  companycostcode_update,
} from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { GlobalFunctionsService } from 'src/app/core/service/global-functions.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-add-costcode',
  templateUrl: './add-costcode.component.html',
  styleUrls: ['./add-costcode.component.scss'],
})
export class AddCostcodeComponent {
  @ViewChild('categorylist') categorylist: any;
  @ViewChild('addcategory') addcategory: any;
  @ViewChild('deletecategory') deletecategory: any;
  @ViewChild('cancelcostcode') cancelcostcode: any;
  @ViewChild('cancelcategory') cancelcategory: any;
  @Input() modalRef: any;
  @Input() type: any;
  @Input() data?: any;
  costcode = {
    id: 0,
    costCode: '',
    txtName: '',
    txtNotes: '',
    category: '',
    idCompany: 0,
    idCategory: 0,
    revision: 0,
  };
  costcodeError = {
    costCode: false,
    txtName: false,
    idCategory: false,
  };
  costCodeCategoryList = [];
  costCodeCateGoryNewList = [];
  isEditingCategoryName = '';

  addmodalref;
  costcodeButtonText='Create';
  codeEdit = false;
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private globalFuns: GlobalFunctionsService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getCostCodeCategoryList();
    this.addmodalref = this.modalRef;
    if (this.type == 'Category') {
      setTimeout(() => {
        this.openCategoryEditModal();
      }, 30);
    } else if (this.type) this.costcodeButtonText = this.type;
    else {
      this.costcodeButtonText = 'Create';
    }
    if (this.data) {
      this.costcode.txtName = this.data.txtName;
      this.costcode.category = this.data.category;
      this.costcode.idCategory = this.data.idCategory;
      this.costcode.revision = this.data.revision;
      this.costcode.txtNotes = this.data.txtNotes;
      this.costcode.costCode = this.data.costCode;
      this.costcode.id = this.data.id;

      this.costcodetemp.txtName = this.data.txtName;
      this.costcodetemp.category = this.data.category;
      this.costcodetemp.idCategory = this.data.idCategory;
      this.costcodetemp.revision = this.data.revision;
      this.costcodetemp.txtNotes = this.data.txtNotes;
      this.costcodetemp.costCode = this.data.costCode;

      this.codeEdit = true;
    }
    else{
      this.costcode = {
        id: 0,
        costCode: '',
        txtName: '',
        txtNotes: '',
        category: '',
        idCompany: 0,
        idCategory: 0,
        revision: 0,
      };
    }
  }

  getCostCodeCategoryList() {
    this.costcode.idCompany = parseInt(this.localStorage.getItem('idcompany'));
    if (this.costcode.idCompany != 0) {
      this.apolloService
        .query(companycategory_list, { idCompany: this.costcode.idCompany })
        .then((res) => {
          const result = res.companycategory_list;
          if (!result.error) {
            this.costCodeCategoryList = result.data;
          }
        });
    }
  }

  SetClass(event) {
    this.costcode.category = event.txtName;
    this.costcode.idCategory = event.id;
    this.costcodeError.idCategory = false;
  }

  categoryListRef;

  openCategoryEditModal() {
    this.getCostCodeCategoryList();
    this.categoryListRef = this.modalService.open(this.categorylist, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
  }

  categoryAddref;

  openCategoryAddModal() {
    this.costcodeCategoryNameError = false;
    this.categoryAddref = this.modalService.open(this.addcategory, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
    this.costcodeCategoryName = '';
  }

  modifyCostCodeCategory(index) {
    if (
      this.costCodeCategoryList[index].id > 0 &&
      this.costCodeCategoryList[index].txtName != 'Others'
    ) {
      this.costCodeCategoryList[index].edit = true;
      this.isEditingCategoryName = this.costCodeCategoryList[index].txtName;
    }
  }

  cancelModifyCostCodeCategory(index) {
    this.costCodeCategoryList[index].edit = false;
    this.costCodeCategoryList[index].txtName = this.isEditingCategoryName;
  }

  updateCostCodeCategory(index) {
    if (
      this.costCodeCategoryList[index].txtName.toLocaleLowerCase() != 'others'
    ) {
      this.apolloService
        .mutate(companycategory_update, {
          idCompany: this.costcode.idCompany,
          id: this.costCodeCategoryList[index].id,
          revision: this.costCodeCategoryList[index].revision,
          txtName: this.costCodeCategoryList[index].txtName,
        })
        .then((res) => {
          const result = res.companycategory_update;
          let message = '';
          if (!result.error) {
            message = 'Category have been updated';
            this.costCodeCategoryList[index].edit = false;
          } else {
            message = result.message;
          }
          this.getCostCodeCategoryList();
          this.toastrService.info(message, '');
        });
    } else {
      this.toastrService.info(
        "Category cannot be named '" +
          this.costCodeCategoryList[index].txtName +
          "'"
      );
    }
  }

  checkCategoryExist(name) {
    for (let i = 0; i < this.costCodeCategoryList.length; i++) {
      if (this.costCodeCategoryList[i].txtName == name) {
        return false;
      }
    }
    return true;
  }

  costcodeCategoryName = '';
  costcodeCategoryNameError = false;

  createCostCodeCategory() {
    if (
      this.costcodeCategoryName.toLocaleLowerCase() != 'others' &&
      this.checkCategoryExist(this.costcodeCategoryName)
    ) {
      this.apolloService
        .mutate(companycategory_new, {
          idCompany: this.costcode.idCompany,
          txtName: this.costcodeCategoryName,
        })
        .then((res) => {
          const result = res.companycategory_new;
          let message = '';
          if (!result.error) {
            message = 'Categories changed successfully';
            this.categoryAddref.close();
          } else {
            message = result.message;
          }
          this.getCostCodeCategoryList();
          this.toastrService.info(message, '');
        });
    } else {
      this.costcodeCategoryNameError = true;
    }
  }

  deleteFromCategoryNewList(name) {
    for (let i = 0; i < this.costCodeCateGoryNewList.length; i++) {
      if (this.costCodeCateGoryNewList[i].txtName == name) {
        this.costCodeCateGoryNewList.splice(i, 1);
        break;
      }
    }
  }

  categoryDelref;
  deleteCategoryMessage = '';
  deleteCategoryIndex = 0;
  deleteCategoryName = '';

  confirmDeleteCostCodeCategory(index, name, number) {
    if (this.costCodeCategoryList[index].costcodecount == 0) {
      this.deleteCategoryMessage = name + ' Category will be deleted.';
    } else {
      this.deleteCategoryMessage =
        name +
        ' Category will be archived. ' +
        number +
        ' Cost Codes assigned to this Category will be transfered to Others Category.';
    }
    this.deleteCategoryIndex = index;
    this.deleteCategoryName = name;
    this.categoryDelref = this.modalService.open(this.deletecategory, {
      size: '530',
      centered: true,
    });
  }

  deleteCostCodeCategory() {
    if (this.costCodeCategoryList[this.deleteCategoryIndex].id == 0) {
      this.costCodeCategoryList.splice(this.deleteCategoryIndex, 1);
      this.deleteFromCategoryNewList(this.deleteCategoryName);
      this.categoryDelref.close();
    } else {
      this.apolloService
        .mutate(companycategory_deactivate, {
          idCompany: this.costcode.idCompany,
          idCompany_category:
            this.costCodeCategoryList[this.deleteCategoryIndex].id,
          revision:
            this.costCodeCategoryList[this.deleteCategoryIndex].revision,
        })
        .then((res) => {
          const result = res.companycategory_deactivate;
          let message = '';
          if (!result.error) {
            message = 'Category have been deleted';
            this.categoryDelref.close();
            this.getCostCodeCategoryList();
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
        });
    }
  }

  saveCostCodeCategory() {
    if (this.costCodeCateGoryNewList.length > 0) {
      this.apolloService
        .mutate(companycategory_new, {
          idCompany: this.costcode.idCompany,
          companycategories: this.costCodeCateGoryNewList,
        })
        .then((res) => {
          const result = res.companycategory_new;
          let message = '';
          if (!result.error) {
            message = 'Categories changed successfully';
            this.costCodeCateGoryNewList = [];
            this.categoryListRef.close();
            this.getCostCodeCategoryList();
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
        });
    } else {
      this.categoryListRef.close();
    }
  }

  cancelCostCodeCategoryRef;

  openCancelCategory() {
    if (this.costCodeCateGoryNewList.length == 0) {
      this.categoryListRef.close();
      this.getCostCodeCategoryList();
    } else {
      this.cancelCostCodeCategoryRef = this.modalService.open(
        this.cancelcategory,
        {
          size: '530',
          centered: true,
        }
      );
    }
  }

  cancelCategory() {
    this.cancelCostCodeCategoryRef.close();
  }

  closeCancelCategory() {
    this.costCodeCateGoryNewList = [];
    this.getCostCodeCategoryList();
    this.cancelCostCodeCategoryRef.close();
    this.categoryListRef.close();
  }

  SaveCancelCategory() {
    this.cancelCostCodeCategoryRef.close();
    this.saveCostCodeCategory();
  }

  createCostCode() {
    this.costcodeError = {
      costCode: false,
      txtName: false,
      idCategory: false,
    };

    if (this.costcode.txtName.trim().length == 0) {
      this.costcodeError.txtName = true;
      return;
    }
    if (this.costcode.costCode.trim().length == 0) {
      this.costcodeError.costCode = true;
      return;
    }
    if (this.costcode.idCategory == 0 && this.costcode.category != 'Others') {
      this.costcodeError.idCategory = true;
      return;
    }

    if (this.costcode.id == 0) {
      this.apolloService
        .mutate(companycostcode_new, {
          idCompany: this.costcode.idCompany,
          costCode: this.costcode.costCode,
          txtName: this.costcode.txtName,
          idCategory: this.costcode.idCategory,
          txtNotes: this.costcode.txtNotes,
        })
        .then((res) => {
          const result = res.companycostcode_new;
          let message = '';
          if (!result.error) {
            message = 'Cost Code created successfully';
            this.addmodalref.close();
          } else {
            message = result.message;
          }
          this.clearCostcode();
          this.getCostCodeCategoryList();
          this.toastrService.info(message, '');
        });
    } else {
      this.apolloService
        .mutate(companycostcode_update, {
          idCompany: this.costcode.idCompany,
          id: this.costcode.id,
          revision: this.costcode.revision,
          txtName: this.costcode.txtName,
          idCategory: this.costcode.idCategory,
          txtNotes: this.costcode.txtNotes,
        })
        .then((res) => {
          const result = res.companycostcode_update;
          let message = '';
          if (!result.error) {
            message = 'Cost Code update successfully';
            this.costcode.id = 0;
            this.clearCostcode();
            this.getCostCodeCategoryList();
            this.addmodalref.close();
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
        });
    }
  }
  costcodetemp = {
    txtName: '',
    category: '',
    idCategory: 0,
    revision: 0,
    txtNotes: '',
    costCode: '',
  };


  // updateCostCode(item) {
  //   this.costcode.txtName = item.txtName;
  //   this.costcode.category = item.category;
  //   this.costcode.idCategory = item.idCategory;
  //   this.costcode.revision = item.revision;
  //   this.costcode.txtNotes = item.txtNotes;
  //   this.costcode.costCode = item.costCode;
  //   this.costcode.id = item.id;

  //   this.costcodetemp.txtName = item.txtName;
  //   this.costcodetemp.category = item.category;
  //   this.costcodetemp.idCategory = item.idCategory;
  //   this.costcodetemp.revision = item.revision;
  //   this.costcodetemp.txtNotes = item.txtNotes;
  //   this.costcodetemp.costCode = item.costCode;
  //   //this.openAddModal('Save changes');
  // }

  cancelCostCodeRef;

  openCancelCostCode() {
    if (
      (this.costcode.id == 0 &&
        this.costcode.txtName.length == 0 &&
        this.costcode.costCode.length == 0) ||
      (this.costcode.id > 0 &&
        this.costcodetemp.txtName == this.costcode.txtName &&
        this.costcodetemp.category == this.costcode.category &&
        this.costcodetemp.idCategory == this.costcode.idCategory &&
        this.costcodetemp.txtNotes == this.costcode.txtNotes &&
        this.costcodetemp.costCode == this.costcode.costCode)
    ) {
      this.addmodalref.close();
      this.clearCostcode();
    } else {
      this.cancelCostCodeRef = this.modalService.open(this.cancelcostcode, {
        size: '530',
        centered: true,
      });
    }
  }

  clearCostcode() {
    this.costcode.id = 0;
    this.costcode.costCode = '';
    this.costcode.txtName = '';
    this.costcode.txtNotes = '';
    this.costcode.category = '';
    this.costcode.idCategory = 0;
    this.costcode.revision = 0;

    this.costcodeError = {
      costCode: false,
      txtName: false,
      idCategory: false,
    };
  }

  cancelCostCode() {
    this.cancelCostCodeRef.close();
  }

  closeCancelCostCode() {
    this.clearCostcode();

    this.cancelCostCodeRef.close();
    this.addmodalref.close();
  }

  SaveCancelCostCode() {
    this.cancelCostCodeRef.close();
    this.createCostCode();
  }
}
