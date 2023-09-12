import { Component, Input } from '@angular/core';
import { EventService } from "../../core/service/event.service";
import { ApolloService } from "../../core/service/apollo.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  @Input() modalRef;
  @Input() title;
  @Input() btnDelete;
  @Input() btnCancel;
  @Input() message;
  @Input() params;
  @Input() serviceName;
  @Input() serviceNameStr;
  
  
  constructor(
    private eventService: EventService,
    private apolloService: ApolloService,
    private toastrService: ToastrService
  ){}
  
  delete(){
    this.apolloService.mutate(this.serviceName, this.params).then((res) => {
      const result = res[this.serviceNameStr];
      if(!result.error){
        this.toastrService.info(result.message, '');
        this.modalRef.close();
      } else{
        this.toastrService.info(result.message, '');
      }
    });
  }
  
}
