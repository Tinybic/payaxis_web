import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { projectorder_related } from 'src/app/core/gql/order';
import { ApolloService } from 'src/app/core/service/apollo.service';

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
  @Input() params;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.params.idvendor > 0) {
      this.getVendorOrderList();
    } else {
      this.loading = false;
    }
  }

  getVendorOrderList() {
    this.apolloService
      .query(projectorder_related, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProject: 0,
        idVednor: this.params.idvendor,
        paidyn: false,
      })
      .then((res) => {
        const result = res.projectorder_related;
        if (!result.error) {
          this.orders = result.data;
          this.ORDERS = JSON.parse(JSON.stringify(result.data));
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
}
