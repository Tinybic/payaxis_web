import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'src/app/core/base';
import {
  projectinvoice_deactivate,
  projectinvoice_list,
} from 'src/app/core/gql/invoice';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-invoicelist',
  templateUrl: './invoicelist.component.html',
  styleUrls: ['./invoicelist.component.scss'],
})
export class InvoicelistComponent extends Base {
  @ViewChild('uploadInvoice') uploadInvoice: NgbModalRef;
  @ViewChild('mappingAttachments') mappingAttachments: NgbModalRef;
  
  keywords = '';
  filterList = [];
  invoiceList = [];
  INVOICELIST = [];
  loading = true;
  direction = 'asc';
  sortColumn = '';
  groupByStatusCount =[];
  
  uploadInvoiceRef: NgbModalRef;
  mappingAttachementsParams;
  mappingAttachmentsRef: NgbModalRef;
  
  objectKeys = Object.keys;
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getInvoiceList();
  }

  getInvoiceList() {
    if (parseInt(localStorage.getItem('idcompany')) != 0) {
      this.apolloService
        .query(projectinvoice_list, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
          idProject: 0,
          idVendor: 0,
        })
        .then((res) => {
          const result = res.projectinvoice_list;

          if (!result.error) {
            this.invoiceList = result.data;
            this.INVOICELIST = JSON.parse(JSON.stringify(result.data));
            this.groupByStatus();
          }
          this.loading = false;
        });
    }
  }
  
  // 根据 status 对 this.invoiceList 进行分组
  groupByStatus() {
    this.groupByStatusCount = this.invoiceList.reduce((acc, cur) => {
      const status = cur.status.toLowerCase();
      acc[status] = acc[status] || [];
      acc[status].push(cur);
      return acc;
    }, {});
  }

  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  onSort(column) {
    this.sortColumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.invoiceList = [...this.invoiceList].sort((a, b) => {
      const res = this.compare(a[this.sortColumn], b[this.sortColumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }

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
    this.invoiceList = JSON.parse(JSON.stringify(this.INVOICELIST));

    if (this.filterList.length > 0 && this.filterList.length < 5)
      this.invoiceList = this.invoiceList.filter((item) =>
        this.filterList.includes(item.status.toLowerCase())
      );
  }

  filterTable = (invoice: any) => {
    let values = Object.values(invoice);
    
    return values.some(
      (v: any) =>
        v.toString().toLowerCase().includes(this.keywords.toLowerCase())
    );
  };

  invoiceArchive(id, revision) {
    this.apolloService
      .mutate(projectinvoice_deactivate, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: id,
        revision: revision,
      })
      .then((res) => {
        const result = res.projectinvoice_deactivate;
        this.toastrService.info(result.message, '');
        if (!result.error) this.getInvoiceList();
      });
  }

  uploadInvoices() {
    this.uploadInvoiceRef = this.modalService.open(this.uploadInvoice, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530',
    })
    this.uploadInvoiceRef.result.then((res)=>{
      this.openMappingAttachments(res);
    }, (dismiss) => {
    
    })
  }
  
  
  openMappingAttachments(invoice) {
    this.mappingAttachementsParams = invoice;
    this.mappingAttachmentsRef = this.modalService.open(this.mappingAttachments, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '720',
      centered: true,
    });
    
    this.mappingAttachmentsRef.result.then(
      (res) => {
        this.getInvoiceList();
      },
      (dismiss) => {
      }
    );
  }
  
}
