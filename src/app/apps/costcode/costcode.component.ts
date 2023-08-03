import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApolloService } from 'src/app/core/service/apollo.service';
import {
  companycategory_list,
  companycostcode_new,
  companycostcode_list,
  companycostcode_importcsv,
} from 'src/app/core/gql/costcode';

@Component({
  selector: 'app-costcode',
  templateUrl: './costcode.component.html',
  styleUrls: ['./costcode.component.scss'],
})
export class CostcodeComponent {
  @ViewChild('addcostcode') addcostcode: any;
  tab1 = 4;

  costcode = {
    costCode: '',
    txtName: '',
    txtNotes: '',
    category: '',
    idCompany: 0,
  };
  costCodeClassList = [];
  costCodeList = [];

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCostCodeClassList();
    this.getCostCodeList();
  }

  getCostCodeClassList() {
    this.costcode.idCompany = parseInt(localStorage.getItem('idcompany'));
    if (this.costcode.idCompany != 0) {
      this.apolloService
        .query(companycategory_list, { idCompany: this.costcode.idCompany })
        .then((res) => {
          const result = res.companycategory_list;
          if (!result.error) {
            this.costCodeClassList = result.data;
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
            this.costCodeList = result.data;
          }
        });
    }
  }

  SetClass(event) {
    this.costcode.category = event.txtName;
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true,
    });
  }

  add() {
    this.openVerticallyCentered(this.addcostcode);
  }

  createCostCode() {
    this.apolloService
      .mutate(companycostcode_new, this.costcode)
      .then((res) => {
        const result = res.companycostcode_new;
        let message = '';
          if (!result.error) {
            message = 'Create successful';
          } else {
            message = result.message;
          }
          this.toastrService.info(message, '');
          this.getCostCodeList();
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
}
