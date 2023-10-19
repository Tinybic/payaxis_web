import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ApolloService } from "../../../core/service/apollo.service";
import { HttpService } from "../../../core/service/http.service";
import { DomSanitizer } from "@angular/platform-browser";
import { get_file_url, getNewFileName } from "../../../core/gql/file";
import { vendorinsurance_upload } from "../../../core/gql/vendor-payment";
import { ToastrService } from "ngx-toastr";
import { projectorder_deletefile, projectorder_uploadfiles } from "../../../core/gql/orders";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { GlobalFunctionsService } from "../../../core/service/global-functions.service";
import { FILE_TYPE } from "../../../core/constants/common";

@Component({
  selector: 'app-upload-attachment',
  templateUrl: './upload-attachment.component.html',
  styleUrls: ['./upload-attachment.component.scss']
})
export class UploadAttachmentComponent {
  @ViewChild('deleteModal') deleteModal: NgbModalRef;
  @Input() modalRef: NgbModalRef;
  @Input() idVendor?;
  @Input() idOrder1?;
  
  files: any[] = [];
  attachmentFilesTemp = [];
  isUploading = false;
  
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
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public globalService: GlobalFunctionsService
  ){}
  
  ngOnInit(): void{
    
    if(this.idVendor){
      console.log('idvendor: ', this.idVendor);
    }
    
    if(this.idOrder1){
      console.log('idOrder1: ', this.idOrder1)
    }
    
  }
  
  
  /**
   * adds new file in uploaded files
   * @param event event
   */
  onSelect(event: any){
    event.addedFiles.map(file => {
      file.uploadProgress = 0;
      file.subscription = null;
      return file;
    })
    this.files.push(...event.addedFiles);
    this.files.map((file) => {
      this.getUploadUrl(file);
    })
  }
  
  getUploadUrl(file){
    const fileName = getNewFileName(file.name);
    file.filename = fileName;
    this.apolloService.query(get_file_url, {
      fileName: fileName,
      folder: 'files'
    }).then((res) => {
      if(!res.get_file_url.error){
        let uploadUrl = res.get_file_url.data;
        this.handleUploadFile(file, uploadUrl);
      }
    })
  }
  
  handleUploadFile(file, uploadUrl){
    file.subscription = this.http.put(uploadUrl, file, {
      headers: new HttpHeaders().set('x-ms-blob-type', 'BlockBlob').set('Content-Type', file.type),
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (res) => {
        if(res.type === HttpEventType.Response){
          this.attachmentFilesTemp.push({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
            fileUrl: uploadUrl.split('?')[0],
            initialUrl: uploadUrl
          });
          setTimeout(() => {
            this.files.splice(this.files.indexOf(file), 1);
          }, 500)
        }
        if(res.type === HttpEventType.UploadProgress){
          const percentDone = Math.round(100 * res.loaded / res.total);
          file.uploadProgress = percentDone;
        }
      },
      error: (err) => {
        this.toastrService.info(err, '');
      }
    })
  }
  
  cancelUploading(file){
    file.subscription.unsubscribe();
    this.files.splice(this.files.indexOf(file), 1);
  }
  
  getFileImg(file){
    if(file.type.includes('image/')){
      return this.getPreviewUrl(file);
    } else{
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      if(FILE_TYPE.includes(fileType)){
        return 'assets/images/icon/' + fileType + '.png';
      } else{
        return 'assets/images/icon/zz.png';
      }
    }
  }
  
  /**
   * returns preview url of file
   * @param f file
   */
  getPreviewUrl(f: File){
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURI(URL.createObjectURL(f)));
  }
  
  openFile(file){
    window.open(file.fileUrl, '_blank');
  }
  
  
  /**
   * removes file from uploaded files
   * @param event event
   */
  onRemove(file: any){
    this.deleteObj = {
      message: file.fileName + ' will be deleted.',
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
        this.http.delete(file.initialUrl).subscribe({
          next: (res) => {
            this.attachmentFilesTemp.splice(this.attachmentFilesTemp.indexOf(file), 1);
          },
          error: (err) => {
            this.toastrService.info(err, '');
          }
        })
      },
      (reason) => {
        console.log(reason);
      })
  }
  
  attachmentUploadFile(){
    this.isUploading = true;
    let service;
    let params = {};
    
    let attachmentFilesTemp = this.attachmentFilesTemp.map(file => {
      return {
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileType: file.fileType,
        fileUrl: file.fileUrl
      }
    })
    
    if(this.idVendor){
      service = vendorinsurance_upload;
      params = {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idVendor: parseInt(this.idVendor),
        insuranceFiles: attachmentFilesTemp
      }
    }
    
    if(this.idOrder1){
      service = projectorder_uploadfiles;
      params = {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        idOrder1: parseInt(this.idOrder1),
        orderFiles: attachmentFilesTemp
      }
    }
    
    this.apolloService.mutate(service, params).then((res) => {
      const result: any = Object.values(res)[0];
      let message = '';
      if(!result.error){
        message = 'Upload successful';
        this.modalRef.close('save success');
      } else{
        message = result.message;
      }
      this.isUploading = false;
      this.toastrService.info(message, '');
    }, error => {
      this.isUploading = false;
      this.toastrService.info(error, '');
    });
  }
}
