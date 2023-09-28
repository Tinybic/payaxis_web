import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'src/app/core/base';
import {
  quickbooks_downloadvendors,
  vendor_list,
} from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.scss'],
})
export class VendorlistComponent extends Base {
  @ViewChild('inviteVendor') inviteVendor: any;

  keywords = '';
  direction = '';
  sortCloumn = '';
  vendorlist = [];
  VENDOR_LIST = [];
  idvendor = 0;
  loading = true;
  canEdit = false;

  canImport = false;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.canEdit = super.setRole('Edit Vendors');
    this.canImport = super.setRole('Sync with accounting software');
    this.getVendorList();
  }

  getVendorList() {
    if (parseInt(localStorage.getItem('idcompany')) != 0) {
      this.apolloService
        .query(vendor_list, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
        })
        .then((res) => {
          const result = res.vendor_list;

          if (!result.error) {
            this.vendorlist = result.data;
            this.VENDOR_LIST = JSON.parse(JSON.stringify(result.data));
          }
          this.loading = false;
        });
    }
  }

  filterTable = (vendor: any) => {
    let values = Object.values(vendor);
    return values.some((v) =>
      vendor.vendorName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  };

  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  onSort(column) {
    this.sortCloumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.vendorlist = [...this.vendorlist].sort((a, b) => {
      const res = this.compare(a[this.sortCloumn], b[this.sortCloumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }
  modalRef;
  openAddModal() {
    this.idvendor = 0;
    this.modalRef = this.modalService.open(this.inviteVendor, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true,
    });

    this.modalRef.result.then(
      (res) => {
        this.getVendorList();
      },
      (dismiss) => {
        this.getVendorList();
      }
    );
  }

  openEditModal(id) {
    if (this.canEdit) {
      this.idvendor = id;
      this.modalRef = this.modalService.open(this.inviteVendor, {
        backdrop: 'static',
        modalDialogClass: 'modal-right',
        size: '90vw',
        centered: true,
      });

      this.modalRef.result.then(
        (res) => {
          this.getVendorList();
        },
        (dismiss) => {
          this.getVendorList();
        }
      );
    }
  }

  getQuickboosVendors(realmid, redirectUri, url) {
    this.loading = true;
    this.apolloService
      .mutate(quickbooks_downloadvendors, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        realmid: realmid,
        redirectUri: redirectUri,
        url: url,
      })
      .then((res) => {
        const result = res.quickbooks_downloadvendors;
        let message = '';
        if (!result.error) {
          message = 'Sync successful';
          this.getVendorList();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }

  getQueryString(name, url) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }

  importFromQB() {
    var parameters = 'location=1,width=800,height=650';
    parameters +=
      ',left=' + (screen.width - 800) / 2 + ',top=' + (screen.height - 650) / 2;
    const backurl = environment.baseUrl + '/apps/vendor';
    var win = window.open(
      'https://appcenter.intuit.com/app/connect/oauth2?client_id=' +
        environment.intuitKey +
        '&redirect_uri=' +
        backurl +
        '&response_type=code&scope=com.intuit.quickbooks.accounting&state=testState',
      'connectPopup',
      parameters
    );
    let that = this;
    var pollOAuth = window.setInterval(function () {
      try {
        if (win.document.URL.indexOf('code') != -1) {
          let realmid = that.getQueryString('realmid', win.document.URL);
          that.getQuickboosVendors(
            realmid,
            backurl,
            win.document.URL.replace(environment.baseUrl, '')
          );
          window.clearInterval(pollOAuth);
          win.close();
        } else if (win.document.URL.indexOf('error=access_denied') != -1) {
          that.toastrService.info(
            'Authorization is required, please try again',
            ''
          );
          window.clearInterval(pollOAuth);
          win.close();
        }
      } catch (e) {
        console.log(e);
      }
    }, 100);
  }
}
