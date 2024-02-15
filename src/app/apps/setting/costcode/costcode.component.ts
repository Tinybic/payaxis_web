import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  companycategory_deactivate,
  companycategory_list,
  companycategory_new,
  companycategory_update,
  companycostcode_activate,
  companycostcode_deactivate,
  companycostcode_importcsv,
  companycostcode_list,
  companycostcode_new,
  companycostcode_update,
} from 'src/app/core/gql/costcode';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { GlobalFunctionsService } from 'src/app/core/service/global-functions.service';

@Component({
  selector: 'app-costcode',
  templateUrl: './costcode.component.html',
  styleUrls: ['./costcode.component.scss'],
})
export class CostcodeComponent {
  @ViewChild('addcostcode') addcostcode: any;
  @ViewChild('deletecostcode') deletecostcode: any;
  @ViewChild('vendorListmodal') vendorListmodal: any;
  showArchived = true;
  loading = true;
  keywords = '';
  direction = '';
  sortColumn = '';
  costcodelist = [];
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

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private globalFuns: GlobalFunctionsService
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
    this.costcode.idCompany = parseInt(localStorage.getItem('idcompany'));
    if (this.costcode.idCompany != 0) {
      this.apolloService
        .query(companycostcode_list, { idCompany: this.costcode.idCompany })
        .then((res) => {
          const result = res.companycostcode_list;
          if (!result.error) {
            this.costcodelist = result.data;
          }
          this.loading = false;
        });
    }
  }

  SetClass(event) {
    this.costcode.category = event.txtName;
    this.costcode.idCategory = event.id;
    this.costcodeError.idCategory = false;
  }

  onSort(column) {
    this.sortColumn = column;
    const result = this.globalFuns.onSort(
      this.costcodelist,
      this.sortColumn,
      this.direction
    );
    this.costcodelist = result.newArray;
    this.direction = result.direction;
  }

  filterTable = (costcode: any) => {
    let values = Object.values(costcode);
    return (
      values.some((v) =>
        v.toString().toLowerCase().includes(this.keywords.toLowerCase())
      ) &&
      (costcode.active || this.showArchived) &&
      (this.categoryFilter == 'All' || costcode.category == this.categoryFilter)
    );
  };

  categoryFilter = 'All';

  changeCategoryFilter(name) {
    this.categoryFilter = name;
  }

  openCategoryEditModal() {
    this.openAddModal('Category');
  }
  addmodalref;
  costcodeButtonText = '';

  openAddModal(text) {
    if (text) this.costcodeButtonText = text;
    else {
      this.costcodeButtonText = 'Create';
    }
    this.addmodalref = this.modalService.open(this.addcostcode, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530',
    });
    this.addmodalref.result.then(
      (res) => {
        this.getCostCodeCategoryList();
        this.getCostCodeList();
      },
      (dismiss) => {
        this.getCostCodeCategoryList();
        this.getCostCodeList();
      }
    );
  }

  deleteConfirmRef;
  deleteCostcodeIndex = 0;
  deleteCostcodeMessage = '';

  confirmDeleteCostCode(index, name, event) {
    this.deleteCostcodeIndex = index;
    this.deleteCostcodeMessage = name + ' Cost Code will be deleted.';
    this.deleteConfirmRef = this.modalService.open(this.deletecostcode, {
      backdrop: 'static',
      size: '530',
      centered: true,
    });
    event.stopPropagation();
  }

  deleteCostCode() {
    this.apolloService
      .mutate(companycostcode_deactivate, {
        idCompany: this.costcode.idCompany,
        idCompany_costcode: this.costcodelist[this.deleteCostcodeIndex].id,
        revision: this.costcodelist[this.deleteCostcodeIndex].revision,
      })
      .then((res) => {
        const result = res.companycostcode_deactivate;
        let message = '';
        if (!result.error) {
          message = 'Cost Code have been deleted';
          this.deleteConfirmRef.close();
          this.getCostCodeList();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }
  modalData;
  updateCostCode(item) {
    this.modalData = item;
    this.openAddModal('Save changes');
  }

  activeCostCode(item) {
    this.apolloService
      .mutate(companycostcode_activate, {
        idCompany: this.costcode.idCompany,
        idCompany_costcode: item.id,
        revision: item.revision,
      })
      .then((res) => {
        const result = res.companycostcode_activate;
        let message = '';
        if (!result.error) {
          message = 'Cost Code was restored';
          this.getCostCodeList();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }

  importCostCodeFromCSV(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    let that = this;
    reader.onload = function () {
      that.apolloService
        .mutate(companycostcode_importcsv, {
          idCompany: that.costcode.idCompany,
          dataCSV: this.result,
        })
        .then((res) => {
          const result = res.companycostcode_importcsv;
          let message = '';
          if (!result.error) {
            message = 'Upload successful';
          } else {
            message = result.message;
          }
          that.toastrService.info(message, '');
          that.getCostCodeList();
        });
    };
  }

  vendorlist = [];
  vendorlistmodalref;
  costcodeName = '';
  openVendorList(costcode, name) {
    if (parseInt(localStorage.getItem('idcompany')) != 0) {
      this.apolloService
        .query(vendor_list, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
          costCode: costcode,
        })
        .then((res) => {
          const result = res.vendor_list;
          if (!result.error) {
            this.vendorlist = result.data;
            this.costcodeName = name;
            this.vendorlistmodalref = this.modalService.open(
              this.vendorListmodal,
              {
                backdrop: 'static',
                modalDialogClass: 'modal-right',
                size: '483',
              }
            );
          }
          this.loading = false;
        });
    }
  }
}
