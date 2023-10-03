import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { paymentTerms } from 'src/app/core/constants/payment';
import { categorycostcode_list } from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent {
  @ViewChild('listitem', { static: true }) listitem: ElementRef;
  tabs1 = 1;
  reasonList = [];
  paymentTermsList = paymentTerms;
  order = {
    idCompany: 0,
    number: '',
    paymentTerms: '',
    invoiceNumber: '',
    vendorcostcodes: [],
    listItem: [],
    reason: '',
  };

  orderError = {
    idCompany: 0,
    number: '',
    paymentTerms: '',
    invoiceNumber: '',
    vendorcostcodes: [],
    reason: '',
  };
  keywords = '';
  costCodeList = [];
  COSTCODE_LIST = [];
  vendorcostcodesText = '';
  sortCloumn = '';
  loading = false;
  direction = 'asc';

  projectList = [];



  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.paymentTermsList = paymentTerms;
    this.getCostCodeList();
  }

  getCostCodeList() {
    this.order.idCompany = parseInt(localStorage.getItem('idcompany'));
    if (this.order.idCompany != 0) {
      this.apolloService
        .query(categorycostcode_list, { idCompany: this.order.idCompany })
        .then((res) => {
          const result = res.categorycostcode_list;
          if (!result.error) {
            this.costCodeList = result.data;
            this.COSTCODE_LIST = JSON.parse(JSON.stringify(result.data));
          }
        });
    }
  }

  setCostCodeSelect(costcode) {
    let result = false;
    // this.vendor.vendorcostcodes.forEach((item) => {
    //   if (item.costCode == costcode) {
    //     result = true;
    //   }
    // });
    return result;
  }

  costCodeSelect(event, item) {
    if (event.currentTarget.checked) {
      this.vendorcostcodesText += item.txtName + ', ';
      this.order.vendorcostcodes.push({
        idCompany: this.order.idCompany,
        costCode: item.costCode,
      });
    } else {
      this.vendorcostcodesText = this.vendorcostcodesText.replace(
        item.txtName + ', ',
        ''
      );
      this.removeCostCode(item);
    }
  }

  removeCostCode(item) {
    for (let i = 0; i < this.order.vendorcostcodes.length; i++) {
      if (this.order.vendorcostcodes[i].costCode == item.costCode) {
        this.order.vendorcostcodes.splice(i, 1);
        break;
      }
    }
  }

  costCodeFilter() {
    this.costCodeList = JSON.parse(JSON.stringify(this.COSTCODE_LIST));
    console.log(this.keywords)
    console.log(this.COSTCODE_LIST)
    this.costCodeList = this.costCodeList.filter((costcode) => {
      costcode.costcodelist = costcode.costcodelist.filter((item) =>
        item.txtName.toLowerCase().includes(this.keywords.toLowerCase())
      );
      console.log(costcode.costcodelist)
      return costcode;
    });
   
  }

  onSort(columnName) {}

  AddListItem() {
    this.order.listItem.push({
      check: false,
      billable: '',
    });
  }
}
