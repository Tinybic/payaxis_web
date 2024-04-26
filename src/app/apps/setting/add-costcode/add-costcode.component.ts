import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  companycategory_list,
  companycostcode_new,
  companycostcode_update
} from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-add-costcode',
  templateUrl: './add-costcode.component.html',
  styleUrls: ['./add-costcode.component.scss']
})
export class AddCostcodeComponent {
  @ViewChild('addCategoryModal') addCategoryModal: NgbModalRef;
  @ViewChild('cancelcostcode') cancelcostcode: any;
  @Input() modalRef: any;
  @Input() type: any;
  @Input() data?: any;
  costcode = {
    id: 0,
    costCode: '',
    txtName: '',
    txtNotes: '',
    category: '',
    idCompany: 0,
    idCategory: 0,
    revision: 0
  };
  costcodeError = {
    costCode: false,
    txtName: false,
    idCategory: false
  };
  costCodeCategoryList = [];
  
  addmodalref;
  addCategoryModalRef: NgbModalRef;
  costcodeButtonText = 'Create';
  codeEdit = false;
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ){}
  
  ngOnInit(): void{
    this.getCostCodeCategoryList();
    this.addmodalref = this.modalRef;
    
    if(this.type) this.costcodeButtonText = this.type;
    else{
      this.costcodeButtonText = 'Create';
    }
    if(this.data){
      this.costcode.txtName = this.data.txtName;
      this.costcode.category = this.data.category;
      this.costcode.idCategory = this.data.idCategory;
      this.costcode.revision = this.data.revision;
      this.costcode.txtNotes = this.data.txtNotes;
      this.costcode.costCode = this.data.costCode;
      this.costcode.id = this.data.id;
      
      this.costcodetemp.txtName = this.data.txtName;
      this.costcodetemp.category = this.data.category;
      this.costcodetemp.idCategory = this.data.idCategory;
      this.costcodetemp.revision = this.data.revision;
      this.costcodetemp.txtNotes = this.data.txtNotes;
      this.costcodetemp.costCode = this.data.costCode;
      
      this.codeEdit = true;
    } else{
      this.costcode = {
        id: 0,
        costCode: '',
        txtName: '',
        txtNotes: '',
        category: '',
        idCompany: 0,
        idCategory: 0,
        revision: 0
      };
    }
  }
  
  getCostCodeCategoryList(){
    this.costcode.idCompany = parseInt(this.localStorage.getItem('idcompany'));
    if(this.costcode.idCompany != 0){
      this.apolloService.query(companycategory_list, {idCompany: this.costcode.idCompany}).then((res) => {
        const result = res.companycategory_list;
        if(!result.error){
          this.costCodeCategoryList = result.data;
        }
      });
    }
  }
  
  SetClass(event){
    this.costcode.category = event.txtName;
    this.costcode.idCategory = event.id;
    this.costcodeError.idCategory = false;
  }
  
  
  openAddCategoryModal(){
    this.addCategoryModalRef = this.modalService.open(this.addCategoryModal, {
      modalDialogClass: 'modal-right',
      size: '530',
      centered: true
    });
    
    this.addCategoryModalRef.result.then((result) => {
      if(result){
        this.getCostCodeCategoryList();
      }
    }, (reason) => {
      console.log(reason);
    })
  }
  
  
  createCostCode(){
    this.costcodeError = {
      costCode: false,
      txtName: false,
      idCategory: false
    };
    
    if(this.costcode.txtName.trim().length == 0){
      this.costcodeError.txtName = true;
      return;
    }
    if(this.costcode.costCode.trim().length == 0){
      this.costcodeError.costCode = true;
      return;
    }
    if(this.costcode.idCategory == 0 && this.costcode.category != 'Others'){
      this.costcodeError.idCategory = true;
      return;
    }
    
    if(this.costcode.id == 0){
      this.apolloService.mutate(companycostcode_new, {
        idCompany: this.costcode.idCompany,
        costCode: this.costcode.costCode,
        txtName: this.costcode.txtName,
        idCategory: this.costcode.idCategory,
        txtNotes: this.costcode.txtNotes
      }).then((res) => {
        const result = res.companycostcode_new;
        let message = '';
        if(!result.error){
          message = 'Cost Code created successfully';
          this.addmodalref.close();
        } else{
          message = result.message;
        }
        this.clearCostcode();
        this.getCostCodeCategoryList();
        this.toastrService.info(message, '');
      });
    } else{
      this.apolloService.mutate(companycostcode_update, {
        idCompany: this.costcode.idCompany,
        id: this.costcode.id,
        revision: this.costcode.revision,
        txtName: this.costcode.txtName,
        idCategory: this.costcode.idCategory,
        txtNotes: this.costcode.txtNotes
      }).then((res) => {
        const result = res.companycostcode_update;
        let message = '';
        if(!result.error){
          message = 'Cost Code update successfully';
          this.costcode.id = 0;
          this.clearCostcode();
          this.getCostCodeCategoryList();
          this.addmodalref.close();
        } else{
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
    }
  }
  
  costcodetemp = {
    txtName: '',
    category: '',
    idCategory: 0,
    revision: 0,
    txtNotes: '',
    costCode: ''
  };
  
  
  // updateCostCode(item) {
  //   this.costcode.txtName = item.txtName;
  //   this.costcode.category = item.category;
  //   this.costcode.idCategory = item.idCategory;
  //   this.costcode.revision = item.revision;
  //   this.costcode.txtNotes = item.txtNotes;
  //   this.costcode.costCode = item.costCode;
  //   this.costcode.id = item.id;
  
  //   this.costcodetemp.txtName = item.txtName;
  //   this.costcodetemp.category = item.category;
  //   this.costcodetemp.idCategory = item.idCategory;
  //   this.costcodetemp.revision = item.revision;
  //   this.costcodetemp.txtNotes = item.txtNotes;
  //   this.costcodetemp.costCode = item.costCode;
  //   //this.openAddModal('Save changes');
  // }
  
  cancelCostCodeRef;
  
  openCancelCostCode(){
    if(
      (this.costcode.id == 0 &&
        this.costcode.txtName.length == 0 &&
        this.costcode.costCode.length == 0) ||
      (this.costcode.id > 0 &&
        this.costcodetemp.txtName == this.costcode.txtName &&
        this.costcodetemp.category == this.costcode.category &&
        this.costcodetemp.idCategory == this.costcode.idCategory &&
        this.costcodetemp.txtNotes == this.costcode.txtNotes &&
        this.costcodetemp.costCode == this.costcode.costCode)
    ){
      this.addmodalref.close();
      this.clearCostcode();
    } else{
      this.cancelCostCodeRef = this.modalService.open(this.cancelcostcode, {
        size: '530',
        centered: true
      });
    }
  }
  
  clearCostcode(){
    this.costcode.id = 0;
    this.costcode.costCode = '';
    this.costcode.txtName = '';
    this.costcode.txtNotes = '';
    this.costcode.category = '';
    this.costcode.idCategory = 0;
    this.costcode.revision = 0;
    
    this.costcodeError = {
      costCode: false,
      txtName: false,
      idCategory: false
    };
  }
  
  cancelCostCode(){
    this.cancelCostCodeRef.close();
  }
  
  closeCancelCostCode(){
    this.clearCostcode();
    
    this.cancelCostCodeRef.close();
    this.addmodalref.close();
  }
  
  SaveCancelCostCode(){
    this.cancelCostCodeRef.close();
    this.createCostCode();
  }
}
