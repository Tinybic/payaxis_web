import { formatDate } from '@angular/common';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VENDOR_PAYMENTTERM } from 'src/app/core/constants/vendor_payment';
import { categorycostcode_list } from 'src/app/core/gql/costcode';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import {
  projectinvoice_mapping,
  projectpayment_reject,
} from 'src/app/core/gql/invoice';
import { projectorder_list } from 'src/app/core/gql/orders';
import { companypayment_list } from 'src/app/core/gql/payment';
import { companyproject_list } from 'src/app/core/gql/project';
import {
  getassociatedcompany_list,
  projectpayment_attachment,
  projectpayment_info,
  projectpayment_new,
  projectpayment_update,
} from 'src/app/core/gql/receivables';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { HttpService } from 'src/app/core/service/http.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss'],
})
export class InvoiceAddComponent {
  @Input() modalRef: any;
  @Input() id: number = 0;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('newVendorListModal') newVendorListModal: any;
  @ViewChild('noVendorModal') noVendorModal: any;
  @ViewChild('amount') inputAmout: ElementRef;
  @ViewChild('payingBill') payingBillModal: NgbModalRef;

  idCompany: number = 0;
  paymentTermsList = VENDOR_PAYMENTTERM;
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
    dueDate: 1,
  };
  format = 'yyyy-MM-dd';
  locale = 'en-US';

  showCostcode = false;
  orderCostCodeText = 'order';
  myDate = new Date();
  keywordsCostCode = '';
  costCodeList = [];
  COSTCODE_LIST = [];
  projectpayment = {
    id: 0,
    revision: 0,
    idCompany: 0,
    idProject: 0,
    idVendor: 0,
    idOrder1: 0,
    idCompany_payment: 0,
    billNumber: '',
    sentDate: formatDate(this.myDate, this.format, this.locale),
    dueDate: '',
    paymentTerms: '',
    amount: 0.0,
    txtNotes: '',
    billyn: true,
    costCode: '0',
    paymentFiles: [],
    idInvitedCompany: 0,
    vendorName: '',
    vendorEmail: '',
    status: '',
    account: '',
    payType: '',
  };

  payingBillModalRef: NgbModalRef;

  amountEdit = false;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private http: HttpClient,
    private httpService: HttpService,
    private localStorage: LocalStorageService,
    private fileSaverService: FileSaverService,
  ) {}

  ngOnInit(): void {
    this.idCompany = parseInt(this.localStorage.getItem('idcompany'));

    if (this.id > 0) {
      this.getInvoiceInfo();
    } else {
      this.projectpayment.idCompany = this.idCompany;
      this.getVendorList();
      this.getProjectList();
      this.getOrderList();
      this.getPaymentList();
      this.getCostCodeList();
    }
  }

  getInvoiceInfo() {
    this.apolloService
      .query(projectpayment_info, {
        idCompany: this.idCompany,
        id: this.id,
      })
      .then((res) => {
        const result = res.projectpayment_info;
        if (!result.error) {
          this.projectpayment = {
            id: result.data.id,
            revision: result.data.revision,
            idCompany: result.data.idCompany,
            idProject: result.data.idProject,
            idVendor: result.data.idVendor,
            idOrder1: result.data.idOrder1,
            idCompany_payment: result.data.idCompany_payment,
            billNumber: result.data.billNumber,
            sentDate: result.data.sentDate,
            dueDate: result.data.dueDate,
            paymentTerms: result.data.paymentTerms,
            amount: result.data.amount,
            txtNotes: result.data.txtNotes,
            billyn: true,
            costCode: result.data.costCode,
            paymentFiles: [],
            idInvitedCompany: 0,
            vendorName: result.data.vendorName,
            vendorEmail: result.data.primaryContact,
            status: result.data.status,
            account: result.data.account,
            payType: result.data.payType,
          };
        }
        this.getVendorList();
        this.getProjectList();
        this.getOrderList();
        this.getPaymentList();
        this.getAttachment();
      });
  }

  getAttachment() {
    this.apolloService
      .query(projectpayment_attachment, {
        idCompany: this.idCompany,
        idPayment: this.id,
      })
      .then((res) => {
        const result = res.projectpayment_attachment;
        if (!result.error) {
          this.projectpayment.paymentFiles = result.data;
          if (this.projectpayment.paymentFiles.length > 0) {
            this.file = this.projectpayment.paymentFiles[0];
            this.showNotes = true;
          }
        }
      });
  }

  setOrder() {
    if (this.projectpayment.idOrder1 > 0) {
      this.orderList.forEach((item) => {
        if (item.id == this.projectpayment.idOrder1) {
          this.order = item;
          return;
        }
      });
    }
  }

  setProject() {
    if (this.projectpayment.idProject > 0) {
      this.projectGroupList.forEach((item) => {
        item.forEach((project) => {
          if (this.projectpayment.idProject == project.id) {
            this.project = project;
            return;
          }
        });
      });
    }
  }

  setVendor() {
    if (this.projectpayment.idVendor > 0) {
      this.vendorList.forEach((item) => {
        if (item.id == this.projectpayment.idVendor ||
          item.idInvitedCompany == this.projectpayment.idCompany) {
          this.selectVendor(item);
          return;
        }
      });
    }
  }

  newVendor = false;

  createVendor() {
    this.newVendor = true;
  }

  showVendor() {
    this.newVendor = false;
    this.projectpayment.vendorEmail = '';
    this.projectpayment.vendorName = '';
  }

  createVendorList = [];

  findVendor() {
    if (this.projectpayment.vendorEmail.length > 0) {
      this.vendorList.forEach((item) => {
        if (item.email == this.projectpayment.vendorEmail) {
          this.selectVendor(item);
          this.newVendor = false;
          return;
        }
      });

      if (this.projectpayment.idVendor > 0) {
        this.save();
        return;
      }

      this.apolloService
        .query(getassociatedcompany_list, {
          idCompany: this.idCompany,
          vendorEmail: this.projectpayment.vendorEmail,
        })
        .then((res) => {
          const result = res.getassociatedcompany_list;
          if (!result.error) {
            this.createVendorList = result.data;
            if (this.createVendorList.length > 0) {
              this.openNewVendorModal();
            } else {
              this.save();
            }
          }
        });
    } else if (this.projectpayment.idVendor > 0) {
      this.save();
    }
  }

  newVendorRef;

  openNewVendorModal() {
    this.newVendorRef = this.modalService.open(this.newVendorListModal, {
      backdrop: 'static',
      size: '443',
      centered: true,
    });
  }

  cancelNewVendor() {
    this.newVendorRef.close();
  }

  newVendorShow = false;

  CreateNewVendor() {
    // this.createVendorList.forEach((item) => {
    //   if (this.projectpayment.idInvitedCompany == item.idInvitedCompany) {
    //     this.projectpayment.vendorName = item.companyName;
    //     return;
    //   }
    // });
    // if (this.projectpayment.idInvitedCompany > 0) {
    //   this.newVendorShow = true;
    // }

    this.newVendorRef.close();
    this.save();
  }

  editAmount() {
    this.amountEdit = true;
    setTimeout(() => {
      this.inputAmout.nativeElement.focus();
    }, 10);

    if (this.projectpayment.amount == 0) this.projectpayment.amount = null;
  }

  cancelAmount() {
    if (!this.projectpayment.amount) {
      this.projectpayment.amount = 0;
    }
    this.amountEdit = false;
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    if (this.project) {
      this.orderList = this.orderList.filter(
        (item) =>
          item.idProject == this.project.id &&
          item.total >= this.projectpayment.amount
      );
    } else {
      this.orderList = this.orderList.filter(
        (item) => item.total >= this.projectpayment.amount
      );
    }
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
        idCompany: this.idCompany,
      })
      .then((res) => {
        const result = res.companyproject_list;
        if (!result.error) {
          this.PROJECTLIST = JSON.parse(JSON.stringify(result.data));
          this.projectList = this.groupBy(result.data, 'idGroup');
          for (let key in this.projectList) {
            this.projectGroupList.push(this.projectList[key]);
          }
          this.setProject();
        }
      });
  }

  setCostCodeName() {
    this.costCodeList.forEach((item) => {
      if (item.costcode) {
        item.costcodelist.forEach((costcode) => {
          if (costcode.costCode == this.projectpayment.costCode) {
            this.vendorcostcodesText = costcode.txtName;
            return;
          }
        });
      }
    });
  }

  getCostCodeList() {
    this.apolloService
      .query(categorycostcode_list, {
        idCompany: this.idCompany,
      })
      .then((res) => {
        const result = res.categorycostcode_list;
        if (!result.error) {
          this.costCodeList = result.data;
          this.COSTCODE_LIST = JSON.parse(JSON.stringify(result.data));
        }
        this.setCostCodeName();
      });
  }

  vendorcostcodesText = '';

  costCodeSelect(event, item) {
    if (event.currentTarget.checked) {
      this.vendorcostcodesText = item.txtName;
      this.projectpayment.costCode = item.costCode;
    } else {
      this.vendorcostcodesText = '';
      this.projectpayment.costCode = '0';
    }
  }

  setCostCodeSelect(costcode) {
    let result = false;
    if (this.projectpayment.costCode == costcode) {
      result = true;
    }
    return result;
  }

  costCodeFilter() {
    this.costCodeList = JSON.parse(JSON.stringify(this.COSTCODE_LIST));
    this.costCodeList = this.costCodeList.filter((costcode) => {
      costcode.costcodelist = costcode.costcodelist.filter((item) =>
        item.txtName.toLowerCase().includes(this.keywordsCostCode.toLowerCase())
      );
      return costcode;
    });
  }

  getVendorList() {
    this.apolloService
      .query(vendor_list, {
        idCompany: this.idCompany,
      })
      .then((res) => {
        const result = res.vendor_list;
        if (!result.error) {
          this.vendorList = result.data;
          this.vendorList = this.vendorList.filter(
            (item) => item.status == 'Active'
          );
          this.VENDORLIST = JSON.parse(JSON.stringify(this.vendorList));
          this.setVendor();
        }
      });
  }

  getOrderList() {
    this.apolloService
      .query(projectorder_list, {
        idCompany: this.idCompany,
        idProject: 0,
      })
      .then((res) => {
        const result = res.projectorder_list;
        if (!result.error) {
          this.orderList = result.data;
          this.ORDERLIST = JSON.parse(JSON.stringify(result.data));
          this.setOrder();
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
        idCompany: this.idCompany,
      })
      .then((res) => {
        const result = res.companypayment_list;
        if (!result.error) {
          this.paymentList = result.data;
          // this.paymentList.forEach((item) => {
          //   if (item.account.length > 4)
          //     item.account = item.account.substring(item.account.length - 4);
          //   if (item.defaultPay) {
          //     this.payment = item;
          //     this.projectpayment.idCompany_payment = item.id;
          //   }
          // });
          // if (!this.payment && this.paymentList.length > 0) {
          //   this.payment = this.paymentList[0];
          //   this.projectpayment.idCompany_payment = this.payment.id;
          // }
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
      (item) =>
        item.idProject == project.id && item.total >= this.projectpayment.amount
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
    this.removOrder();
  }

  order: any;
  keywordsOrder = '';

  selectOrder(order) {
    this.order = order;
    this.projectpayment.idOrder1 = order.id;
    this.projectpayment.costCode = this.order.costCode;
    if (!this.project) {
      this.project = {
        id: order.idProject,
        projectName: order.projectName,
      };
      this.projectpayment.idProject = this.project.id;
    }
  }

  orderFilter() {
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    this.orderList = this.orderList.filter((item) =>
      item.projectName.toLowerCase().includes(this.keywordsOrder.toLowerCase())
    );
  }

  removOrder() {
    this.order = null;
    this.projectpayment.idOrder1 = 0;
    this.projectpayment.costCode = '0';
    if (!this.project) {
      this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
      this.orderList = this.orderList.filter(
        (item) => item.total >= this.projectpayment.amount
      );
    }
  }

  vendor: any;
  keywordsVendor = '';

  selectVendor(vendor) {
    this.vendor = vendor;
    let name = vendor.primaryContact.split(/\s+/);
    name = name.filter((item) => item.trim().length > 0);
    if (name.length > 0) {
      this.vendor.firstName = name[0];
      this.vendor.lastName = name[0];
      if (name.length > 1) this.vendor.lastName = name[1];
    } else {
      name = vendor.vendorName.split(' ');
      if (name.length == 1) {
        if (name[0].length > 1) {
          this.vendor.firstName = name[0].substring(0, 1);
          this.vendor.lastName = name[0].substring(1, 2);
        } else if (name[0].length == 1) {
          this.vendor.firstName = name[0];
          this.vendor.lastName = name[0];
        }
      } else if (name.length > 1) {
        this.vendor.firstName = name[0];
        this.vendor.lastName = name[1];
      }
    }
    this.projectpayment.idVendor = vendor.id;
  }

  vendorFilterFocus(vendorDropdown) {
    if (this.keywordsVendor.length === 0) {
      this.vendorList = JSON.parse(JSON.stringify(this.VENDORLIST));
    }
    setTimeout(() => {
      if (!vendorDropdown.isOpen()) {
        vendorDropdown.open();
      }
    }, 500);
  }

  vendorFilter(vendorDropdown) {
    this.vendorList = JSON.parse(JSON.stringify(this.VENDORLIST));
    if (this.keywordsVendor.length > 0) {
      this.vendorList = this.vendorList.filter((item) =>
        item.vendorName
          .toLowerCase()
          .includes(this.keywordsVendor.toLowerCase())
      );
    }
    if (!vendorDropdown.isOpen()) {
      vendorDropdown.open();
    }
  }

  removeVendor() {
    this.vendor = null;
    this.projectpayment.idVendor = 0;
    this.projectpayment.vendorEmail = '';
    this.projectpayment.vendorName = '';
    if (this.newVendor) {
      this.newVendorShow = false;
    }
  }

  dropdownSelect(item) {
    this.projectpayment.paymentTerms = item;
    const date = new Date();
    switch (item) {
      case '7 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 7),
          this.format,
          this.locale
        );
        break;
      case '15 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 15),
          this.format,
          this.locale
        );
        break;
      case '30 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 30),
          this.format,
          this.locale
        );
        break;
      case '45 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 45),
          this.format,
          this.locale
        );
        break;
      case '60 Days':
        this.projectpayment.dueDate = formatDate(
          date.setDate(date.getDate() + 65),
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
      case '60 Days':
        this.projectpayment.dueDate = formatDate(
          new Date().setDate(new Date().getFullYear() + 1),
          this.format,
          this.locale
        );
        break;
    }
  }

  showFindOrder() {
    this.showCostcode = true;
    this.orderCostCodeText = 'Cost code';
  }

  showFindCostCode() {
    this.showCostcode = false;
    this.orderCostCodeText = 'order';
    this.order = null;
    this.projectpayment.idOrder1 = 0;
  }

  onSelectDocument(event: any) {
    event.addedFiles.map((file) => {
      this.getUploadUrl(file);
    });
  }

  file;

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
          if (this.projectpayment.paymentFiles.length > 0) {
            this.httpService.put(uploadUrl, file).then((res) => {
              this.projectpayment.paymentFiles.push({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.name
                  .substring(file.name.lastIndexOf('.') + 1)
                  .toLowerCase(),
                fileUrl: uploadUrl.split('?')[0],
              });
            });
          } else {
            this.handleUploadFile(file, uploadUrl);
          }
        }
      });
  }

  handleUploadFile(file, uploadUrl) {
    this.file = {
      uploadProgress: 0,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.name
        .substring(file.name.lastIndexOf('.') + 1)
        .toLowerCase(),
      fileUrl: uploadUrl.split('?')[0],
    };
    file.subscription = this.http
      .put(uploadUrl, file, {
        headers: new HttpHeaders()
          .set('x-ms-blob-type', 'BlockBlob')
          .set('Content-Type', file.type),
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (res) => {
          if (res.type === HttpEventType.Response) {
            this.projectpayment.paymentFiles.push({
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              fileUrl: uploadUrl.split('?')[0],
            });
            if (this.projectpayment.paymentFiles.length == 1) this.mapping();
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.file.uploadProgress = percentDone;
          }
        },
        error: (err) => {
          this.toastrService.info(err, '');
        },
      });
  }

  cancelUploading(file) {
    file.subscription.unsubscribe();
    this.file = null;
  }

  resetValue(type) {
    if (type == 1) {
      this.vendorList.forEach((item) => {
        if (item.id == this.handleData.idVendor) {
          this.selectVendor(item);
          return;
        }
      });
    } else if (type == 2) {
      this.projectpayment.amount = this.handleData.amount;
    } else if (type == 3) {
      this.projectpayment.billNumber = this.handleData.invoiceNumber;
    } else if (type == 4) {
      this.projectpayment.dueDate = this.handleData.indvoicedueDate;
    } else if (type == 5) {
      this.projectpayment.sentDate = this.handleData.invoicedDate;
    } else if (type == 6) {
      const projectListTemp = JSON.parse(JSON.stringify(this.PROJECTLIST));

      projectListTemp.forEach((item) => {
        if (item.id == this.handleData.idProject) {
          this.selectProject(item);
          return;
        }
      });
    } else if (type == 7) {
      this.orderList.forEach((item) => {
        if (item.id == this.handleData.idOrder1) {
          this.selectOrder(item);
        }
      });
    }
  }

  showNotes = false;
  mappingFlag = false;
  handleData;

  mapping() {
    this.mappingFlag = true;
    this.apolloService
      .mutate(projectinvoice_mapping, {
        idCompany: this.idCompany,
        fileUrl: this.file.fileUrl,
      })
      .then((res) => {
        const result = res.projectinvoice_mapping;
        this.handleData = result.data;
        this.showNotes = true;
        if (!result.error) {
          if (!this.vendor) {
            this.vendorList.forEach((item) => {
              if (item.id == result.data.idVendor) {
                this.selectVendor(item);
                this.newVendor = false;
                return;
              }
            });
          }

          if (!this.projectpayment.costCode) {
            this.costCodeList.forEach((item) => {
              if (item.costcode == result.data.costCode) {
                this.projectpayment.costCode = item.costcode;
                this.vendorcostcodesText = item.txtName;
              }
            });
          }

          if (!this.projectpayment.sentDate) {
            this.projectpayment.sentDate = result.data.invoicedDate;
          }
          if (!this.projectpayment.dueDate) {
            this.projectpayment.dueDate = result.data.indvoicedueDate;
          }

          if (!this.projectpayment.billNumber) {
            this.projectpayment.billNumber = result.data.invoiceNumber;
          }

          if (!(this.projectpayment.amount > 0)) {
            this.projectpayment.amount = result.data.amount;
          }

          if (!this.project) {
            const projectListTemp = JSON.parse(
              JSON.stringify(this.PROJECTLIST)
            );

            projectListTemp.forEach((item) => {
              if (item.id == result.data.idProject) {
                this.selectProject(item);
                return;
              }
            });
          }

          if (!this.order) {
            this.orderList.forEach((item) => {
              if (item.id == result.data.idOrder1) {
                this.selectOrder(item);
              }
            });
          }
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
    this.projectpayment.paymentFiles.splice(index, 1);
    this.deleteRef.close();
  }

  closeModal() {
    this.modalRef.close();
  }

  save() {
    //this.txtError.idVendor = this.projectpayment.idVendor;

    // if (this.txtError.idVendor > 0) {
    if (this.projectpayment.amount > 0) {
      this.apolloService
        .mutate(projectpayment_new, this.projectpayment)
        .then((res) => {
          const result = res.projectpayment_new;
          if (!result.error) {
            this.toastrService.info(
              'Bill for ' +
                this.projectpayment.vendorName +
                ' has been saved to Bill Inbox.',
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
    //}
  }

  update() {
    if (this.id > 0) {
      this.apolloService
        .mutate(projectpayment_update, this.projectpayment)
        .then((res) => {
          const result = res.projectpayment_update;
          if (!result.error) {
            this.toastrService.info(
              'Bill for ' +
                this.projectpayment.vendorName +
                ' has been updated.',
              ''
            );
            this.modalRef.close();
          } else {
            this.toastrService.info(result.message, '');
          }
        });
    }
  }

  openPayingBill() {
    if (this.paymentList.length == 0) {
      this.toastrService.info(
        'No payment method available, please go to company settings and add a new payment method.',
        'Warning',
        {
          timeOut: 6000,
          enableHtml: true,
          toastClass: 'max-width-300 text-white',
        }
      );
    } else {
      this.payingBillModalRef = this.modalService.open(this.payingBillModal, {
        backdrop: 'static',
        modalDialogClass: 'modal-right',
        size: '640',
      });

      this.payingBillModalRef.result.then(
        (res) => {
          console.log('OK');
        },
        (dismiss) => {
          console.log('dismiss');
        }
      );
    }
  }

  decline() {
    this.apolloService
      .mutate(projectpayment_reject, {
        idCompany: this.idCompany,
        id: this.projectpayment.id,
        revision: this.projectpayment.revision,
      })
      .then((res) => {
        const result = res.projectpayment_reject;
        if (!result.error) {
          this.toastrService.info(result.message, '');
          this.modalRef.close();
        } else {
          this.toastrService.info(result.message, '');
        }
      });
  }


  downloadFile(url,name){
    this.http.get(url, {
      observe: 'response',
      responseType: 'blob',
    }).subscribe(res => {
      this.fileSaverService.save((<any>res).body, name);
    });
  }
}
