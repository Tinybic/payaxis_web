import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ApolloService } from "../../../core/service/apollo.service";
import { HttpService } from "../../../core/service/http.service";
import { DomSanitizer } from "@angular/platform-browser";
import { get_file_url, getNewFileName } from "../../../core/gql/file";
import { vendorinsurance_upload } from "../../../core/gql/vendor-payment";
import { ToastrService } from "ngx-toastr";
import { projectorder_deletefile } from "../../../core/gql/orders";

@Component({
  selector: 'app-upload-attachment',
  templateUrl: './upload-attachment.component.html',
  styleUrls: ['./upload-attachment.component.scss']
})
export class UploadAttachmentComponent {
  @ViewChild('deleteModal') deleteModal: NgbModalRef;
  @Input() modalRef: NgbModalRef;
  @Input() idVendor;
  
  files: File[] = [];
  attachmentFilesTemp = [];
  isUploading=false;
  
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
    private httpService: HttpService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ){}
  
  ngOnInit(): void{
  
  }
  
  
  /**
   * adds new file in uploaded files
   * @param event event
   */
  onSelect(event: any){
    this.files.push(...event.addedFiles);
  }
  
  /**
   * removes file from uploaded files
   * @param event event
   */
  onRemove(event: any){
    this.deleteObj = {
      message: event.name + ' will be deleted.',
      title: 'Deleting Attachment',
      btnConfirm: 'Confirm',
      btnSide: 'end',
      params: '',
      serviceName: ''
    }
  
    this.deleteModalRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true
    })
  
    this.deleteModalRef.result.then(
      (result) => {
        this.files.splice(this.files.indexOf(event), 1);
      },
      (reason) => {
        console.log(reason);
      })
  }
  
  
  getFileImg(file){
    if(file.type.includes('image/')){
      return this.getPreviewUrl(file);
    } else{
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      return 'assets/images/icon/' + fileType + '.png';
    }
  }
  
  
  /**
   * returns preview url of file
   * @param f file
   */
  getPreviewUrl(f: File){
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }
  
  openFile(file: File){
    window.open(URL.createObjectURL(file), '_blank');
  }
  
  uploadFile(){
    this.isUploading = true;
    this.files.map((file) => {
      this.handleUploadTemp(file);
    })
  }
  
  handleUploadTemp(file){
    const fileName = getNewFileName(file.name);
    file.filename = fileName;
    this.apolloService.query(get_file_url, {
      fileName: fileName,
      folder: 'files'
    }).then((res) => {
      if(!res.get_file_url.error){
        let uploadUrl = res.get_file_url.data;
        this.httpService.put(uploadUrl, file).then((res) => {
          this.attachmentFilesTemp.push({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
            fileUrl: uploadUrl.split('?')[0]
          });
          
          if(this.attachmentFilesTemp.length == this.files.length){
            this.attachmentUploadFile();
          }
        });
      }
    });
  }
  
  attachmentUploadFile(){
    this.apolloService.mutate(vendorinsurance_upload, {
      idCompany: parseInt(localStorage.getItem('idcompany')),
      idVendor: parseInt(this.idVendor),
      insuranceFiles: this.attachmentFilesTemp
    }).then((res) => {
      const result = res.vendorinsurance_upload;
      let message = '';
      if(!result.error){
        message = 'Upload successful';
        this.modalRef.close('save success');
      } else{
        message = result.message;
      }
      this.isUploading = false;
      this.toastrService.info(message, '');
    });
  }
}
