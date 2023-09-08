import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { companyproject_coloricon } from 'src/app/core/gql/project';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-set-color',
  templateUrl: './set-color.component.html',
  styleUrls: ['./set-color.component.scss'],
})
export class SetColorComponent {
  @Input() selectColor = '';
  @Input() selectIcon = '';
  @Input() id = '';
  @Input() revision = '';
  @Input() modalRef;

  constructor(
    private toastrService: ToastrService,
    private apolloService: ApolloService
  ) {}
  

  close(){
    this.modalRef.close();
  }

  save() {
    this.apolloService
      .mutate(companyproject_coloricon, {
        id: this.id,
        revision: this.revision,
        color: this.selectColor,
        icon: this.selectIcon,
      })
      .then((res) => {
        const result = res.companyproject_coloricon;
        let message = '';
        if (!result.error) {
          message = 'Color and icon have been updated';
          this.modalRef.close();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
  }
}
