import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  company_members,
  company_member_invite,
  company_member_deactivate,
  company_member_edit,
  companymember_emails,
} from 'src/app/core/gql/team';
import { ROLEITEMS, APPROVALAMOUNT } from 'src/app/core/constants/members';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { company_invitedmember_deactivate, company_roles } from 'src/app/core/gql/company';
import { FormControl } from '@angular/forms';
import { Base } from 'src/app/core/base';
import { companyproject_list } from "../../../core/gql/project";
@Component({
  selector: 'app-teamlist',
  templateUrl: './teamlist.component.html',
  styleUrls: [
    './teamlist.component.scss',
    '../../../../assets/scss/custom/structure/_foundation-themes.scss',
  ],
})
export class TeamlistComponent extends Base {
  @ViewChild('inviteMember') inviteMember: any;
  @ViewChild('deleteModal') deleteModal: any;

  statusFilter: string = 'All';
  members = [];
  projects = [];
  COMPANY_MEMBERS = [];
  bgColors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-success',
    'bg-warning',
    'bg-info',
  ];
  allCount: number = 0;
  activeCount: number = 0;
  pendingCount: number = 0;
  showCount: number = 0;
  email: string = '';
  emailList = [];
  step: string = 'step1';
  keywords = '';
  userList = [];
  direction = 'asc';
  sortColumn = '';
  companyName = '';
  idUserOwner = '';
  idUser = '';
  roleItems = [];
  approvalAmount = APPROVALAMOUNT;
  editFlag: boolean = true;
  edit = [];
  approvalAmountFilter = 'Approval Amount';
  roleFilter = 'Approval';
  projectFilter = 'Project'
  loading = true;

  canEdit = false;
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {
    super();
  }

  startEdit() {
    if (this.idUser == this.idUserOwner) this.editFlag = true;
  }

  editRoleValue(item, value) {
    item.idRole = value.id;
    item.role = value.text;
    this.pushEditArray(item);
    this.saveEdit();
  }

  editApprovalAmount(item, value) {
    item.approvalAmount = value.id;
    this.pushEditArray(item);
    this.saveEdit();
  }

  pushEditArray(info) {
    let item = this.edit.find((item) => item.id == info.id);
    if (item) {
      item = info;
    } else {
      this.edit.push(info);
    }
  }

  saveEdit() {
    const members = this.edit.map((item) => {
      return Object.assign(
        {},
        {
          idcompany_member: item.id,
          idRole: item.idRole,
          approvalAmount: item.approvalAmount,
          revision: item.revision,
        }
      );
    });

    const data = {
      idCompany: parseInt(localStorage.getItem('idcompany')),
      companymembers: members,
    };
    this.apolloService.mutate(company_member_edit, data).then((res) => {
      let message = '';
      const result = res.company_member_edit;
      if (!result.error) {
        message = this.edit.length + ' members has been update';
      } else {
        message = result.message;
      }
      this.edit = [];
      this.toastrService.info(message, '');
      this.getCompanyMembers();
    });
  }

  changeStatusFilter(filter: string) {
    this.statusFilter = filter;
    this.members = this.COMPANY_MEMBERS;
    this.showCount = this.allCount;
    if (filter == 'Active') {
      
      this.members = this.members.filter(
        (member) => member.active && member.idUser > 0
      );
      this.showCount = this.activeCount;
    } else if (filter == 'Pending') {
      this.members = this.members.filter((member) => member.idUser == 0);
      this.showCount = this.pendingCount;
    }
  }

  changeRoleFilter(filter: string) {
    this.roleFilter = filter;
    this.members = this.COMPANY_MEMBERS;
    if (filter != 'All') {
      this.members = this.members.filter((member) => member.role == filter);
    }
  }

  changeapprovalAmountFilter(filter: string) {
    this.approvalAmountFilter = filter;
    this.members = this.COMPANY_MEMBERS;
    if (filter != 'All') {
      this.members = this.members.filter(
        (member) => member.approvalAmount == filter
      );
    }
  }

  ngOnInit(): void {
    this.canEdit = super.setRole('Manage company users');
    this.idUser = localStorage.getItem('id');
    this.idUserOwner = localStorage.getItem('idUserOwner');
    this.companyName = localStorage.getItem('companyName');

    this.apolloService
      .query(company_roles, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.company_roles;
        if (!result.error) {
          this.roleItems = result.data.map((item) => {
            return Object.assign(
              {},
              {
                id: item.idRole,
                text: item.txtName,
              }
            );
          });
        }
      });
    
    this.getProjects();
    this.getCompanyMembers();
  }
  
  getProjects(){
    this.apolloService.query(companyproject_list,
      {idCompany: parseInt(localStorage.getItem('idcompany'))}).then((res) => {
      const result = res.companyproject_list;
      if(!result.error){
        this.projects = JSON.parse(JSON.stringify(result.data));
        this.projects.map(project => project['checked'] = false);
        this.projects.unshift({
          id: 'all',
          projectName: 'All',
          checked: false
        })
      }
    });
  }

  getCompanyMembers() {
    if (localStorage.getItem('idcompany')) {
      this.apolloService
        .query(company_members, {
          idCompany: parseInt(localStorage.getItem('idcompany')),
        })
        .then((res) => {
          const result = res.company_members;
          if (!result.error) {
            this.members = result.data;
            this.COMPANY_MEMBERS = JSON.parse(JSON.stringify(result.data));

            this.allCount = result.data.length;
            this.activeCount = result.data.filter(
              (member) => member.active && member.idUser > 0
            ).length;
            this.pendingCount = result.data.filter(
              (member) => member.idUser == 0
            ).length;
            this.showCount = this.allCount;
            this.loading = false;
          }
        });
    }
  }

  public alertOption: SweetAlertOptions = {};

  deleteFirstname = '';
  deleteLastname = '';
  deleteIndex = '';

  deactive(index) {
    this.deleteFirstname = this.members[index].firstName;
    this.deleteLastname = this.members[index].lastName;
    this.deleteIndex = index;

    this.openVerticallyCentered(this.deleteModal);
  }

  deactiveMembers() {

    let gql = company_member_deactivate;
    if(this.members[this.deleteIndex].idUser == 0){
      gql = company_invitedmember_deactivate;
    }


    console.log(this.members[this.deleteIndex])

    this.apolloService
      .mutate(gql, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: this.members[this.deleteIndex].id,
        revision: this.members[this.deleteIndex].revision,
      })
      .then((res) => {
        let message = '';
        let result;
        if(this.members[this.deleteIndex].idUser == 0){
          result = company_invitedmember_deactivate;
        }
        else{
          result = res.company_member_deactivate;
        }
    
        message = result.message;
        this.getCompanyMembers();
        this.toastrService.info(message, '');
        this.modalService.dismissAll();
      });
  }


  // compares two cell values
  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name, sort direction
   */
  onSort(column: string): void {
    this.sortColumn = column;
    if (this.direction == 'desc') {
      this.direction = 'asc';
    } else {
      this.direction = 'desc';
    }

    this.members = [...this.members].sort((a, b) => {
      const res = this.compare(a[this.sortColumn], b[this.sortColumn]);
      return this.direction === 'asc' ? res : -res;
    });
  }

  filterTable = (member: any) => {
    let values = Object.values(member);
    return values.some(
      (v) =>
        member.firstName.toLowerCase().includes(this.keywords.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  };

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, {
      backdrop: 'static',
      size: '530',
      centered: true,
    });
  }

  inviteMembers() {
    if (this.idUser == this.idUserOwner && this.canEdit)
      this.openVerticallyCentered(this.inviteMember);
  }

  cancelModal() {
    this.modalService.dismissAll();
    this.emailList = [];
    this.step = 'step1';
  }

  isEmail(email: string) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return expression.test(email);
  }

  deleteEmail(index) {
    this.emailList.splice(index, 1);
  }

  public validators = [this.must_be_email];
  public errorMessages = {
    must_be_email: 'Enter valid email adress!',
  };
  private must_be_email(control: FormControl) {
    var EMAIL_REGEXP =
      /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { must_be_email: true };
    }
    return null;
  }

  step1() {
    let data = [];
    this.userList = [];
    this.emailList.forEach((item) => {
      data.push(item.value);
    });
    this.apolloService
      .query(companymember_emails, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        emaillist: data,
      })
      .then((res) => {
        if (!res.companymember_emails.error) {
          res.companymember_emails.data.forEach((item) => {
            this.userList.push({
              email: item.email,
              memberyn: item.memberyn,
              idRole: this.roleItems[0].id,
              role: this.roleItems[0].text,
              approvalAmount: 0,
              approvalAmountText: 'Approval Limit',
            });
          });

          this.step = 'step3';
        }
      });
  }

  step3Approval(item, event) {
    item.approvalAmount = event.id;
    item.approvalAmountText = event.text;
  }
  step3Role(item, event) {
    item.idRole = event.id;
    item.role = event.text;
  }

  send() {
    this.modalService.dismissAll();
    this.userList = this.userList.filter((item) => !item.memberyn);
    console.log(this.userList);
    const inviteMembers = this.userList.map((item) => {
      return Object.assign(
        {},
        {
          email: item.email,
          idRole: item.idRole,
          approvalAmount: item.approvalAmount,
        }
      );
    });

    const data = {
      idCompany: parseInt(localStorage.getItem('idcompany')),
      inviteMembers: inviteMembers,
    };

    this.apolloService.mutate(company_member_invite, data).then((res) => {
      let message = '';
      const result = res.company_member_invite;
      if (!result.error) {
        message = this.userList.length + ' invitation has been sent';
        this.getCompanyMembers();
      } else {
        message = result.message;
      }
      this.step = 'step1';
      this.email = '';
      this.emailList = [];
      this.toastrService.info(message, '');
    });
  }
}
