import { RtlScrollAxisType } from '@angular/cdk/platform';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EventType } from 'src/app/core/constants/events';
import { PAYMENTTERM } from 'src/app/core/constants/payment';
import { categorycostcode_list } from 'src/app/core/gql/costcode';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import {
  projectorder_info,
  projectorder_new,
  projectorder_newnumber,
  projectorder_reasonlist,
  projectorder_related,
  projectorder_update
} from 'src/app/core/gql/order';
import { projectorder_uploadfiles } from 'src/app/core/gql/orders';
import { companyproject_list } from 'src/app/core/gql/project';
import { vendor_list } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { EventService } from 'src/app/core/service/event.service';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent {
  @ViewChild('listitem', {static: true}) listitem: ElementRef;
  @ViewChild('addcostcode') addcostcode: any;
  @ViewChild('addvendor') addvendor: any;
  @ViewChild('addproject') addproject: any;
  @ViewChild('t') t: any;
  tabs1 = 1;
  reasonList = [];
  paymentTermsList = PAYMENTTERM;
  order = {
    id: 0,
    revision: 0,
    idCompany: 0,
    idProject: 0,
    idVendor: 0,
    orderNumber: 0,
    idReason: 0,
    invoiceNumber: '',
    invoicedDate: '',
    indvoicedueDate: '',
    paymentTerms: '',
    costCode: '',
    notes: '',
    nontaxable: 0.0,
    taxable: 0.0,
    taxrate: 0.0,
    tax: 0.0,
    total: 0.0,
    status: '',
    listItems: []
  };
  
  attachmentFilesTemp = [];
  isUploading = false;
  
  showRelated = false;
  orderError = {
    costcode: -1,
    idProject: -1,
    idVendor: -1,
    invoicedDate: -1,
    indvoicedueDate: -1
  };
  submitForm = false;
  keywordsVendor = '';
  keywordsProject = '';
  keywordsListItem = '';
  costCodeList = [];
  COSTCODE_LIST = [];
  vendorcostcodesText = '';
  txtReason = '';
  sortCloumn = '';
  loading = true;
  direction = 'asc';
  
  projectList = [];
  projectGroupList = [];
  PROJECTLIST = [];
  vendorList = [];
  VENDORLIST = [];
  
  relatedList = [];
  RELATEDLIST = [];
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info'
  ];
  
  idOrder = 0;

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ){}
  
  ngOnInit(): void{
    this.order.idCompany = parseInt(localStorage.getItem('idcompany'));
    
    this.paymentTermsList = PAYMENTTERM;
    
    this.activatedRoute.params.subscribe((params) => {
      // idOrder 的数值范围 [-idproject, 0 , idOrder]
      this.idOrder = parseInt(params['id']);
      if(this.idOrder > 0){
        this.order.id = this.idOrder;
        this.getOrderInfo(this.order.id);
      }
      if(this.idOrder < 1){
        this.order.id = 0;
        if(this.idOrder < 0){
          this.order.idProject = -this.idOrder;
        }
        //this.order.invoicedDate = new Date().toISOString().slice(0, 10);
        this.getOrderNumber();
        this.getCostCodeList();
        this.getResonList();
        this.getProjectList();
        this.getVendorList();
        this.loading = false;
        
        for(let i = 0; i < 2; i++){
          this.order.listItems.push({
            paidyn: false,
            description: '',
            unit: '',
            qty: '',
            price: '',
            amount: '',
            taxyn: false,
            notes: ''
          });
        }
      }
    });
  }

  clickAllOrder(){
    if(this.idOrder < 0){
      this.router.navigate(['apps/projects/detail/' + -this.idOrder]);
    }
    else{
      this.router.navigate(['apps/order']);
    }
  }
  
  getUploadUrl(event){
    this.attachmentFilesTemp = [];
    for(var i = 0; i < event.target.files.length; i++){
      this.isUploading = true;
      this.eventService.broadcast(EventType.REFRESH_ATTACHMENTS, true);
      const file = event.target.files[i];
      if(file){
        this.handleUploadTemp(file, event.target.files.length);
      }
    }
  }
  
  handleUploadTemp(file, filesLength){
    const fileName = getNewFileName(file.name);
    file.filename = fileName;
    this.apolloService.query(get_file_url, {
      fileName: fileName,
      folder: 'files'
    }).then((res) => {
      if(!res.get_file_url.error){
        let uploadUrl = res.get_file_url.data;
        this.httpService.put(uploadUrl, file).then((res) => {
          this.attachmentFilesTemp.push({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
            fileUrl: uploadUrl.split('?')[0]
          });
          
          if(this.attachmentFilesTemp.length == filesLength){
            this.attachmentUploadFile();
          }
        });
      }
    });
  }
  
  attachmentUploadFile(){
    this.apolloService.mutate(projectorder_uploadfiles, {
      idCompany: parseInt(localStorage.getItem('idcompany')),
      idOrder1: this.order.id,
      orderFiles: this.attachmentFilesTemp
    }).then((res) => {
      const result = res.projectorder_uploadfiles;
      let message = '';
      if(!result.error){
        message = 'Upload successful';
      } else{
        message = result.message;
      }
      this.isUploading = false;
      this.eventService.broadcast(EventType.REFRESH_ATTACHMENTS, false);
      this.toastrService.info(message, '');
    });
  }
  
  getOrderInfo(id){
    this.apolloService.query(projectorder_info, {
      idCompany: this.order.idCompany,
      id: id
    }).then((res) => {
      const result = res.projectorder_info;
      if(!result.error){
        this.order = {
          id: result.data.projectOrder.id,
          revision: result.data.projectOrder.revision,
          idCompany: result.data.projectOrder.idCompany,
          idProject: result.data.projectOrder.idProject,
          idVendor: result.data.projectOrder.idVendor,
          orderNumber: result.data.projectOrder.orderNumber,
          idReason: result.data.projectOrder.idReason,
          invoiceNumber: result.data.projectOrder.invoiceNumber,
          invoicedDate: result.data.projectOrder.invoicedDate,
          indvoicedueDate: result.data.projectOrder.indvoicedueDate,
          paymentTerms: result.data.projectOrder.paymentTerms,
          costCode: result.data.projectOrder.costCode,
          notes: result.data.projectOrder.notes,
          nontaxable: result.data.projectOrder.nontaxable,
          taxable: result.data.projectOrder.taxable,
          taxrate: result.data.projectOrder.taxrate,
          tax: result.data.projectOrder.tax,
          total: result.data.projectOrder.total,
          status: result.data.projectOrder.status,
          listItems: result.data.listItems
        };
        this.getCostCodeList();
        this.getResonList();
        this.getProjectList();
        this.getVendorList();
        this.getRelatedList();
        this.loading = false;
        
        //if(this.order.listItems.length > 9){
          this.order.listItems.push({
            paidyn: false,
            description: '',
            unit: '',
            qty: '',
            price: '',
            amount: '',
            taxyn: false,
            notes: ''
          });
        // } else{
        //   const length = 10 - this.order.listItems.length;
        //   for(let i = 0; i < length; i++){
        //     this.order.listItems.push({
        //       paidyn: false,
        //       description: '',
        //       unit: '',
        //       qty: 0.0,
        //       price: 0.0,
        //       amount: 0.0,
        //       taxyn: false,
        //       notes: ''
        //     });
        //   }
        // }
      }
    });
  }
  
  sameProject = true;
  sameVendor = true;
  paidyn = false;
  relatedIndex = 0;
  
  getRelatedList(){
    this.apolloService.query(projectorder_related, {
      idCompany: this.order.idCompany,
      idProject: this.sameProject ? this.order.idProject : 0,
      idVendor: this.sameVendor ? this.order.idVendor : 0,
      paidyn: this.paidyn
    }).then((res) => {
      const result = res.projectorder_related;
      if(!result.error){
        this.relatedList = result.data;
        this.RELATEDLIST = JSON.parse(JSON.stringify(result.data));
        this.relatedIndex = 0;
      }
    });
  }
  
  FilterRelatedList(item){
    if(item == 1){
      this.sameProject = !this.sameProject;
    } else if(item == 2){
      this.sameVendor = !this.sameVendor;
    } else{
      this.paidyn = !this.paidyn;
    }
    
    this.getRelatedList();
  }
  
  getOrderNumber(){
    this.apolloService.query(projectorder_newnumber, {idCompany: this.order.idCompany}).then((res) => {
      const result = res.projectorder_newnumber;
      if(!result.error){
        this.order.orderNumber = result.data;
      }
    });
  }
  
  getResonList(){
    this.apolloService.query(projectorder_reasonlist, {idCompany: this.order.idCompany}).then((res) => {
      const result = res.projectorder_reasonlist;
      if(!result.error){
        this.reasonList = result.data;
      }
      this.setReason();
    });
  }
  
  groupBy(arr, key){
    return arr.reduce((acc, curr) => {
      (acc[curr[key]] = acc[curr[key]] || []).push(curr);
      return acc;
    }, {});
  }
  
  getProjectList(){
    this.projectGroupList = [];
    this.apolloService.query(companyproject_list, {idCompany: this.order.idCompany}).then((res) => {
      const result = res.companyproject_list;
      if(!result.error){
        this.PROJECTLIST = JSON.parse(JSON.stringify(result.data));
        this.projectList = this.groupBy(result.data, 'idGroup');
        for(let key in this.projectList){
          this.projectGroupList.push(this.projectList[key]);
        }
      }
      this.setProject();
    });
  }
  
  getVendorList(){
    this.apolloService.query(vendor_list, {idCompany: this.order.idCompany}).then((res) => {
      const result = res.vendor_list;
      if(!result.error){
        this.vendorList = result.data;
        this.VENDORLIST = JSON.parse(JSON.stringify(this.vendorList));
      }
      this.setVendor();
    });
  }
  
  getCostCodeList(){
    this.order.idCompany = parseInt(localStorage.getItem('idcompany'));
    if(this.order.idCompany != 0){
      this.apolloService.query(categorycostcode_list, {idCompany: this.order.idCompany}).then((res) => {
        const result = res.categorycostcode_list;
        if(!result.error){
          this.costCodeList = result.data;
          this.COSTCODE_LIST = JSON.parse(JSON.stringify(result.data));
        }
        this.setCostCodeName();
        if(this.costCodeList.length == 1 && this.costCodeList[0].costcodelist.length == 1){
          this.vendorcostcodesText = this.costCodeList[0].costcodelist[0].txtName;
          this.order.costCode = this.costCodeList[0].costcodelist[0].costCode;
          this.setCostCodeSelect(this.costCodeList[0].costcodelist[0]);
        }
      });
    }
  }
  
  selectReason(item){
    this.txtReason = item.txtName;
    this.order.idReason = item.id;
  }
  
  setReason(){
    this.reasonList.forEach((item) => {
      if(item.id == this.order.idReason){
        this.txtReason = item.txtName;
      }
    });
  }
  
  setCostCodeSelect(costcode){
    let result = false;
    if(this.order.costCode == costcode){
      result = true;
    }
    return result;
  }
  
  setCostCodeName(){
    this.costCodeList.forEach((item) => {
      item.costcodelist.forEach((costcode) => {
        if(costcode.costCode == this.order.costCode){
          this.vendorcostcodesText = costcode.txtName;
          return;
        }
      });
    });
  }
  
  dropdownSelect(item){
    this.order.paymentTerms = item;
  }
  
  project: any;
  
  selectProject(project){
    this.project = project;
    this.order.idProject = project.id;
  }
  
  removeProject(){
    this.project = null;
    this.order.idProject = 0;
  }
  
  setProject(){
    this.projectGroupList.forEach((item) => {
      item.forEach((project) => {
        if(this.order.idProject == project.id){
          this.project = project;
          return;
        }
      });
    });
  }
  
  vendor: any;
  
  selectVendor(vendor){
    this.vendor = vendor;
    this.order.idVendor = vendor.id;
    this.order.taxrate = vendor.taxrate;
  }
  
  removeVendor(){
    this.vendor = null;
    this.order.idVendor = 0;
    this.order.taxrate = 0.0;
  }
  
  setVendor(){
    this.vendorList.forEach((item) => {
      if(item.id == this.order.idVendor){
        this.vendor = item;
        return;
      }
    });
  }
  
  costCodeSelect(event, item){
    if(event.currentTarget.checked){
      this.vendorcostcodesText = item.txtName;
      this.order.costCode = item.costCode;
    } else{
      this.vendorcostcodesText = '';
      this.order.costCode = '';
    }
  }
  
  keywordsCostCode = '';
  
  costCodeFilter(){
    this.costCodeList = JSON.parse(JSON.stringify(this.COSTCODE_LIST));
    this.costCodeList = this.costCodeList.filter((costcode) => {
      costcode.costcodelist = costcode.costcodelist.filter((item) =>
        item.txtName.toLowerCase().includes(this.keywordsCostCode.toLowerCase())
      );
      return costcode;
    });
  }
  
  projectFilter(){
    this.projectList = JSON.parse(JSON.stringify(this.PROJECTLIST));
    
    this.projectList = this.projectList.filter((item) =>
      item.projectName.toLowerCase().includes(this.keywordsProject.toLowerCase())
    );
    this.projectList = this.groupBy(this.projectList, 'idGroup');
    this.projectGroupList = [];
    for(let key in this.projectList){
      this.projectGroupList.push(this.projectList[key]);
    }
  }
  
  vendorFilter(){
    this.vendorList = JSON.parse(JSON.stringify(this.VENDORLIST));
    this.vendorList = this.vendorList.filter((item) =>
      item.vendorName.toLowerCase().includes(this.keywordsVendor.toLowerCase())
    );
  }
  
  keywordsRelated = '';
  
  relatedFilter(){
    this.relatedList = JSON.parse(JSON.stringify(this.RELATEDLIST));
    this.relatedList = this.relatedList.filter(
      (item) =>
        item.orderNumber.toString().toLowerCase().includes(this.keywordsRelated.toLowerCase()) ||
        item.projectName.toLowerCase().includes(this.keywordsRelated.toLowerCase())
    );
  }
  
  onSort(columnName){}
  
  AddListItem(index, item){
    if(
      index == this.order.listItems.length - 1 &&
      item.description.length > 0
    ){
      this.order.listItems.push({
        paidyn: false,
        description: '',
        unit: '',
        qty: 0.0,
        price: 0.0,
        amount: 0.0,
        taxyn: false,
        notes: ''
      });
    }
  }
  
  getAmout(item){
    item.amount = parseFloat(item.qty) * parseFloat(item.price);
    this.setTotal();
  }
  
  setTotal(){
    this.order.taxable = 0.0;
    this.order.nontaxable = 0.0;
    this.order.listItems.forEach((item) => {
      if(item.taxyn){
        this.order.taxable += item.amount;
      } else{
        this.order.nontaxable += item.amount;
      }
    });

    this.order.taxable = parseFloat(this.order.taxable.toString());
    this.order.nontaxable = parseFloat(this.order.nontaxable.toString());

    this.order.tax = (this.order.taxrate * this.order.taxable) / 100;
    this.order.total =
      this.order.taxable + this.order.nontaxable + this.order.tax;
  }
  
  saveOrder(){
    if(this.order.costCode == ''){
      this.orderError.costcode = 0;
      return;
    } else{
      this.orderError.costcode = -1;
    }
    
    if(this.order.idProject == 0){
      this.orderError.idProject = 0;
      return;
    } else{
      this.orderError.idProject = -1;
    }
    
    if(this.order.idVendor == 0){
      this.orderError.idVendor = 0;
      return;
    } else{
      this.orderError.idVendor = -1;
    }
    
    if(this.order.invoicedDate.length == 0){
      this.orderError.invoicedDate = 0;
      return;
    } else{
      this.orderError.invoicedDate = -1;
    }
    
    if(this.order.indvoicedueDate.length == 0){
      this.orderError.indvoicedueDate = 0;
      return;
    } else{
      this.orderError.indvoicedueDate = -1;
    }

    let listitemPara = [];
    this.order.listItems.forEach((item) => {
      if(item.description.length > 0){
        item.price = parseFloat(item.price);
        item.qty = parseFloat(item.qty);
        item.amount = parseFloat(item.amount);
        listitemPara.push({
          amount: item.amount,
          description: item.description,
          qty: item.qty,
          notes: item.notes,
          paidyn: item.paidyn,
          unit: item.unit,
          taxyn: item.taxyn,
          price: item.price
        });
      }
    });
    
    this.order.taxable = parseFloat(this.order.taxable.toString());
    this.order.total = parseFloat(this.order.total.toString());

    if(listitemPara.length == 0){
      this.toastrService.info('At least one list item to save', '', {
        positionClass: 'toast-top-right-order'
      });
      return;
    }
    
    this.order.listItems = listitemPara;
    let gql = projectorder_new;
    if(this.order.id > 0){
      gql = projectorder_update;
    }
    
    this.apolloService.mutate(gql, this.order).then((res) => {
      let result;
      if(this.order.id > 0){
        result = res.projectorder_update;
      } else{
        result = res.projectorder_new;
      }
      let message = '';
      if(!result.error){
        message = 'Save successful';
        this.clickAllOrder();
      } else{
        message = result.message;
      }
      this.toastrService.info(message, '', {
        positionClass: 'toast-top-right-order'
      });
    });
  }
  
  addmodalref;
  costcodeButtonText = '';
  modalData;
  
  openAddCostCodeModal(text){
    if(text) this.costcodeButtonText = text;
    else{
      this.costcodeButtonText = 'Create';
    }
    this.addmodalref = this.modalService.open(this.addcostcode, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '530'
    });
    this.addmodalref.result.then(
      (res) => {
        this.getCostCodeList();
      },
      (dismiss) => {
        this.getCostCodeList();
      }
    );
  }
  
  addProjectmodalRef;
  
  openAddProjectModal(){
    this.addProjectmodalRef = this.modalService.open(this.addproject, {
      modalDialogClass: 'modal-right',
      size: '640',
      centered: true,
      backdrop: 'static'
    });
    
    this.addProjectmodalRef.result.then(
      (projectId) => {
        // get projects
        this.order.idProject = projectId;
        this.getProjectList();
      },
      (reason) => {
        this.getProjectList();
      }
    );
  }
  
  modalVendorRef;
  
  openAddVenodrModal(){
    this.modalVendorRef = this.modalService.open(this.addvendor, {
      backdrop: 'static',
      modalDialogClass: 'modal-right',
      size: '90vw',
      centered: true
    });
    
    this.modalVendorRef.result.then(
      (res) => {
        this.getVendorList();
      },
      (dismiss) => {
        this.getVendorList();
      }
    );
  }
  
  listItemCopy(item, index){
    this.order.listItems.splice(index + 1, 0, JSON.parse(JSON.stringify(item)));
    this.setTotal();
  }
  
  listItemDelete(index, item){
    if(!item.paidyn && this.order.listItems.length > 5){
      this.order.listItems.splice(index, 1);
      this.setTotal();
    }
  }
  getVendorId(event){
    this.order.idVendor = event;
    this.setVendor();
  }
  openDetail(id){
    this.router.navigate(['apps/order/detail/' + id]);
  }
}
