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
import { company_roles } from 'src/app/core/gql/company';
import { FormControl } from '@angular/forms';
import {
  project_members,
  projectmember_deactivate,
  projectmember_edit,
  projectmember_invite,
} from 'src/app/core/gql/project-detail';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/service/event.service';
import { EventType } from 'src/app/core/constants/events';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';
@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: [
    './project-team.component.scss',
    '../../../../assets/scss/custom/structure/_foundation-themes.scss',
  ],
})
export class ProjectTeamComponent {
  @ViewChild('inviteMember') inviteMember: any;
  @ViewChild('deleteModal') deleteModal: any;

  statusFilter: string = 'All';
  members = [];
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
  inviteList = [];
  step: string = 'step1';
  keywords: string = '';
  userList = [];
  direction = 'asc';
  sortColumn = '';
  projectName = '';
  idUserOwner = '';
  idUser = '';
  roleItems = [];
  approvalAmount = APPROVALAMOUNT;
  editFlag: boolean = false;
  edit = [];
  approvalAmountFilter = 'Approval Amount';
  roleFilter = 'Approval';
  loading = true;
  idProject = 0;
  companyMembers = [];

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private localStorage: LocalStorageService
  ) {
    this.eventService.on(EventType.PROJECT_DEDAIL_INVITE).subscribe(() => {
      this.inviteMembers();
    });
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
      idCompany: parseInt(this.localStorage.getItem('idcompany')),
      idProject: this.idProject,
      companymembers: members,
    };
    this.apolloService.mutate(projectmember_edit, data).then((res) => {
      let message = '';
      const result = res.projectmember_edit;
      if (!result.error) {
        message = this.edit.length + ' members has been update';
      } else {
        message = result.message;
      }
      this.edit = [];
      this.toastrService.info(message, '');
      this.getProjectMembers();
    });
  }

  changeStatusFilter(filter: string) {
    this.statusFilter = filter;
    this.members = this.COMPANY_MEMBERS;
    this.showCount = this.allCount;
    if (filter == 'Active') {
      this.members = this.members.filter((member) => member.active && member.idUser > 0);
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
    this.getRoles();
    this.getProjectMembers();
  }

  getRoles() {
    this.idUser = this.localStorage.getItem('id');
    this.idUserOwner = this.localStorage.getItem('idUserOwner');
    this.projectName = this.localStorage.getItem('projectName');

    this.apolloService
      .query(company_roles, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
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

    this.getProjectMembers();
  }

  getProjectMembers() {
    this.activatedRoute.params.subscribe((params) => {
      this.idProject = parseInt(params['id']);
      const idProject = parseInt(params['id']);
      this.apolloService
        .query(project_members, {
          idCompany: parseInt(this.localStorage.getItem('idcompany')),
          idProject: idProject,
        })
        .then((res) => {
          const result = res.project_members;
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
    });
  }

  getCompanyMembers() {
    if (this.localStorage.getItem('idcompany')) {
      this.apolloService
        .query(company_members, {
          idCompany: parseInt(this.localStorage.getItem('idcompany')),
        })
        .then((res) => {
          const result = res.company_members;
          if (!result.error) {
            this.companyMembers = result.data.filter((item) => item.idUser > 0);

            this.companyMembers = this.companyMembers
              .concat(this.members)
              .filter((item) => {
                return !(
                  this.companyMembers.some((a) => a.idUser == item.idUser) &&
                  this.members.some((a) => a.idUser == item.idUser)
                );
              });

            this.companyMembers.forEach((item) => {
              item.name = item.firstName + ' ' + item.lastName;
            });
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
    this.apolloService
      .mutate(projectmember_deactivate, {
        idCompany: parseInt(this.localStorage.getItem('idcompany')),
        id: this.members[this.deleteIndex].id,
        revision: this.members[this.deleteIndex].revision,
      })
      .then((res) => {
        let message = '';
        const result = res.projectmember_deactivate;
        message = result.message;
        this.getProjectMembers();
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

  searchTable() {
    this.members = this.COMPANY_MEMBERS;
    this.members = this.members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(this.keywords.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  }

  openVerticallyCentered(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, {
      backdrop: 'static',
      size: '530',
      centered: true,
    });
  }

  inviteMembers() {
    if (this.idUser == this.idUserOwner) {
      this.getCompanyMembers();
      this.openVerticallyCentered(this.inviteMember);
    }
  }

  cancelModal() {
    this.modalService.dismissAll();
    this.inviteList = [];
    this.step = 'step1';
  }

  deleteEmail(index) {
    this.inviteList.splice(index, 1);
  }

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

  getRoleName(id) {
    for (let i = 0; i < this.roleItems.length; i++) {
      if (this.roleItems[i].id == id) {
        return this.roleItems[i].text;
      }
    }
    return '';
  }

  step1() {
    this.userList = [];
    this.inviteList.forEach((item) => {
      this.userList.push({
        idUser: item.idUser,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        avatar: item.avatar,
        idRole: item.idRole,
        role: this.getRoleName(item.idRole),
        approvalAmount: item.approvalAmount,
        approvalAmountText: '$' + item.approvalAmount,
      });
    });
    this.step = 'step3';
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
    const inviteMembers = this.userList.map((item) => {
      return Object.assign(
        {},
        {
          idUser: item.idUser,
          email: item.email,
          idRole: item.idRole,
          approvalAmount: item.approvalAmount,
        }
      );
    });

    const data = {
      idCompany: parseInt(this.localStorage.getItem('idcompany')),
      idProject: this.idProject,
      inviteMembers: inviteMembers,
    };

    this.apolloService.mutate(projectmember_invite, data).then((res) => {
      let message = '';
      const result = res.projectmember_invite;
      if (!result.error) {
        message = this.userList.length + ' Members have been added';
        this.getProjectMembers();
      } else {
        message = result.message;
      }
      this.step = 'step1';
      this.email = '';
      this.inviteList = [];
      this.toastrService.info(message, '');
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

  matchDropdown(value, target) {
    return (
      target.lastName.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
      target.firstName.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
      target.email.toLowerCase().indexOf(value.toLowerCase()) >= 0
    );
  }
}
