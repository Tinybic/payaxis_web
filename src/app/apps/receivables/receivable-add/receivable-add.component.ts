import { formatDate, formatCurrency } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VENDOR_PAYMENTTERM } from 'src/app/core/constants/vendor_payment';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import { companypayment_list } from 'src/app/core/gql/payment';
import { companyproject_list } from 'src/app/core/gql/project';
import {
  projectpayment_attachment,
  projectpayment_info,
  projectpayment_new,
  projectpayment_update,
  receivable_list
} from 'src/app/core/gql/receivables';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { HttpService } from 'src/app/core/service/http.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { projectorder_list } from "../../../core/gql/orders";
import { projectorder_info } from "../../../core/gql/order";

@Component({
  selector: 'app-receivable-add',
  templateUrl: './receivable-add.component.html',
  styleUrls: ['./receivable-add.component.scss']
})
export class ReceivableAddComponent {
  @Input() modalRef: any;
  @Input() from: string = ''; // 从 Receivables 打开时, from='Receivables';
                              // 从 Received Orders 打开时, from='Received Orders';
  @Input() id: number = 0;   // 从 Receivables 打开时，编辑状态时 id>0，新建时 id=0;
                             // 从 Received Orders 点 'Payment Request' 打开时 id=order id;
  @Input() orderInfo?: any;   // 从 Receivables 打开时, orderInfo == undefined
  // 从 Received Orders 点 'Payment Request' 打开时 orderInfo=order，
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('amount') inputAmount: ElementRef;
  @ViewChild('drop') drop: any;
  
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
    idVendor: 1
  };
  format = 'yyyy-MM-dd';
  locale = 'en-US';
  
  myDate = new Date();
  
  projectpayment = {
    id: 0,
    idCompany: 0,
    idProject: 0,
    projectName: '',
    idVendor: 0,
    idOrder1: 0,
    idCompany_payment: 0,
    billNumber: '',
    orderNumber: 0,
    sentDate: formatDate(this.myDate, this.format, this.locale),
    dueDate: formatDate(
      this.myDate.setDate(this.myDate.getDate() + 30),
      this.format,
      this.locale
    ),
    paymentTerms: '30 Days',
    amount: 0.0,
    txtNotes: '',
    billyn: false,
    costCode: '0',
    paymentFiles: [],
    idInvitedCompany: 0,
    vendorName: '',
    vendorEmail: '',
    status: '',
    revision: 0,
    bankName: '',
    account: '',
    payType: ''
  };
  
  amountEdit = false;
  createdCurrentCompanyID = 0
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService,
    private localStorage: LocalStorageService,
    private globalFuns: GlobalFunctionsService
  ){}
  
  ngOnInit(): void{
    this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
    
    if(this.from == 'Received Orders'){
      this.getOrderInfo();
    } else{
      if(this.id > 0){
        this.getDetail();
      } else{
        this.projectpayment.idCompany = this.idCompany;
        this.getVendorList();
        this.getProjectList();
        this.getSentOrderList();
        // this.getPaymentList();
      }
    }
  }
  
  
  getOrderInfo(){
    this.apolloService.query(projectorder_info, {
      idCompany: this.idCompany,
      id: this.id,
      received: true
    }).then((res) => {
      const result = res.projectorder_info;
      if(!result.error){
        this.projectpayment = {
          id: result.data.projectOrder.id,
          idCompany: this.idCompany,
          idProject: result.data.projectOrder.idProject,
          projectName: result.data.projectOrder.projectName,
          idVendor: result.data.projectOrder.idNewVendor,
          idOrder1: result.data.projectOrder.id,
          idCompany_payment: 0,
          billNumber: result.data.projectOrder.invoiceNumber,
          orderNumber: result.data.projectOrder.orderNumber,
          sentDate: result.data.projectOrder.invoicedDate,
          dueDate: result.data.projectOrder.indvoicedueDate,
          paymentTerms: result.data.projectOrder.paymentTerms,
          amount: result.data.projectOrder.remainingAmount,
          txtNotes: result.data.projectOrder.notes,
          billyn: true,
          costCode: result.data.projectOrder.costCode,
          paymentFiles: [],
          idInvitedCompany: 0,
          vendorName: result.data.projectOrder.vendorName,
          vendorEmail: '',
          status: result.data.projectOrder.status,
          revision: result.data.projectOrder.revision,
          bankName: '',
          account: '',
          payType: ''
        };
        
        this.createdCurrentCompanyID = result.data.projectOrder.idCompany;
      }
      this.getVendorList();
      this.getProjectList();
      this.order = this.orderInfo;// this.getReceivedOrderList();
      this.getAttachment();
    });
  }
  
  getDetail(){
    this.apolloService.query(projectpayment_info, {
      idCompany: this.idCompany,
      id: this.id
    }).then((res) => {
      const result = res.projectpayment_info;
      if(!result.error){
        this.projectpayment = {
          idCompany: this.idCompany,
          idProject: result.data.idProject,
          projectName: result.data.projectName,
          idVendor: result.data.idNewVendor,
          idOrder1: result.data.idOrder1,
          idCompany_payment: result.data.idCompany_payment,
          billNumber: result.data.billNumber,
          orderNumber: result.data.orderNumber,
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
          revision: result.data.revision,
          bankName: result.data.bankName,
          account:
            result.data.account.length > 4
              ? result.data.account.substring(result.data.account.length - 4)
              : result.data.account,
          payType: result.data.payType,
          id: this.id
        };
        
        this.createdCurrentCompanyID = result.data.idCompany;
      }
      this.getVendorList();
      this.getProjectList();
      if(this.isSenderIsLoggedIn()){
        this.getSentOrderList();
      } else{
        this.getReceivedOrderList();
      }
      this.getAttachment();
    });
  }
  
  getAttachment(){
    this.apolloService.query(projectpayment_attachment, {
      idCompany: this.idCompany,
      idPayment: this.id
    }).then((res) => {
      const result = res.projectpayment_attachment;
      if(!result.error){
        this.projectpayment.paymentFiles = result.data;
        // if (this.projectpayment.paymentFiles.length > 0) {
        //   this.file = this.projectpayment.paymentFiles[0];
        //   this.showNotes = true;
        // }
      }
    });
  }
  
  
  editAmount(){
    if(this.projectpayment.status != 'Paid' && (this.id == 0 || this.isSenderIsLoggedIn())){
      this.amountEdit = true;
      setTimeout(() => {
        this.inputAmount.nativeElement.focus();
      }, 10);
      
      if(this.projectpayment.amount == 0) this.projectpayment.amount = null;
    }
  }
  
  cancelAmount(){
    this.amountEdit = false;
    if(!this.projectpayment.amount){
      this.projectpayment.amount = 0;
      return;
    }
  }
  
  groupBy(arr, key){
    return arr.reduce((acc, curr) => {
      (acc[curr[key]] = acc[curr[key]] || []).push(curr);
      return acc;
    }, {});
  }
  
  getProjectList(){
    this.apolloService.query(companyproject_list, {
      idCompany: this.idCompany
    }).then((res) => {
      const result = res.companyproject_list;
      if(!result.error){
        this.PROJECTLIST = JSON.parse(JSON.stringify(result.data));
        this.projectList = this.groupBy(result.data, 'idGroup');
        for(let key in this.projectList){
          this.projectGroupList.push(this.projectList[key]);
        }
        this.setProject();
      }
    });
  }
  
  setProject(){
    if(this.orderInfo){
      this.project = {
        projectName: this.orderInfo.projectName
      };
    } else if(this.projectpayment.idProject > 0){
      this.projectGroupList.forEach((item) => {
        item.forEach((project) => {
          if(this.projectpayment.idProject == project.id){
            this.project = project;
            return;
          }
        });
      });
    }
  }
  
  getVendorList(){
    this.apolloService.query(vendor_list, {
      idCompany: this.idCompany
    }).then((res) => {
      const result = res.vendor_list;
      if(!result.error){
        this.vendorList = result.data;
        this.vendorList = this.vendorList.filter(
          (item) => item.status == 'Active'
        );
        this.VENDORLIST = JSON.parse(JSON.stringify(this.vendorList));
        this.setVendor();
      }
    });
  }
  
  setVendor(){
    if(this.projectpayment.idVendor > 0){
      this.vendorList.forEach((item) => {
        if(item.id == this.projectpayment.idVendor){
          this.selectVendor(item);
          return;
        }
      });
    }
  }
  
  getSentOrderList(){
    this.apolloService.query(projectorder_list, {
      idCompany: this.idCompany,
      idProject: 0
    }).then((res) => {
      const result = res.projectorder_list;
      if(!result.error){
        this.orderList = result.data.filter((order) => order.status != 'Paid');
        this.ORDERLIST = JSON.parse(JSON.stringify(this.orderList));
        this.setOrder();
      }
    });
  }
  
  getReceivedOrderList(){
    this.apolloService.query(receivable_list, {
      idCompany: this.idCompany,
      idProject: 0
    }).then((res) => {
      const result = res.receivable_list;
      if(!result.error){
        this.orderList = result.data;
        this.ORDERLIST = JSON.parse(JSON.stringify(this.orderList));
        this.setOrder();
      }
    });
  }
  
  setOrder(){
    if(this.projectpayment.idOrder1 > 0){
      this.ORDERLIST.forEach((item) => {
        if(item.id == this.projectpayment.idOrder1){
          this.order = item;
          return;
        }
      });
    }
  }
  
  getPaymentList(){
    this.apolloService.query(companypayment_list, {
      idCompany: this.idCompany
    }).then((res) => {
      const result = res.companypayment_list;
      if(!result.error){
        this.paymentList = result.data;
        this.paymentList.forEach((item) => {
          if(item.account.length > 4)
            item.account = item.account.substring(item.account.length - 4);
          if(this.id == 0 && item.defaultPay){
            this.projectpayment.idCompany_payment = item.id;
            this.projectpayment.bankName = item.bankName;
            this.projectpayment.payType = item.payType;
            this.projectpayment.account = item.account;
          }
        });
        if(
          this.id == 0 &&
          this.paymentList.length > 0 &&
          this.paymentList[0].account == ''
        ){
          this.projectpayment.idCompany_payment = this.paymentList[0].id;
          this.projectpayment.bankName = this.paymentList[0].bankName;
          this.projectpayment.payType = this.paymentList[0].payType;
          this.projectpayment.account = this.paymentList[0].account;
        }
      }
    });
  }
  
  selectPayment(item){
    this.projectpayment.idCompany_payment = item.id;
    this.projectpayment.bankName = item.bankName;
    this.projectpayment.payType = item.payType;
    this.projectpayment.account = item.account;
  }
  
  project: any;
  keywordsProject = '';
  
  selectProject(project){
    this.project = project;
    this.projectpayment.idProject = project.id;
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    this.orderList = this.orderList.filter(
      (item) =>
        item.idProject == project.id && item.total >= this.projectpayment.amount
    );
  }
  
  projectFilter(){
    this.projectList = JSON.parse(JSON.stringify(this.PROJECTLIST));
    this.projectList = this.projectList.filter((item) =>
      this.globalFuns.filterValue(item, ['projectName', 'projectAddress', 'projectBudget', 'status'], this.keywordsProject)
    );
    this.projectList = this.groupBy(this.projectList, 'idGroup');
    this.projectGroupList = [];
    for(let key in this.projectList){
      this.projectGroupList.push(this.projectList[key]);
    }
  }
  
  removeProject(){
    this.project = null;
    this.projectpayment.idProject = 0;
    this.removOrder();
  }
  
  order: any;
  keywordsOrder = '';
  
  selectOrder(order){
    this.order = order;
    this.projectpayment.idOrder1 = order.id;
    if(!this.project){
      this.project = {
        id: order.idProject,
        projectName: order.projectName
      };
      this.projectpayment.idProject = this.project.id;
    }
  }
  
  orderFilter(){
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    this.orderList = this.orderList.filter((item) =>
      this.globalFuns.filterValue(item, ['orderNumber', 'projectName', 'status', 'vendorName', 'costCodeName', 'remainingAmount', 'total'], this.keywordsOrder)
    
    );
  }
  
  removOrder(){
    this.order = null;
    this.projectpayment.idOrder1 = 0;
    if(!this.project){
      this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
      this.orderList = this.orderList.filter(
        (item) => item.total >= this.projectpayment.amount
      );
    }
  }
  
  vendor: any;
  keywordsVendor = '';
  
  selectVendor(vendor){
    this.vendor = vendor;
    let name = vendor.primaryContact.split(/\s+/);
    name = name.filter((item) => item.trim().length > 0);
    if(name.length > 0){
      this.vendor.firstName = name[0];
      this.vendor.lastName = name[0];
      if(name.length > 1) this.vendor.lastName = name[1];
    } else{
      name = vendor.vendorName.split(' ');
      if(name.length == 1){
        if(name[0].length > 1){
          this.vendor.firstName = name[0].substring(0, 1);
          this.vendor.lastName = name[0].substring(1, 2);
        } else if(name[0].length == 1){
          this.vendor.firstName = name[0];
          this.vendor.lastName = name[0];
        }
      } else if(name.length > 1){
        this.vendor.firstName = name[0];
        this.vendor.lastName = name[1];
      }
    }
    this.projectpayment.idVendor = vendor.id;
    this.orderList = JSON.parse(JSON.stringify(this.ORDERLIST));
    this.orderList = this.orderList.filter(
      (item2) => item2.idCompany == vendor.idInvitedCompany
    );
  }
  
  vendorFilter(){
    this.vendorList = JSON.parse(JSON.stringify(this.VENDORLIST));
    this.vendorList = this.vendorList.filter((item) =>
      this.globalFuns.filterValue(item, ['vendorName', 'primaryContact', 'email', 'txtAddress', 'txtCity', 'txtState', 'txtZip', 'status'], this.keywordsVendor)
    );
  }
  
  
  removeVendor(){
    this.vendor = null;
    this.projectpayment.idVendor = 0;
  }
  
  addAttachment(){
    this.drop.showFileSelector();
  }
  
  dropdownSelect(item){
    this.projectpayment.paymentTerms = item;
    const date = new Date();
    switch(item){
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
  
  onSelectDocument(event: any){
    event.addedFiles.map((file) => {
      this.getUploadUrl(file);
    });
  }
  
  getUploadUrl(file){
    const fileName = getNewFileName(file.name);
    file.filename = fileName;
    this.apolloService.query(get_file_url, {
      fileName: fileName,
      folder: 'files'
    }).then((res) => {
      if(!res.get_file_url.error){
        let uploadUrl = res.get_file_url.data;
        this.httpService.put(uploadUrl, file).then((res) => {
          this.projectpayment.paymentFiles.push({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
            fileUrl: uploadUrl.split('?')[0]
          });
        });
      }
    });
  }
  
  deleteRef;
  deleteIndex = 0;
  deleteItem;
  
  openDeleteModal(i, item){
    this.deleteIndex = i;
    this.deleteItem = item;
    this.deleteRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true
    });
  }
  
  cancelDelete(){
    this.deleteRef.close();
  }
  
  fileDelete(){
    let index = this.deleteIndex;
    let item = this.deleteItem;
    this.projectpayment.paymentFiles.splice(index, 1);
    this.deleteRef.close();
  }
  
  closeModal(){
    this.modalRef.close();
  }
  
  save(){
    if(this.projectpayment.amount == 0){
      this.toastrService.info('Please enter amount', '');
      return;
    }
    if(this.projectpayment.billNumber.length == 0){
      this.toastrService.info('Please enter Bill Number', '');
      return;
    }
    if(this.order && this.projectpayment.amount > this.order.remainingAmount){
      this.toastrService.info('Amount due ' + formatCurrency(this.projectpayment.amount, 'en-US', '$', 'USD') + ' can\'t be more than remaining ' + formatCurrency(this.order.remainingAmount, 'en-US', '$', 'USD') + '.', '');
      return;
    }
    
    if(this.id > 0 && this.from == 'Receivables'){
      this.update();
    } else{
      this.txtError.idVendor = this.projectpayment.idVendor;
      
      if(this.txtError.idVendor > 0){
        // if(this.projectpayment.account == ''){
        //   this.toastrService.info('Please select one deposit account', '');
        //   return;
        // }
        this.apolloService.mutate(projectpayment_new, this.projectpayment).then((res) => {
          const result = res.projectpayment_new;
          if(!result.error){
            this.toastrService.info(
              'New Request has been sent to' + this.vendor.vendorName,
              ''
            );
            this.modalRef.close();
          } else{
            this.toastrService.info(result.message, '');
          }
        });
      }
    }
  }
  
  update(){
    this.apolloService.mutate(projectpayment_update, this.projectpayment).then((res) => {
      const result = res.projectpayment_update;
      if(!result.error){
        this.toastrService.info(
          'Bill for ' +
          this.projectpayment.vendorName +
          ' has been updated.',
          ''
        );
        this.modalRef.close();
      } else{
        this.toastrService.info(result.message, '');
      }
    });
  }
  
  
  isSenderIsLoggedIn(){
    return this.idCompany == this.createdCurrentCompanyID;
  }
  
  
  protected readonly globalFunc = this.globalFuns;
}
