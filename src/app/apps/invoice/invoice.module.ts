import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarModule } from 'src/app/shared/avatar/avatar.module';
import { FormsModule } from '@angular/forms';
import { MappingAttachmentsComponent } from './mapping-attachments/mapping-attachments.component';
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { ProjectsModule } from "../projects/projects.module";
import { SettingModule } from "../setting/setting.module";
import { VendoraddModule } from "../vendor/vendoradd/vendoradd.module";
import { InvoiceAddComponent } from './invoice-add/invoice-add.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    InvoicelistComponent,
    MappingAttachmentsComponent,
    InvoiceAddComponent,
    InvoiceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InvoiceRoutingModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbModalModule,
    UiModule,
    SharedModule,
    AvatarModule,
    NgxExtendedPdfViewerModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ProjectsModule,
    SettingModule,
    VendoraddModule,
    NgbDatepickerModule,
    NgxDropzoneModule,
  ],
  providers:[
    provideNgxMask()
  ],
})
export class InvoiceModule { }
