import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { GlobalFunctionsService } from "../../../services/global-functions.service";
import { Company_Role } from "../../../core/generated/generated";
import { company_roles } from "../../../core/gql/roles";
import { company_info } from "../../../core/gql/company";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesComponent {
  @ViewChild('addRoleModal') addRoleModal: any;
  @ViewChild('deleteRoleModal') deleteRoleModal: any;
  
  
  modalRef: any;
  deleteModalRef: any;
  
  idCompany = 0;
  keywords = '';
  direction = '';
  sortCloumn = '';
  roles: Company_Role[] = [];
  rolesParams = {
    idCompany: 0,
    idRole: 0,
  }
  
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private globalFuns: GlobalFunctionsService
  ){}
  
  ngOnInit(): void{
    if(localStorage.getItem('idcompany')){
      this.idCompany = parseInt(localStorage.getItem('idcompany'));
      this.getRoles();
    }
  }
  
  getRoles(){
    this.apolloService.query(company_roles, {idCompany: this.idCompany}).then((res) => {
      const result = res.company_roles;
      if(!result.error){
        this.roles = result.data;
      }
    })
  }
  
  
  filterTable = (role: Company_Role) => {
    let values = Object.values(role);
    return values.some(v => v.toString().toLowerCase().includes(this.keywords.toLowerCase()));
  }
  
  onSort(column){
    this.sortCloumn = column;
    const result = this.globalFuns.onSort(this.roles, this.sortCloumn, this.direction);
    this.roles = result.newArray;
    this.direction = result.direction;
  }
  
  openRoleModal(idRole){
    this.modalRef = this.modalService.open(this.addRoleModal, {
      modalDialogClass: 'modal-right',
      size: '483',
      centered: true,
      backdrop: 'static'
    })
    
    this.modalRef.result.then((result) => {
      this.getRoles();
    }, (reason) => {
      console.log(reason);
    })
    
    this.rolesParams = {
      idCompany: this.idCompany,
      idRole: idRole,
    }
  }
  
  
  deleteRole(i){
    // this.apolloService.mutate(vendor_contact_deactivate, {
    //   idVendor_contact: this.roles[i].id,
    //   revision: this.roles[i].revision
    // }).then((res) => {
    //   const result = res.vendor_contact_deactivate;
    //   if(!result.error){
    //     this.toastrService.success('Delete success', '');
    //     this.roles.splice(i, 1);
    //   } else{
    //     this.toastrService.error(result.message, '');
    //   }
    // }).catch((error) => {
    //   this.toastrService.error(error, '');
    // });
  }
  
  openDeleteRole(i){
    this.deleteModalRef = this.modalService.open(this.deleteRoleModal, {
      centered: true,
      size: '483',
      backdrop: 'static'
    })
    this.deleteModalRef.result.then((result) => {
      this.deleteRole(i);
    }, (reason) => {})
  }
  
  cancel(){
    this.deleteModalRef.dismiss('cancel');
  }
  
  confirm(){
    this.deleteModalRef.close('confirm');
  }
  
}
