import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'src/app/core/base';
import {
  project_vendors,
  quickbooks_downloadvendors,
} from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from "@angular/router";
import { GlobalFunctionsService } from 'src/app/core/service/global-functions.service';

@Component({
  selector: 'app-project-vendor',
  templateUrl: './project-vendor.component.html',
  styleUrls: ['./project-vendor.component.scss'],
})
export class ProjectVendorComponent extends Base {
  @ViewChild('inviteVendor') inviteVendor: any;
  @ViewChild('addVendor') addVendor: any;
  
  idProject=0;
  keywords = '';
  direction = '';
  sortColumn = '';
  vendorlist = [];
  VENDOR_LIST = [];
  idvendor = 0;
  loading = true;
  canEdit = false;

  canImport = false;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private globalFuns: GlobalFunctionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.canEdit = super.setRole('Edit Vendors');
    if (this.localStorage.getItem('idcompany')) {
      this.canImport = super.setRole('Sync with accounting software');
      this.activatedRoute.params.subscribe((params) => {
        this.idProject = parseInt(params['id']);
        this.getVendorList();
      });
    } else {
      this.loading = false;
    }
  }

  getVendorList() {
    if (parseInt(this.localStorage.getItem('idcompany')) != 0) {
      this.apolloService
        .query(project_vendors, {
          idCompany: parseInt(this.localStorage.getItem('idcompany')),
          idProject: this.idProject,
        })
        .then((res) => {
          const result = res.project_vendors;

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
    this.sortColumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.vendorlist = [...this.vendorlist].sort((a, b) => {
      const res = this.compare(a[this.sortColumn], b[this.sortColumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }
  modalRef;
  openAddModal() {
    this.idvendor = 0;
    this.modalRef = this.modalService.open(this.addVendor, {
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
      this.modalRef = this.modalService.open(this.addVendor, {
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
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
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

  inviteVendorRef;
  inviteVendorModal() {
    this.inviteVendorRef = this.modalService.open(this.inviteVendor, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530',
    });

    this.inviteVendorRef.result.then(
      (res) => {
        this.getVendorList();
      },
      (dismiss) => {
        this.getVendorList();
      }
    );
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
    this.vendorlist = JSON.parse(JSON.stringify(this.VENDOR_LIST));

    if (this.filterList.length > 0)
      this.vendorlist = this.vendorlist.filter((item) =>
        this.filterList.includes(item.status.toLowerCase())
      );
  }
  
  protected readonly globalFunc = this.globalFuns;
}
