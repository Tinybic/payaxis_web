import { Component, ViewChild } from '@angular/core';
import { projectorder_attachment, projectorder_deletefile } from "../../../core/gql/orders";
import { ApolloService } from "../../../core/service/apollo.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { FileSaverService } from 'ngx-filesaver';
import { EventService } from "../../../core/service/event.service";
import { EventType } from "../../../core/constants/events";
import { IMG_TYPE } from "../../../core/constants/common";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent {
  @ViewChild('deleteModal') deleteModal: NgbModalRef;
  
  attachments = [];
  loading = true;
  isUploadingAttachment = false;
  orderId = 0;
  allAttachmentsChecked = false;
  
  deleteModalRef: NgbModalRef;
  deleteObj = {
    title: '',
    message: '',
    btnConfirm: '',
    serviceName: {},
    params: {},
    btnSide: 'end'
  };
  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private fileSaverService: FileSaverService,
    private eventService: EventService,
    public globalService: GlobalFunctionsService,
  ){
    this.eventService.on(EventType.REFRESH_ATTACHMENTS).subscribe((appEvent) => {
      this.isUploadingAttachment = appEvent.payload == true;
      if(!this.isUploadingAttachment){
        this.getAttachments();
      }
    })
  }
  
  ngOnInit(): void{
    this.activatedRoute.params.subscribe((params) => {
      this.orderId = parseInt(params['id']);
      this.getAttachments();
    });
  }
  
  getAttachments(){
    if(localStorage.getItem('idcompany')){
      this.apolloService.query(projectorder_attachment, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idOrder1: this.orderId
      }).then((res) => {
        const result = res.projectorder_attachment;
        if(!result.error){
          result.data.map(attachment => {
            attachment['checked'] = false;
          })
          this.attachments = result.data;
          this.loading = false;
        }
      });
    }
  }
  
  isSomeAttachmentsChecked(){
    return this.attachments.some(attachment => attachment['checked']);
  }
  
  toggleAllAttachmentsChecked(){
    this.attachments.map((attachment) => {
      attachment.checked = this.allAttachmentsChecked;
    })
  }
  
  toggleAttachmentChecked(){
    this.allAttachmentsChecked = this.attachments.every((attachment) => {
      return attachment.checked;
    })
  }
  
  deleteAttachment(attachment, i){
    this.deleteObj = {
      message: 'Are you sure you want to delete this attachment? If you delete the attachment, it will not recover.',
      title: 'Delete Confirmation',
      btnConfirm: 'Confirm',
      btnSide: 'between',
      params: {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idProjectorder_file: attachment.id,
        revision: attachment.revision
      },
      serviceName: projectorder_deletefile
    }
    
    this.deleteModalRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true
    })
    
    this.deleteModalRef.result.then(
      (result) => {
        this.attachments.splice(i, 1);
      },
      (reason) => {
        console.log(reason);
      })
    
  }
  
  downloadFile(attachment){
    this.fileSaverService.save(attachment.fileUrl, attachment.fileName);
  }
  
  getDownloadAttachments(){
    let checkedAttachments = this.attachments.filter(attachment => {
      return attachment.checked;
    })
    this.downloadSeletedFiles(checkedAttachments, checkedAttachments.length - 1)
  }
  
  downloadSeletedFiles(checkedAttachments, i){
    this.downloadFile(checkedAttachments[i]);
    if(--i > -1){
      setTimeout(() => {
        this.downloadSeletedFiles(checkedAttachments, i);
      }, 200)
    }
  }
  
}
