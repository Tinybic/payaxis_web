import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/service/http.service';

@Component({
  selector: 'app-inviting-vendor',
  templateUrl: './inviting-vendor.component.html',
  styleUrls: ['./inviting-vendor.component.scss'],
})
export class InvitingVendorComponent {
  token: string = '';
  code: string = '';
  loading = true;
  error = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'];
    this.code = this.activatedRoute.snapshot.queryParams['code'];

    if (this.token && this.code) {
      this.loading = true;
      this.httpService
        .post('vendoraccept', {
          token: encodeURIComponent(this.token),
          code: encodeURIComponent(this.code),
        })
        .then((res) => {
          this.loading = false;
          let message = '';
          message = res.message;
          this.toastr.info(message, '', {
            timeOut: 20000,
            enableHtml: true,
          });
          if (res.data) this.router.navigate(['auth/login']);
          else this.router.navigate(['auth/register']);
        })
        .catch((error) => {
          this.loading = false;
          this.toastr.info(error, '', {
            timeOut: 20000,
            enableHtml: true,
          });
          this.router.navigate(['auth/login']);
        });
    }
  }
}
