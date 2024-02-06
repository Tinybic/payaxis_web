import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApolloService } from '../../../core/service/apollo.service';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunctionsService } from '../../../core/service/global-functions.service';
import {
  companyrole_list,
  companyrole_new,
  companyrole_update,
  companyrole_deactivate,
  permissionrole_update,
} from '../../../core/gql/roles';
import { Base } from 'src/app/core/base';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RolesComponent extends Base {
  @ViewChild('addRoleModal') addRoleModal: any;
  @ViewChild('archiveModal') archiveModal: NgbModalRef;

  modalRef: any;
  deleteModalRef: any;

  idCompany = 0;
  keywords = '';
  direction = '';
  sortColumn = '';
  initialRoles: any = [];
  initialPermissions: any = [];
  roles: any = [];
  permissions: any = [];
  rolesParams = {
    idCompany: 0,
    idRole: 0,
  };
  loading = true;
  showArchived = false;
  roleName = '';
  initialRoleName = '';
  newRoleStatus = false;

  canEdit = false;

  archiveObj = {
    title: '',
    message: '',
    btnConfirm: '',
    serviceName: {},
    params: {},
    btnSide: 'end',
  };
  archiveModalRef: NgbModalRef;
  scrollOptions = {
    forceVisible: true,
  };

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private globalFuns: GlobalFunctionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.canEdit = super.setRole('Edit User roles');
    if (localStorage.getItem('idcompany')) {
      this.idCompany = parseInt(localStorage.getItem('idcompany'));
      this.getRoles();
    }
  }

  filterPermissions = () => {
    let permissions = [];
    let initialPermissions = JSON.parse(
      JSON.stringify(this.initialPermissions)
    );
    initialPermissions.map((permission) => {
      permission.roleaccess = permission.roleaccess.filter((item) => {
        return this.roles.some((role) => role.idRole == item.idRole);
      });
      permissions.push(permission);
    });
    this.permissions = permissions;
  };

  filterArchivedRoles() {
    let roles = this.initialRoles.filter((item) => {
      if (this.showArchived) {
        return this.showArchived;
      } else {
        return item.active;
      }
    });
    
    this.roles = roles.filter((role) => {
      let values = Object.values(role);
      return values.some((v) =>
        v.toString().toLowerCase().includes(this.keywords.toLowerCase())
      );
    });

    this.filterPermissions();
  }

  getRoles() {
    this.apolloService
      .query(companyrole_list, { idCompany: this.idCompany })
      .then((res) => {
        const result = res.companyrole_list;
        if (!result.error) {
          this.initialRoles = result.data.roles;
          this.initialPermissions = result.data.permissions;
          this.filterArchivedRoles();
        }
      });
  }

  onSort(column) {
    this.sortColumn = column;
    const result = this.globalFuns.onSort(
      this.roles,
      this.sortColumn,
      this.direction
    );
    this.roles = result.newArray;
    this.direction = result.direction;
  }

  newRole() {
    this.roleName = '';
    this.newRoleStatus = true;
  }

  saveRole() {
    if (this.roleName.trim().length == 0) {
      this.toastrService.info('Role name is required.', '');
      return;
    }

    let permissionAccess = [];
    this.permissions.map((permission) => {
      permissionAccess.push({
        permissionId: permission.permissionId,
        access: permission.access ? true : false,
      });
    });
    this.apolloService
      .mutate(companyrole_new, {
        idCompany: this.idCompany,
        txtName: this.roleName,
        permissionaccess: permissionAccess,
      })
      .then((res) => {
        const result = res.companyrole_new;
        if (!result.error) {
          this.newRoleStatus = false;
          this.getRoles();
        } else {
          this.toastrService.info(result.message, '');
        }
      });
  }

  cancelNewRole() {
    this.newRoleStatus = false;
    this.permissions.map((permission) => {
      permission.access = false;
    });
  }

  duplicateRole(role) {
    this.newRoleStatus = true;
    this.roleName = role.txtName + '(copy)';
    this.permissions.map((permission) => {
      permission.roleaccess.map((permissionRole) => {
        if (permissionRole.idRole == role.idRole) {
          permission.access = permissionRole.access;
        }
      });
    });
  }

  editRoleName(role) {
    if (role.txtName.trim().length == 0) {
      this.toastrService.info('Role name is required.', '');
      return;
    }
    let permissionAccess = [];
    this.permissions.map((permission) => {
      permission.roleaccess.map((permissionRole) => {
        if (permissionRole.idRole == role.id) {
          permissionAccess.push({
            permissionId: permission.permissionId,
            access: permissionRole.access ? true : false,
          });
        }
      });
    });

    this.apolloService
      .mutate(companyrole_update, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: role.id,
        revision: role.revision,
        txtName: role.txtName,
        permissionaccess: permissionAccess,
      })
      .then((res) => {
        const result = res.companyrole_update;
        if (!result.error) {
          role.isEditing = false;
          role.revision = result.data.revision;
        } else {
          this.toastrService.info(result.message, '');
        }
      });
  }

  toggleRoleArchive(role) {
    let message = 'Worker Role will be archived.';
    if (role.active) {
      if (role.userCount > 3) {
        message =
          'Worker Role will be archived. ' +
          role.userCount +
          ' Team Members assigned to this Role will be classified as Viewer. You can restore it on the Members page.';
      }
    } else {
      message = 'Worker Role will be restored.';
    }

    this.archiveObj = {
      title: 'Archiving Role',
      message: message,
      btnConfirm: 'Confirm',
      btnSide: 'end',
      params: {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        id: role.id,
        revision: role.revision,
        active: !role.active,
      },
      serviceName: companyrole_deactivate,
    };
    this.archiveModalRef = this.modalService.open(this.archiveModal, {
      size: '443',
      centered: true,
    });
    this.archiveModalRef.result.then(
      (result) => {
        // role.active = !role.active;
        // role.revision = result.data.revision;
        this.getRoles();
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  togglePermissionRole(permissionId, role) {
    if (this.canEdit) {
      this.apolloService
        .mutate(permissionrole_update, {
          idCompany: this.idCompany,
          permissionId: permissionId,
          idRole: role.idRole,
          access: role.access,
        })
        .then((res) => {
          const result = res.permissionrole_update;
          if (!result.error) {
          } else {
            this.toastrService.info(result.message, '');
          }
        });
    }
  }
}
