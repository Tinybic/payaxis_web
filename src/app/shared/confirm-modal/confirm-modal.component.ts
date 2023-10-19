import { Component, Input } from '@angular/core';
import { EventService } from "../../core/service/event.service";
import { ApolloService } from "../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() modalRef;
  @Input() title;
  @Input() message;
  @Input() btnConfirm?;
  @Input() btnCancel?;
  @Input() btnSide?;
  @Input() params?;
  @Input() serviceName?;
  
  
  constructor(
    private eventService: EventService,
    private apolloService: ApolloService,
    private toastrService: ToastrService
  ){}
  
  delete(){
    if(this.serviceName){
      this.apolloService.mutate(this.serviceName, this.params).then((res) => {
        let result: any = Object.values(res)[0];
        if(!result.error){
          this.toastrService.info(result.message, '');
          this.modalRef.close(result);
        } else{
          this.toastrService.info(result.message, '');
        }
      });
    }else {
      this.modalRef.close('ok');
    }
  }
  
}
