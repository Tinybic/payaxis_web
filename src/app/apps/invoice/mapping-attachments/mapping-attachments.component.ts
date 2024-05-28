import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { companyproject_list } from "../../../core/gql/project";
import { vendor_list } from "../../../core/gql/vendor";
import { categorycostcode_list } from "../../../core/gql/costcode";
import { ApolloService } from "../../../core/service/apollo.service";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { HttpClient } from "@angular/common/http";
import { projectorder_list } from "../../../core/gql/orders";
import { projectinvoice_new, projectinvoice_update, projectinvoice_deletefile, projectinvoice_attachment } from "../../../core/gql/invoice";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-mapping-attachments',
  templateUrl: './mapping-attachments.component.html',
  styleUrls: ['./mapping-attachments.component.scss']
})
export class MappingAttachmentsComponent {
  @Input() modalRef: NgbModalRef;
  @Input() initialInvoice;
  
  @ViewChild('addCostCode') addCostCode: NgbModalRef;
  @ViewChild('addVendor') addVendor: NgbModalRef;
  @ViewChild('addProject') addProject: NgbModalRef;
  @ViewChild('cancelModal') cancelModal: NgbModalRef;
  @ViewChild('deleteAttachment') deleteAttachment: NgbModalRef;
  
  idCompany;
  invoice;
  projectList = [];
  projectGroupList = [];
  vendorList = [];
  costCodeList = [];
  orderList = [];
  invoiceAttachment = [];
  
  project;
  orderFilter = '';
  
  addCostCodeRef: NgbModalRef;
  addVendorRef: NgbModalRef;
  addProjectRef: NgbModalRef;
  cancelModalRef: NgbModalRef;
  deleteAttachmentRef: NgbModalRef;
  
  invoiceError = {
    invoiceNumber: false,
    invoicedDate: false,
    idProject: false
  }
  
  
  deleteAttachmentObj = {
    title: 'Deleting Attachment',
    message: '',
    btnConfirm: 'Confirm',
    serviceName: projectinvoice_deletefile,
    params: {},
    btnSide: 'end'
  };
  
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private globalFuns: GlobalFunctionsService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ){}
  
  ngOnInit(){
    this.idCompany = parseInt(this.localStorage.getItem('idcompany'));
    if(this.initialInvoice.id > 0){
      this.invoice = {...this.initialInvoice};
      this.getInvoiceAttachment();
    } else if(this.initialInvoice.fileUrl){
      this.getFileBlob();
    }
    this.getProjectList();
    this.getVendorList();
    this.getCostCodeList();
    this.getOrders();
  }
  
  
  getProjectList(){
    this.projectGroupList = [];
    this.apolloService.query(companyproject_list, {idCompany: this.idCompany}).then((res) => {
      const result = res.companyproject_list;
      if(!result.error){
        this.projectList = JSON.parse(JSON.stringify(result.data));
      }
    });
  }
  
  openAddProjectModal(){
    this.addProjectRef = this.modalService.open(this.addProject, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    });
    
    this.addProjectRef.result.then(
      (result) => {
        // get projects
        this.getProjectList();
      },
      (reason) => {
        this.getProjectList();
      }
    );
  }
  
  
  getVendorList(){
    this.apolloService.query(vendor_list, {idCompany: this.idCompany}).then((res) => {
      const result = res.vendor_list;
      if(!result.error){
        this.vendorList = JSON.parse(JSON.stringify(result.data));
      }
    });
  }
  
  openAddVendorModal(){
    this.addVendorRef = this.modalService.open(this.addVendor, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true
    });
    
    this.addVendorRef.result.then(
      (res) => {
        this.getVendorList();
      },
      (dismiss) => {
        this.getVendorList();
      }
    );
  }
  
  getCostCodeList(){
    if(this.idCompany != 0){
      this.apolloService.query(categorycostcode_list, {idCompany: this.idCompany}).then((res) => {
        const result = res.categorycostcode_list;
        if(!result.error){
          this.costCodeList = JSON.parse(JSON.stringify(result.data));
        }
      });
    }
  }
  
  openAddCostCodeModal(){
    this.addCostCodeRef = this.modalService.open(this.addCostCode, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530'
    });
    this.addCostCodeRef.result.then(
      (res) => {
        this.getCostCodeList();
      },
      (dismiss) => {
        this.getCostCodeList();
      }
    );
  }
  
  filterOrderList = (order: any) => {
    let values = Object.values(order);
    return values.some(
      (v: any) =>
        v.toString().toLowerCase().includes(this.orderFilter.toLowerCase())
    );
  }
  
  getOrders(){
    if(this.idCompany != 0){
      this.apolloService.query(projectorder_list, {
        idCompany: this.idCompany,
        idProject: 0
      }).then((res) => {
        const result = res.projectorder_list;
        if(!result.error){
          this.orderList = result.data;
        }
      });
    }
  }
  
  selectOrder(order: any){
    this.invoice.orderNumber = order.orderNumber;
    this.invoice.idOrder1 = order.id;
    this.invoice.status = order.status;
    this.invoice.txtAddress = order.txtAddress;
    this.invoice.txtCity = order.txtCity;
    this.invoice.txtState = order.txtState;
  }
  
  
  getInvoiceAttachment(){
    this.apolloService.query(projectinvoice_attachment, {
      idCompany: this.idCompany,
      idInvoice: this.invoice.id
    }).then((res) => {
      const result = res.projectinvoice_attachment;
      if(!result.error){
        this.invoiceAttachment = JSON.parse(JSON.stringify(result.data));
        if(this.invoiceAttachment.length > 0){
          this.invoice.fileName = this.invoiceAttachment[0].fileName;
          this.invoice.fileUrl = this.invoiceAttachment[0].fileUrl;
          this.invoice.fileType = this.invoiceAttachment[0].fileType;
          this.getFileBlob();
        }
      }
    });
  }
  
  deleteAttachmentConfirm(){
    this.deleteAttachmentObj.serviceName = projectinvoice_deletefile;
    this.deleteAttachmentObj.params = {
      idCompany: this.idCompany,
      revision: this.invoice.revision,
      idProjectinvoice_file: this.invoiceAttachment[0].id
    }
    this.deleteAttachmentRef = this.modalService.open(this.deleteAttachment, {
      size: '443',
      centered: true
    });
    this.deleteAttachmentRef.result.then(
      (result) => {
        this.getInvoiceAttachment();
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
  
  getFileBlob(){
    this.http.get(this.invoice.fileUrl, {
      observe: 'response',
      responseType: 'blob'
    }).subscribe(res => {
      this.invoice.fileBlob = (<any>res).body;
    });
  }
  
  checkError(name){
    if(this.invoice[name].length == 0 || this.invoice[name] == 0){
      this.invoiceError[name] = true;
    } else{
      this.invoiceError[name] = false;
    }
  }
  
  cancel(){
    if(this.invoice.id == 0){
      if((this.invoice.invoiceNumber.length == 0 || this.invoice.invoiceNumber == 0) &&
        this.invoice.invoicedDate.length == 0 &&
        this.invoice.indvoicedueDate.length == 0 &&
        this.invoice.amount.length == 0 &&
        this.invoice.idProject.length == 0 &&
        this.invoice.idVendor.length == 0 &&
        this.invoice.costCode.length == 0 &&
        this.invoice.idOrder1.length == 0){
        this.modalRef.dismiss();
      } else{
        this.cancelModalRef = this.modalService.open(this.cancelModal, {
          size: '443',
          centered: true
        });
        this.cancelModalRef.result.then(
          (result) => {
            this.modalRef.close();
          },
          (reason) => {
            console.log(reason);
          })
      }
    } else{
      if(this.invoice.invoiceNumber == this.initialInvoice.invoiceNumber &&
        this.invoice.invoicedDate == this.initialInvoice.invoicedDate &&
        this.invoice.indvoicedueDate == this.initialInvoice.indvoicedueDate &&
        this.invoice.amount == this.initialInvoice.amount &&
        this.invoice.idProject == this.initialInvoice.idProject &&
        this.invoice.idVendor == this.initialInvoice.idVendor &&
        this.invoice.costCode == this.initialInvoice.costCode &&
        this.invoice.idOrder1 == this.initialInvoice.idOrder1){
        this.modalRef.dismiss();
      } else{
        this.cancelModalRef = this.modalService.open(this.cancelModal, {
          size: '443',
          centered: true
        });
        this.cancelModalRef.result.then(
          (result) => {
            this.modalRef.close();
          },
          (reason) => {
            console.log(reason);
          })
      }
    }
  }
  
  cancelBack(){
    this.cancelModalRef.dismiss();
  }
  
  cancelClose(){
    this.invoice = {...this.initialInvoice};
    this.cancelModalRef.close();
  }
  
  save(type){
    let message = 'Invoice saved to Inbox';
    if(this.invoice.invoicedDate.length == 0){
      this.invoiceError.invoicedDate = true;
      message='Invoice saved to Inbox and marked as Error';
    }
    if(this.invoice.invoiceNumber.length == 0 || this.invoice.invoiceNumber == 0){
      this.invoiceError.invoiceNumber = true;
      message='Invoice saved to Inbox and marked as Error';
    }
    if(this.invoice.idProject.length == 0 || this.invoice.idProject == 0){
      this.invoiceError.idProject = true;
      return;
    }
    let serviceName;
    if(this.invoice.id == 0){
      serviceName = projectinvoice_new;
    } else{
      serviceName = projectinvoice_update;
    }
    
    let params = {
      id: parseInt(this.invoice.id),
      idCompany: this.idCompany,
      idProject: parseInt(this.invoice.idProject),
      idVendor: parseInt(this.invoice.idVendor),
      idOrder1: parseInt(this.invoice.idOrder1),
      invoiceNumber: this.invoice.invoiceNumber ? this.invoice.invoiceNumber : '',
      invoicedDate: this.invoice.invoicedDate,
      indvoicedueDate: this.invoice.indvoicedueDate,
      costCode: this.invoice.costCode,
      amount: parseFloat(this.invoice.amount),
      revision: this.invoice.revision,
      invoiceFiles: [{
        fileName: this.invoice.fileName,
        fileType: this.invoice.fileType,
        fileSize: this.invoice.fileSize,
        fileUrl: this.invoice.fileUrl
      }]
    }
    
    
    this.apolloService.mutate(serviceName, params).then((res) => {
      let result: any = Object.values(res)[0];
      if(!result.error){
        if(type == 'save'){
          this.modalRef.close();
        } else{
          this.cancelModalRef.close();
        }
        this.toastrService.info(message, '');
      } else{
        this.toastrService.info(result.message, '');
      }
    })
  }
  
  protected readonly globalFunc = this.globalFuns;
}
