import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  companycategory_deactivate,
  companycategory_list,
  companycategory_new,
  companycategory_update,
  companycostcode_deactivate,
  companycostcode_list,
  companycostcode_new,
  companycostcode_update,
} from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-costcode',
  templateUrl: './costcode.component.html',
  styleUrls: ['./costcode.component.scss'],
})
export class CostcodeComponent {
  @ViewChild('addcostcode') addcostcode: any;
  @ViewChild('categorylist') categorylist: any;
  @ViewChild('addcategory') addcategory: any;
  @ViewChild('deletecategory') deletecategory: any;
  @ViewChild('deletecostcode') deletecostcode: any;
  @ViewChild('cancelcostcode') cancelcostcode: any;
  @ViewChild('cancelcategory') cancelcategory: any;

  keywords = '';
  direction = '';
  sortCloumn = '';
  costcodelist = [];
  costcode = {
    id: 0,
    costCode: '',
    txtName: '',
    txtNotes: '',
    category: '',
    idCompany: 0,
    idcategory: 0,
    revision: 0,
  };
  costCodeCategoryList = [];
  costCodeCateGoryNewList = [];

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCostCodeCategoryList();
    this.getCostCodeList();
  }

  getCostCodeCategoryList() {
    this.costcode.idCompany = parseInt(localStorage.getItem('idcompany'));
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

  getCostCodeList() {
    if (this.costcode.idCompany != 0) {
      this.apolloService
        .query(companycostcode_list, { idCompany: this.costcode.idCompany })
        .then((res) => {
          const result = res.companycostcode_list;
          if (!result.error) {
            this.costcodelist = result.data;
          }
        });
    }
  }

  SetClass(event) {
    this.costcode.category = event.txtName;
    this.costcode.idcategory = event.id;
  }

  onSort(event) {}
  searchTable() {}

  categoryListRef;
  openCategoryEditModal() {
    this.categoryListRef = this.modalService.open(this.categorylist, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
  }

  categoryAddref;
  openCategoryAddModal() {
    this.categoryAddref = this.modalService.open(this.addcategory, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
  }

  modifyCostCodeCategory(index) {
    if (this.costCodeCategoryList[index].id > 0) {
      this.costCodeCategoryList[index].edit = true;
    }
  }
  cancelModifyCostCodeCategory(index) {
    this.costCodeCategoryList[index].edit = false;
  }

  updateCostCodeCategory(index) {
    this.apolloService
      .mutate(companycategory_update, {
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
        this.toastrService.info(message, '');
      });
  }

  costcodeCategoryName = '';

  createCostCodeCategory() {
    this.costCodeCategoryList.push({
      id: 0,
      txtName: this.costcodeCategoryName,
      costcodecount: 0,
    });
    this.costCodeCateGoryNewList.push({ txtName: this.costcodeCategoryName });
    this.costcodeCategoryName = '';
    this.categoryAddref.close();
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
    } else {
      this.apolloService
        .mutate(companycategory_deactivate, {
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
            this.costCodeCategoryList.splice(this.deleteCategoryIndex, 1);
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
        });
    }
  }

  saveCostCodeCategory() {
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
          this.getCostCodeCategoryList();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }

  cancelCostCodeCategoryRef;
  openCancelCategory() {
    if (this.costCodeCateGoryNewList.length == 0) {
      this.categoryListRef.close();
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
    this.cancelCostCodeCategoryRef.close();
    this.categoryListRef.close();
  }

  SaveCancelCategory() {
    this.cancelCostCodeCategoryRef.close();
    this.saveCostCodeCategory();
  }

  addmodalref;
  costcodeButtonText = 'Create';
  openAddModal() {
    this.addmodalref = this.modalService.open(this.addcostcode, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
    this.costcodeButtonText = 'Create';
  }

  createCostCode() {
    if (this.costcode.id == 0) {
      this.apolloService
        .mutate(companycostcode_new, {
          idCompany: this.costcode.idCompany,
          costCode: this.costcode.costCode,
          txtName: this.costcode.txtName,
          idcategory: this.costcode.idcategory,
          txtNotes: this.costcode.txtNotes,
        })
        .then((res) => {
          const result = res.companycostcode_new;
          let message = '';
          if (!result.error) {
            message = 'Cost Code created successfully';
            this.getCostCodeList();
            this.addmodalref.close();
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
        });
    } else {
      this.apolloService
        .mutate(companycostcode_update, {
          id: this.costcode.id,
          revision: this.costcode.revision,
          txtName: this.costcode.txtName,
          idcategory: this.costcode.idcategory,
          txtNotes: this.costcode.txtNotes,
        })
        .then((res) => {
          const result = res.companycostcode_update;
          let message = '';
          if (!result.error) {
            message = 'Cost Code update successfully';
            this.costcode.id = 0;
            this.getCostCodeList();
            this.addmodalref.close();
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
        });
    }
  }

  deleteConfirmRef;
  deleteCostcodeIndex = 0;
  deleteCostcodeMessage = '';
  confirmDeleteCostCode(index, name) {
    this.deleteCostcodeIndex = index;
    this.deleteCostcodeMessage = name + ' Cost Code will be deleted.';
    this.deleteConfirmRef = this.modalService.open(this.deletecostcode, {
      size: '530',
      centered: true,
    });
  }

  deleteCostCode() {
    this.apolloService
      .mutate(companycostcode_deactivate, {
        idCompany_costcode: this.costcodelist[this.deleteCostcodeIndex].id,
        revision: this.costcodelist[this.deleteCostcodeIndex].revision,
      })
      .then((res) => {
        const result = res.companycostcode_deactivate;
        let message = '';
        if (!result.error) {
          message = 'Cost Code have been deleted';
          this.categoryDelref.close();
          this.costCodeCategoryList.splice(this.deleteCategoryIndex, 1);
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }

  costcodetemp = {
    txtName: '',
    category: '',
    idcategory: 0,
    revision: 0,
    txtNotes: '',
    costCode: '',
  };

  updateCostCode(item) {
    this.costcode.txtName = item.txtName;
    this.costcode.category = item.category;
    this.costcode.idcategory = item.idcategory;
    this.costcode.revision = item.revision;
    this.costcode.txtNotes = item.txtNotes;
    this.costcode.costCode = item.costCode;
    this.costcode.id = item.id;
    this.costcodeButtonText = 'Save changes';

    this.costcodetemp.txtName = item.txtName;
    this.costcodetemp.category = item.category;
    this.costcodetemp.idcategory = item.idcategory;
    this.costcodetemp.revision = item.revision;
    this.costcodetemp.txtNotes = item.txtNotes;
    this.costcodetemp.costCode = item.costCode;
    this.openAddModal();
  }

  cancelCostCodeRef;
  openCancelCostCode() {
    console.log();
    if (
      (this.costcode.id == 0 &&
        this.costcode.txtName.length == 0 &&
        this.costcode.costCode.length == 0) ||
      (this.costcode.id > 0 &&
        this.costcodetemp.txtName == this.costcode.txtName &&
        this.costcodetemp.category == this.costcode.category &&
        this.costcodetemp.idcategory == this.costcode.idcategory &&
        this.costcodetemp.txtNotes == this.costcode.txtNotes &&
        this.costcodetemp.costCode == this.costcode.costCode)
    ) {
      this.addmodalref.close();
    } else {
      this.cancelCostCodeRef = this.modalService.open(this.cancelcostcode, {
        size: '530',
        centered: true,
      });
    }
  }

  cancelCostCode() {
    this.cancelCostCodeRef.close();
  }

  closeCancelCostCode() {
    this.cancelCostCodeRef.close();
    this.addmodalref.close();
  }

  SaveCancelCostCode() {
    this.cancelCostCodeRef.close();
    this.createCostCode();
  }
}
