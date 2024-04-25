import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import { profile_avatar, profile_info, profile_update } from 'src/app/core/gql/user';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})
export class MyprofileComponent {
  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef<HTMLInputElement>;

  profile = {
    idUser: 0,
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    avatar: '',
    revision: 0,
  };


  avatarName = '';

  errorInfo = {
    firstName: 1,
    lastName: 1,
    phone: 1,
  };

  constructor(
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.apolloService
      .query(profile_info, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
      })
      .then((res) => {
        const result = res.profile_info;
        if (!result.error) {
          this.profile = {
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            mobile: result.data.mobile,
            avatar: result.data.avatar,
            idUser: result.data.id,
            revision: result.data.revision,
          };
          this.avatarName = this.profile.firstName + ' ' + this.profile.lastName;
        }
      });
    }

  showFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  uploadUrl = '';

  onSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const fileName = getNewFileName(file.name);
      file.filename = fileName;
      this.apolloService
        .query(get_file_url, { fileName: fileName, folder: 'avataruser' })
        .then((res) => {
          if (!res.get_file_url.error) {
            this.uploadUrl = res.get_file_url.data;
            this.httpService.put(this.uploadUrl, file).then((res) => {
              this.profile.avatar = this.uploadUrl.split('?')[0];
              this.apolloService
                .mutate(profile_avatar, {
                  idUser: this.profile.idUser,
                  revision: this.profile.revision,
                  avatar: this.profile.avatar,
                })
                .then((res) => {
                  let result = res.profile_avatar;
                  if (!result.error) {
                    this.profile.revision = result.data.revision;
                  }
                  this.toastrService.info(result.message,'');
                });
            });
          }
        });
    }
  }

  save() {
    if (this.profile.firstName.length == 0) {
      this.errorInfo.firstName = 1;
      return;
    }
    if (this.profile.lastName.length == 0) {
      this.errorInfo.lastName = 1;
      return;
    }
    this.apolloService
    .mutate(profile_update, this.profile)
    .then((res) => {
      let result = res.profile_update;
      if (!result.error) {
        this.profile.revision = result.data.revision;
      }
      this.toastrService.info(result.message,'');
    });
  }


}
