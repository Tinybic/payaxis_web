import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../core/service/http.service";
import { vendorcontact_list, vendorcontract_delete } from 'src/app/core/gql/vendorContacts';
import { Vendor_Contact } from 'src/app/core/generated/generated';


@Component({
  selector: 'app-vendor-contacts',
  templateUrl: './vendor-contacts.component.html',
  styleUrls: ['./vendor-contacts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorContactsComponent {
  @Input() params;
  @ViewChild('addVendorContactModal') addVendorContactModal: any;
  @ViewChild('deleteVendorContactModal') deleteVendorContactModal: any;
  
  modalRef: any;
  deleteModalRef: any;
  
  idvendor = 0;
  keywords = '';
  direction = '';
  sortCloumn = '';
  vendorContacts: Vendor_Contact[] = [];
  vendorContactParams = {
    idvendor: 0,
    idcontact: 0
  }
  
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    public  activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private httpService: HttpService
  ){}
  
  ngOnInit(): void{
    this.idvendor = this.params.idvendor;
    this.getVendorContacts();
  }
  
  getVendorContacts(){
    this.apolloService.query(vendorcontact_list, {idVendor: this.idvendor}).then((res) => {
      const result = res.vendorcontact_list;
      if(!result.error){
        this.vendorContacts = result.data;
      }
    })
  }
  
  
  searchTable(){}
  
  onSort(column){}
  
  openVendorContact(idcontact){
    this.modalRef = this.modalService.open(this.addVendorContactModal, {
      modalDialogClass: 'modal-right',
      size: '483',
      centered: true,
      backdrop: 'static'
    })
    
    this.modalRef.result.then((result) => {
      this.getVendorContacts();
    }, (reason) => {
      console.log('=======', reason);
    })
    
    this.vendorContactParams = {
      idvendor: this.idvendor,
      idcontact: idcontact
    }
  }
  
  
  deleteVendorContact(i){
    this.apolloService.mutate(vendorcontract_delete,{
      idVendor_contract: this.vendorContacts[i].id,
      revision: this.vendorContacts[i].revision
    }).then((res) => {
      const result = res.vendor_contract_delete;
      if(!result.error){
        this.toastrService.success('Delete success', '');
        this.vendorContacts.splice(i, 1);
      }else{
        this.toastrService.error(result.message, '');
      }
    }).catch((error) => {
      this.toastrService.error(error, '');
    });
  }
  
  openDeleteVendorContact(i){
    this.deleteModalRef = this.modalService.open(this.deleteVendorContactModal, {
      centered: true,
      backdrop: 'static'
    })
    this.deleteModalRef.result.then((result) => {
      this.deleteVendorContact(i);
    }, (reason) => {})
  }
  
  cancel(){
    this.deleteModalRef.dismiss('cancel');
  }
  
  confirm(){
    this.deleteModalRef.close('confirm');
  }
}
