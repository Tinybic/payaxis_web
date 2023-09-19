import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { vendorcontact_list, vendor_contact_deactivate } from 'src/app/core/gql/vendor-contacts';
import { Vendor_Contact } from 'src/app/core/generated/generated';
import { GlobalFunctionsService } from 'src/app/core/service/global-functions.service';


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
    idcontact: 0,
    vendorName: ''
  }
  isLoading = true;
  
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private globalFuns: GlobalFunctionsService
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
      this.isLoading = false;
    })
  }
  
  
  filterTable = (contact: any) => {
    let values = Object.values(contact);
    return values.some(v => v.toString().toLowerCase().includes(this.keywords.toLowerCase()));
  }
  
  onSort(column){
    this.sortCloumn = column;
    const result = this.globalFuns.onSort(this.vendorContacts, this.sortCloumn, this.direction);
    this.vendorContacts = result.newArray;
    this.direction = result.direction;
  }
  
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
      console.log(reason);
    })
    
    this.vendorContactParams = {
      idvendor: this.idvendor,
      idcontact: idcontact,
      vendorName: this.params.vendor.vendorName
    }
  }
  
  
  deleteVendorContact(i){
    this.apolloService.mutate(vendor_contact_deactivate, {
      idVendor_contact: this.vendorContacts[i].id,
      revision: this.vendorContacts[i].revision
    }).then((res) => {
      const result = res.vendor_contact_deactivate;
      if(!result.error){
        this.toastrService.info('Delete success', '');
        this.vendorContacts.splice(i, 1);
      } else{
        this.toastrService.info(result.message, '');
      }
    }).catch((error) => {
      this.toastrService.info(error, '');
    });
  }
  
  openDeleteVendorContact(i){
    this.deleteModalRef = this.modalService.open(this.deleteVendorContactModal, {
      centered: true,
      size: '483',
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
