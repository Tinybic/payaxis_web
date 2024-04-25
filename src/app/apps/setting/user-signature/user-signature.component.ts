import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { signature_new } from 'src/app/core/gql/company';
import { get_file_url, getNewFileName } from "../../../core/gql/file";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import * as moment from 'moment';
import { HttpService } from "../../../core/service/http.service";

@Component({
  selector: 'app-user-signature',
  templateUrl: './user-signature.component.html',
  styleUrls: ['./user-signature.component.scss']
})
export class UserSignatureComponent {
  @Input() modalRef: NgbModalRef;
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;
  showTip = true;
  isLoading = false;
  
  constructor(
    private apolloService: ApolloService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private httpService: HttpService
  ){}
  
  signaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 478,
    canvasHeight: 200,
    backgroundColor: 'rgba(0,0,0,0)'
  };
  
  AfterViewInit(){
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
  
  drawStart(event): void {
    this.showTip = false;
  }
  
  
  base64ToBlob(){
    const byteString = atob(this.signaturePad.toDataURL().split(',')[1]); // Split off data:URL prefix
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for(let i = 0; i < byteString.length; i++){
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], {type: 'image/png'});
  }
  
  getUploadUrl(file){
    const fileName = localStorage.getItem('id') + '_' + moment().valueOf() + '.png'
    this.apolloService.query(get_file_url, {
      fileName: fileName,
      folder: 'avataruser'
    }).then((res) => {
      if(!res.get_file_url.error){
        this.handleUploadFile(file, res.get_file_url.data);
      }else{
        this.isLoading=false;
        console.log(res)
      }
    }).catch((err) => {
      this.isLoading=false;
      this.toastrService.info(err, '');
      console.log('get_file_url error');
    })
  }
  
  
  onSelected(event){
    const file = event.target.files[0];
    if(file){
      this.isLoading=true;
      this.getUploadUrl(file);
    }
  }
  
  
  handleUploadFile(file, uploadUrl){
    this.httpService.put(uploadUrl, file).then((res) => {
        let base64 = this.signaturePad.toDataURL().split(',');
        this.apolloService.mutate(signature_new, {
          idUser: parseInt(localStorage.getItem('id')),
          imageUrl: uploadUrl.split('?')[0],
          imageBase64: base64[1]
        }).then((res) => {
          const result = res.signature_new;
          let message = '';
          if(!result.error){
            message = 'Save Signature successfully';
            this.modalRef.close();
          } else{
            message = result.message;
          }
          this.toastrService.info(message, '');
        }).catch((err) => {
          this.toastrService.info(err, '')
        })
    }).catch((err) => {
      this.toastrService.info(err, '')
    }).finally(() => {
      setTimeout(() =>{
        this.isLoading=false;
      }, 500);
    })
  }
  
  
  saveSignature(){
    if(!this.signaturePad.isEmpty()){
      this.isLoading = true;
      this.getUploadUrl(this.base64ToBlob());
    }
  }
  
}
