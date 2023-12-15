import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/service/http.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-join-company',
  templateUrl: './join-company.component.html',
  styleUrls: ['./join-company.component.scss'],
})
export class JoinCompanyComponent {
  @ViewChild('ajaxRequest1') ajaxRequest1!: SwalComponent;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  public successAlertOption: SweetAlertOptions = {
    html: `<div style="overflow: hidden">
    <div class="swal2-alert-title">Request completed</div>
    <div class="swal2-alert-content">Thank you!</div>
    <div class="swal2-icon swal2-success swal2-icon-show" style="display: flex;transform: scale(0.5);margin-top: -5px;">
       <div class="swal2-success-circular-line-left" style="background-color: rgb(255, 255, 255);"></div>
      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
      <div class="swal2-success-ring"></div> <div class="swal2-success-fix" style="background-color: rgb(255, 255, 255);"></div>
      <div class="swal2-success-circular-line-right" style="background-color: rgb(255, 255, 255);"></div>
    </div>
    </div>`,
    showCloseButton: true,
    showConfirmButton: false,
    width: 604,
    padding: 16,
    background: '#fff',
  };

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.queryParams['token'];
    const code = this.activatedRoute.snapshot.queryParams['code'];

    if (token && code) {
      this.httpService
        .post('companyaccept', {
          token: encodeURIComponent(token),
          code: encodeURIComponent(code),
        })
        .then((res) => {
          console.log(res);
          if (!res.error) {
            this.ajaxRequest1.fire();
            setTimeout(() => {
              this.router.navigate(['auth/login']);
            }, 2000);
          } else {
          }
        })
        .catch((error) => {
          this.toastr.info(error, '');
            setTimeout(() => {
              this.router.navigate(['auth/login']);
            }, 1000);
        });
    }
  }
}
