import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { projectorder_related } from 'src/app/core/gql/order';
import { receivable_list } from 'src/app/core/gql/receivables';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-vendor-order',
  templateUrl: './vendor-order.component.html',
  styleUrls: ['./vendor-order.component.scss'],
})
export class VendorOrderComponent {
  @ViewChild('addOrderModal') addOrderModal: any;
  
  orders = [];
  ORDERS = [];
  sortColumn = '';
  direction = '';
  loading = true;
  keywords = '';
  bgColors = [];
  ordersStatusCount = {
    Draft: 0,
    Pending: 0,
    Accepted: 0,
    Paid: 0,
    Partial: 0,
    Declined: 0,
    Voided: 0,
  };
  objectKeys = Object.keys;
  @Input() params;
  @Input() tab;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (this.params.idvendor > 0) {
      this.getVendorOrderList();
    } else {
      this.loading = false;
    }
  }
  
  
  getStatusCount() {
    let ordersStatusCount = {
      Draft: 0,
      Pending: 0,
      Accepted: 0,
      Paid: 0,
      Partial: 0,
      Declined: 0,
      Voided: 0,
    };
    this.ORDERS.map((order) => {
      ordersStatusCount[order.status]++;
    });
    
    this.ordersStatusCount = ordersStatusCount;
  }

  getVendorOrderList() {
    this.apolloService
      .query(this.tab == 3 ? projectorder_related : receivable_list, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        idProject: 0,
        idVendor: this.params.idvendor,
        paidyn: false,
      })
      .then((res) => {
        const result = this.tab == 3 ? res.projectorder_related : res.receivable_list;
        if (!result.error) {
          this.orders = result.data;
          this.ORDERS = JSON.parse(JSON.stringify(result.data));
          this.getStatusCount();
        }
        this.loading = false;
      });
  }

  onSort(sortColumn) {}

  openDetail(id) {

  }

  filterTable = (vendor: any) => {
    let values = Object.values(vendor);
    return values.some(
      (v) =>
        vendor.orderNumber.toString().includes(this.keywords.toLowerCase()) ||
        vendor.invoiceNumber.includes(this.keywords.toLowerCase())
    );
  };

  addOrderRef;
  idorder = 0;
  AddOrder(id){
    this.idorder = id;
    this.addOrderRef = this.modalService.open(this.addOrderModal,{
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true,
    })

    this.addOrderRef.result.then(
      (res) => {
        this.getVendorOrderList();
      },
      (dismiss) => {
        this.getVendorOrderList();
      }
    );
  }

  cancel(){
    this.addOrderRef.close();
  }

  filterList = [];
  filterVendorList(item) {
    if (!this.filterList.includes(item)) {
      this.filterList.push(item);
    } else {
      for (let i = 0; i < this.filterList.length; i++) {
        if (item == this.filterList[i]) {
          this.filterList.splice(i, 1);
          break;
        }
      }
    }
    this.orders = JSON.parse(JSON.stringify(this.ORDERS));

    if (this.filterList.length > 0)
      this.orders = this.orders.filter((item) =>
        this.filterList.includes(item.status.toLowerCase())
      );
  }
}
