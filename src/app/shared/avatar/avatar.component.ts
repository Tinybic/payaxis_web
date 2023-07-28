import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() url: string = '';
  @Input() size: number = 32;
  @Input() bgColor: string = 'bg-white';
  @Input() companyName: string = '';
  @Input() color:string = 'text-primary';
  companyNameText = "";
  constructor(){

  }

  ngOnInit(){
    const company =  this.companyName.split(' ');
    if(company.length==1){
      this.companyNameText = company[0].substring(0,1);
    }
    else if(company.length>1){
      this.companyNameText = company[0].substring(0,1) + company[1].substring(0,1);
    }
  }



}
