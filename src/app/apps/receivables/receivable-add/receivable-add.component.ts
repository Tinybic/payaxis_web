import { formatDate } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PAYMENTTERM } from 'src/app/core/constants/payment';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import { projectorder_list } from 'src/app/core/gql/orders';
import { companypayment_list } from 'src/app/core/gql/payment';
import { companyproject_list } from 'src/app/core/gql/project';
import { projectpayment_new } from 'src/app/core/gql/receivables';
import { vendor_file_delete, vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-receivable-add',
  templateUrl: './receivable-add.component.html',
  styleUrls: ['./receivable-add.component.scss'],
})
export class ReceivableAddComponent {
  @Input() modalRef: any;
  @Input() id: number = 0;
  @ViewChild('deleteModal') deleteModal: any;
  paymentTermsList = PAYMENTTERM;
  PROJECTLIST = [];
  projectList = [];
  vendorList = [];
  VENDORLIST = [];
  projectGroupList = [];
  orderList = [];
  ORDERLIST = [];
  paymentList = [];
  txtError = {
    idVendor: 1,
  };
  format = 'yyyy-MM-dd';
  locale = 'en-US';

  myDate = new Date();

  projectpayment = {
    idCompany: 0,
    idProject: 0,
    idVendor: 0,
    idOrder1: 0,
    idCompany_payment: 0,
    billNumber: '',
    sentDate: formatDate(this.myDate, this.format, this.locale),
    dueDate: formatDate(
      this.myDate.setDate(this.myDate.getDate() + 30),
      this.format,
      this.locale
    ),
    paymentTerms: '30 Days',
    amount: 0.0,
    txtNotes: '',
    paymentfile: [],
  };

  amountEdit = false;
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.projectpayment.idCompany = parseInt(localStorage.getItem('idcompany'));
    this.getVendorList();
    this.getProjectList();
    this.getOrderList();
    this.getPaymentList();
  }

  editAmount(){
    this.amountEdit = true;
  }

  cancelAmount(){
    this.amountEdit = false;
  }

  groupBy(arr, key) {
    return arr.reduce((acc, curr) => {
      (acc[curr[key]] = acc[curr[key]] || []).push(curr);
      return acc;
    }, {});
  }

  getProjectList() {
    this.apolloService
      .query(companyproject_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.companyproject_list;
        if (!result.error) {
          this.PROJECTLIST = JSON.parse(JSON.stringify(result.data));
          this.projectList = this.groupBy(result.data, 'idGroup');
          for (let key in this.projectList) {
            this.projectGroupList.push(this.projectList[key]);
          }
        }
      });
  }

  getVendorList() {
    this.apolloService
      .query(vendor_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.vendor_list;
        if (!result.error) {
          this.vendorList = result.data;
          this.VENDORLIST = JSON.parse(JSON.stringify(this.vendorList));
        }
      });
  }

  getOrderList() {
    this.apolloService
      .query(projectorder_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProject: 0,
      })
      .then((res) => {
        const result = res.projectorder_list;
        if (!result.error) {
          this.orderList = result.data;
          this.ORDERLIST = JSON.parse(JSON.stringify(result.data));
        }
      });
  }

  payment = {
    account: '',
    bankName: '',
    id: 0,
  };
  getPaymentList() {
    this.apolloService
      .query(companypayment_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.companypayment_list;
        if (!result.error) {
          this.paymentList = result.data;
          this.paymentList.forEach((item) => {
            if (item.account.length > 4)
              item.account = item.account.substring(item.account.length - 4);
            if (item.defaultPay) {
              this.payment = item;
              this.projectpayment.idCompany_payment = item.id;
            }
          });
          if (!this.payment && this.paymentList.length > 0) {
            this.payment = this.paymentList[0];
            this.projectpayment.idCompany_payment = this.payment.id;
          }
        }
      });
  }

  selectPayment(item) {
    this.payment = item;
    this.projectpayment.idCompany_payment = item.id;
  }

  project: any;
  keywordsProject = '';
  selectProject(project) {
    this.project = project;
    this.projectpayment.idProject = project.id;
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    this.orderList = this.orderList.filter(
      (item) => item.idProject == project.id
    );
  }

  projectFilter() {
    this.projectList = JSON.parse(JSON.stringify(this.PROJECTLIST));
    this.projectList = this.projectList.filter((item) =>
      item.projectName
        .toLowerCase()
        .includes(this.keywordsProject.toLowerCase())
    );
    this.projectList = this.groupBy(this.projectList, 'idGroup');
    this.projectGroupList = [];
    for (let key in this.projectList) {
      this.projectGroupList.push(this.projectList[key]);
    }
  }

  removeProject() {
    this.project = null;
    this.projectpayment.idProject = 0;
  }

  order: any;
  keywordsOrder = '';
  selectOrder(order) {
    this.order = order;
    this.projectpayment.idOrder1 = order.id;
    if (!this.project) {
      this.project = { id: order.idProject, projectName: order.projectName };
      this.projectpayment.idProject = this.project.id;
    }
  }

  orderFilter() {
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    this.orderList = this.orderList.filter((item) =>
      item.projectName
        .toLowerCase()
        .includes(this.keywordsProject.toLowerCase())
    );
  }

  removOrder() {
    this.order = null;
    this.projectpayment.idOrder1 = 0;
  }

  vendor: any;
  keywordsVendor = '';
  selectVendor(vendor) {
    this.vendor = vendor;
    this.projectpayment.idVendor = vendor.id;
  }
  vendorFilter() {
    this.vendorList = JSON.parse(JSON.stringify(this.VENDORLIST));
    this.vendorList = this.vendorList.filter((item) =>
      item.vendorName.toLowerCase().includes(this.keywordsVendor.toLowerCase())
    );
  }

  removeVendor() {
    this.vendor = null;
    this.projectpayment.idVendor = 0;
  }

  dropdownSelect(item) {
    this.projectpayment.paymentTerms = item;
    const date = new Date();
    switch (item) {
      case '30 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 30),
          this.format,
          this.locale
        );
        break;
      case '60 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 60),
          this.format,
          this.locale
        );
        break;
      case '90 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 90),
          this.format,
          this.locale
        );
        break;
      case '180 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 180),
          this.format,
          this.locale
        );
        break;
      case '1 Year':
        this.projectpayment.dueDate = formatDate(
          new Date().setDate(new Date().getFullYear() + 1),
          this.format,
          this.locale
        );
        break;
    }
  }

  onSelectDocument(event: any) {
    event.addedFiles.map((file) => {
      this.getUploadUrl(file);
    });
  }

  getUploadUrl(file) {
    const fileName = getNewFileName(file.name);
    file.filename = fileName;
    this.apolloService
      .query(get_file_url, {
        fileName: fileName,
        folder: 'files',
      })
      .then((res) => {
        if (!res.get_file_url.error) {
          let uploadUrl = res.get_file_url.data;
          this.httpService.put(uploadUrl, file).then((res) => {
            this.projectpayment.paymentfile.push({
              fileName: file.name,
              fileSize: file.size,
              fileType: file.name
                .substring(file.name.lastIndexOf('.') + 1)
                .toLowerCase(),
              fileUrl: uploadUrl.split('?')[0],
            });
          });
        }
      });
  }

  deleteRef;
  deleteIndex = 0;
  deleteItem;
  openDeleteModal(i, item) {
    this.deleteIndex = i;
    this.deleteItem = item;
    this.deleteRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true,
    });
  }

  cancelDelete() {
    this.deleteRef.close();
  }

  fileDelete() {
    let index = this.deleteIndex;
    let item = this.deleteItem;
    this.projectpayment.paymentfile.splice(index, 1);
    this.deleteRef.close();
  }

  closeModal() {
    this.modalRef.close();
  }

  save() {
    this.txtError.idVendor = this.projectpayment.idVendor;

    if (this.txtError.idVendor > 0) {
      if (this.projectpayment.amount > 0) {
        this.apolloService
          .mutate(projectpayment_new, this.projectpayment)
          .then((res) => {
            console.log(res);
            const result = res.projectpayment_new;
            if (!result.error) {
              this.toastrService.info(
                'New Request has been sent to' + this.vendor.vendorName,
                ''
              );
              this.modalRef.close();
            } else {
              this.toastrService.info(result.message, '');
            }
          });
      } else {
        this.toastrService.info('Please enter amount', '');
      }
    }
  }
}
