import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ApolloService } from "../../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";
import { vendorcontact_info, vendorcontact_new, vendorcontact_update } from 'src/app/core/gql/vendor-contacts'

@Component({
  selector: 'app-add-vendor-contact',
  templateUrl: './add-vendor-contact.component.html',
  styleUrls: ['./add-vendor-contact.component.scss']
})
export class AddVendorContactComponent {
  @Input() params;
  @Input() modalRef;
  
  constructor(
    private fb: UntypedFormBuilder,
    private apolloService: ApolloService,
    private toastrService: ToastrService
  ){}
  
  
  error: string = '';
  idvendor = 0;
  idcontact = 0;
  vendorName = '';
  revision = 0;
  
  addVendorContactForm: UntypedFormGroup = this.fb.group({
    name: ['',
      [
        Validators.required,
        Validators.maxLength(128)
      ]],
    email: ['',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(180)
      ]],
    phone: ['',
      [
        Validators.required,
        Validators.pattern('[- +()0-9]{10,12}'),
        Validators.maxLength(20)
      ]],
    notes: ['',
      [
        Validators.maxLength(250)
      ]]
  })
  
  ngOnInit(): void{
    this.idvendor = this.params.vendorContactParams.idvendor;
    this.idcontact = this.params.vendorContactParams.idcontact;
    this.vendorName = this.params.vendorContactParams.vendorName;
    if(this.idcontact > 0){
      this.getVendorContacts();
    }
  }
  
  /**
   * convenience getter for easy access to form fields
   */
  get formValues(){
    return this.addVendorContactForm.controls;
  }
  
  
  getVendorContacts(){
    this.apolloService.query(vendorcontact_info, {idVendor_contact: this.idcontact}).then((res) => {
      const result = res.vendorcontact_info;
      if(!result.error){
        this.formValues['name'].setValue(result.data['contactName']);
        this.formValues['email'].setValue(result.data['email']);
        this.formValues['phone'].setValue(result.data['phone']);
        this.formValues['notes'].setValue(result.data['notes']);
        this.revision = result.data['revision'];
      }
    })
  }
  
  notesChange(){
    console.log('**************', this.formValues['notes'].value.length);
  }
  
  onSubmit(){
    if(this.addVendorContactForm.valid){
      this.apolloService.mutate(this.idcontact > 0 ? vendorcontact_update : vendorcontact_new, {
        idVendor: this.idvendor,
        id: this.idcontact,
        revision: this.revision,
        contactName: this.formValues['name'].value,
        email: this.formValues['email'].value,
        phone: this.formValues['phone'].value,
        notes: this.formValues['notes'].value
      }).then((res) => {
        let result;
        if(this.idcontact > 0){
          result = res.vendorcontact_update;
        } else{
          result = res.vendorcontact_new;
        }
        if(!result.error){
          this.modalRef.modalRef.close('save success');
          this.toastrService.info('Save success', '');
        } else{
          this.toastrService.info(result.message, '');
        }
      }).catch((error) => {
        this.error = error;
      });
    }
  }
  
  closeModal(e){
    e.preventDefault();
    this.modalRef.modalRef.dismiss();
  }
  
}
