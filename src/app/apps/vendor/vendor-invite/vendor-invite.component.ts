import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TagModel } from 'ngx-chips/core/tag-model';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, filter } from 'rxjs';
import { company_members } from 'src/app/core/gql/team';
import { vendor_invite } from 'src/app/core/gql/vendor';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { LocalStorageService } from 'src/app/core/service/local-storage.service';

@Component({
  selector: 'app-vendor-invite',
  templateUrl: './vendor-invite.component.html',
  styleUrls: ['./vendor-invite.component.scss'],
})
export class VendorInviteComponent {
  @Input() modalRef: any;
  members = [];

  that;
  constructor(
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit() {
    this.getCompanyMembers();
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
            this.members = result.data;
          }
        });
    }
  }

  emailList = [];
  cancelModal() {
    this.modalRef.close();
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

  notMembers(event) {
    let flag = false;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].email == event.display) {
        flag = true;
        break;
      }
    }
    if (flag) {
      this.toastrService.info('Can not invite member of this company!', '');
      this.emailList.splice(this.emailList.length - 1, 1);
    }
  }

  sendInvite() {
    const inviteVendors = this.emailList.map((item) => {
      return Object.assign(
        {},
        {
          email: item.value,
        }
      );
    });

    const data = {
      idCompany: parseInt(this.localStorage.getItem('idcompany')),
      inviteVendors: inviteVendors,
    };

    this.apolloService.mutate(vendor_invite, data).then((res) => {
      let message = '';
      const result = res.vendor_invite;
      if (!result.error) {
        message = this.emailList.length + ' invitation has been sent';
      } else {
        message = result.message;
      }
      this.emailList = [];
      this.toastrService.info(message, '');
      this.modalRef.close();
    });
  }
}
