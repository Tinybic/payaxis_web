import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { categorycostcode_list } from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import {
  vendor_file_delete,
  vendor_info,
  vendor_new,
  vendor_update,
  vendor_archive,
} from 'src/app/core/gql/vendor';
import {
  Observable,
  OperatorFunction,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
} from 'rxjs';
import { STATES } from 'src/app/pages/forms/forms-advanced/data';
import { getNewFileName, get_file_url } from 'src/app/core/gql/file';
import { HttpService } from 'src/app/core/service/http.service';
import { getassociatedcompany_list } from 'src/app/core/gql/receivables';

@Component({
  selector: 'app-vendoradd',
  templateUrl: './vendoradd.component.html',
  styleUrls: ['./vendoradd.component.scss'],
})
export class VendoraddComponent {
  @Input() modalRef?: NgbModalRef;
  @Input() params;
  @Input() public idvendor: number;
  @Output() public outId = new EventEmitter<number>();
  @ViewChild('newVendorListModal') newVendorListModal: any;
  @ViewChild('cancelModal') cancelModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('inviteVendor') inviteVendor: any;
  @ViewChild('archiveModal') archiveModal: any;
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  @ViewChild('enteremailModal') enteremailModal: any;

  tabs1 = 1;
  vendor = {
    id: 0,
    revision: 0,
    idCompany: 0,
    vendorName: '',
    vendorType: '',
    primaryContact: '',
    email: '',
    phone: '',
    website: '',
    txtAddress: '',
    suiteNumber: '',
    txtCity: '',
    txtState: '',
    txtZipcode: '',
    status: '',
    idInvitedCompany: 0,
    vendorcostcodes: [],
    vendorfiles: [],
    idCompanylist: [],
  };

  idInvitedCompany = 0;

  vendorAdditional = {
    id: 0,
    revision: 0,
    payto: '',
    federalId: '',
    taxrate: 0.0,
    discount: 0.0,
    paymentTerms: '',
    form1099: false,
    email: '',
  };

  vendorTemp;

  vendorfilestemp = [];
  vendorError = {
    vendorName: false,
    primaryContact: false,
    email: false,
    costcode: false,
  };
  keywords = '';
  id = 0;
  revision = 0;

  costCodeList = [];
  COSTCODE_LIST = [];
  fileList = [];
  vendorcostcodesText = '';
  statesList = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.vendor.email = '';
    if (this.idvendor == 0) {
      setTimeout(() => {
        // this.modalRef.close();
        this.openEnterEmailModal();
      }, 100);
    }
    this.statesList = STATES;
    this.getCostCodeList();
    this.getVendorInfo();
  }

  getVendorInfo() {
    if (this.idvendor != 0) {
      this.apolloService
        .query(vendor_info, { id: this.idvendor })
        .then((res) => {
          const result = res.vendor_info;
          if (!result.error) {
            this.revision = result.data.vendor.revision;
            this.vendor = {
              id: result.data.vendor.id,
              revision: result.data.vendor.revision,
              idCompany: result.data.vendor.idCompany,
              vendorName: result.data.vendor.vendorName,
              vendorType: result.data.vendor.vendorType,
              primaryContact: result.data.vendor.primaryContact,
              email: result.data.vendor.email,
              phone: result.data.vendor.phone,
              website: result.data.vendor.website,
              txtAddress: result.data.vendor.txtAddress,
              suiteNumber: result.data.vendor.suiteNumber,
              txtCity: result.data.vendor.txtCity,
              txtState: result.data.vendor.txtState,
              txtZipcode: result.data.vendor.txtZipcode,
              status: result.data.vendor.status,
              idInvitedCompany: result.data.vendor.idInvitedCompany,
              vendorcostcodes: [],
              vendorfiles: result.data.vendorfiles,
              idCompanylist: [],
            };

            this.idInvitedCompany = result.data.vendor.idInvitedCompany;
            this.vendorAdditional = {
              id: result.data.vendor.id,
              revision: result.data.vendor.revision,
              payto: result.data.vendor.payto,
              federalId: result.data.vendor.federalId,
              taxrate: result.data.vendor.taxrate,
              discount: result.data.vendor.discount,
              paymentTerms: result.data.vendor.paymentTerms,
              form1099: result.data.vendor.form1099,
              email: result.data.vendor.email,
            };
            result.data.vendorcostcodes.forEach((item) => {
              this.costCodeSelect({ currentTarget: { checked: true } }, item);
            });
            this.vendorTemp = JSON.parse(JSON.stringify(this.vendor));
          }
        });
    }
  }

  getCostCodeList() {
    this.vendor.idCompany = parseInt(localStorage.getItem('idcompany'));
    if (this.vendor.idCompany != 0) {
      this.apolloService
        .query(categorycostcode_list, { idCompany: this.vendor.idCompany })
        .then((res) => {
          const result = res.categorycostcode_list;
          if (!result.error) {
            this.costCodeList = result.data;
            this.COSTCODE_LIST = JSON.parse(JSON.stringify(result.data));
          }
        });
    }
  }

  costCodeFilter() {
    this.costCodeList = JSON.parse(JSON.stringify(this.COSTCODE_LIST));
    this.costCodeList = this.costCodeList.filter((costcode) => {
      costcode.costcodelist = costcode.costcodelist.filter((item) =>
        item.txtName.toLowerCase().includes(this.keywords.toLowerCase())
      );
      return costcode;
    });
  }

  setCostCodeSelect(costcode) {
    let result = false;
    this.vendor.vendorcostcodes.forEach((item) => {
      if (item.costCode == costcode) {
        result = true;
      }
    });
    return result;
  }

  removeCostCode(item) {
    for (let i = 0; i < this.vendor.vendorcostcodes.length; i++) {
      if (this.vendor.vendorcostcodes[i].costCode == item.costCode) {
        this.vendor.vendorcostcodes.splice(i, 1);
        break;
      }
    }
  }

  costCodeSelect(event, item) {
    if (event.currentTarget.checked) {
      this.vendorcostcodesText += item.txtName + ', ';
      this.vendor.vendorcostcodes.push({
        idCompany: this.vendor.idCompany,
        costCode: item.costCode,
      });
    } else {
      this.vendorcostcodesText = this.vendorcostcodesText.replace(
        item.txtName + ', ',
        ''
      );
      this.removeCostCode(item);
    }
  }

  searchState: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === ''
          ? this.statesList
          : this.statesList.filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
      )
    );
  };

  uploadUrl = '';

  uploadFile(event) {
    const file = event.target.files[0];
    if (file) {
      const fileName = getNewFileName(file.name);
      file.filename = fileName;
      this.apolloService
        .query(get_file_url, {
          fileName: fileName,
          folder: 'files',
        })
        .then((res) => {
          if (!res.get_file_url.error) {
            this.uploadUrl = res.get_file_url.data;
            this.httpService.put(this.uploadUrl, file).then((res) => {
              this.vendor.vendorfiles.push({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.name
                  .substring(file.name.lastIndexOf('.') + 1)
                  .toLowerCase(),
                fileUrl: this.uploadUrl.split('?')[0],
              });

              this.vendorfilestemp.push({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.name
                  .substring(file.name.lastIndexOf('.') + 1)
                  .toLowerCase(),
                fileUrl: this.uploadUrl.split('?')[0],
              });
            });
          }
        });
    }
  }

  save() {
    try {
      this.cancelRef.close();
    } catch {}
    if (this.vendor.idCompanylist.length == 0) {
      this.vendorError = {
        vendorName: this.vendor.vendorName.trim().length == 0 ? true : false,
        primaryContact:
          this.vendor.primaryContact.trim().length == 0 ? true : false,
        email: this.vendor.email.trim().length == 0 ? true : false,
        costcode: false,
      };
    }
    if (
      !this.vendorError.vendorName &&
      !this.vendorError.primaryContact &&
      !this.vendorError.email
    ) {
      let gql = vendor_new;
      let data = {};
      if (this.idvendor > 0) {
        gql = vendor_update;
        data = {
          id: this.idvendor,
          revision: this.revision,
          idCompany: this.vendor.idCompany,
          vendorName: this.vendor.vendorName,
          vendorType: this.vendor.vendorType,
          primaryContact: this.vendor.primaryContact,
          email: this.vendor.email,
          phone: this.vendor.phone,
          website: this.vendor.website,
          txtAddress: this.vendor.txtAddress,
          suiteNumber: this.vendor.suiteNumber,
          txtCity: this.vendor.txtCity,
          txtState: this.vendor.txtState,
          txtZipcode: this.vendor.txtZipcode,
          vendorcostcodes: this.vendor.vendorcostcodes,
          vendorfiles: this.vendorfilestemp,
        };
      } else {
        data = this.vendor;
      }

      this.apolloService.mutate(gql, data).then((res) => {
        let result;
        let message = '';
        if (this.idvendor > 0) {
          result = res.vendor_update;
          message = 'Vendor was updated successfully';
        } else {
          result = res.vendor_new;
          message = 'Vendor was created successfully';
        }

        if (!result.error) {
          this.idvendor = result.data.id;
          this.revision = result.data.revision;
          this.vendor.id = result.data.id;
          this.vendor.revision = result.data.revision;
          this.vendorTemp = JSON.parse(JSON.stringify(data));
          this.outId.emit(this.vendor.id);
          //this.modalService.dismissAll();
          if (this.modalRef) {
            this.modalRef.close();
          }
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '', {
          positionClass: 'toast-top-right-order',
        });
      });
    }
  }

  cancelRef;

  cancel() {
    if (
      (this.idvendor == 0 &&
        (this.vendor.vendorName.length > 0 ||
          this.vendor.primaryContact.length > 0 ||
          this.vendor.email.length > 0)) ||
      (this.idvendor > 0 &&
        (this.vendor.vendorName != this.vendorTemp.vendorName ||
          this.vendor.vendorType != this.vendorTemp.vendorType ||
          this.vendor.primaryContact != this.vendorTemp.primaryContact ||
          this.vendor.email != this.vendorTemp.email ||
          this.vendor.phone != this.vendorTemp.phone ||
          this.vendor.website != this.vendorTemp.website ||
          this.vendor.txtAddress != this.vendorTemp.txtAddress ||
          this.vendor.suiteNumber != this.vendorTemp.suiteNumber ||
          this.vendor.txtCity != this.vendorTemp.txtCity ||
          this.vendor.txtState != this.vendorTemp.txtState ||
          this.vendor.txtZipcode != this.vendorTemp.txtZipcode ||
          JSON.stringify(this.vendor.vendorcostcodes) !=
            JSON.stringify(this.vendorTemp.vendorcostcodes)))
    ) {
      this.cancelRef = this.modalService.open(this.cancelModal, {
        size: '443',
        centered: true,
      });
    } else {
      if (this.modalRef) {
        this.modalRef.dismiss();
      } else {
        this.modalService.dismissAll();
      }
    }
  }

  cancelClose() {
    if (this.modalRef) {
      this.modalRef.close();
      this.cancelRef.close();
    } else {
      this.modalService.dismissAll();
    }
  }

  cancelBack() {
    this.cancelRef.close();
  }

  deleteRef;
  deleteIndex = 0;
  deleteItem;

  openDeleteModal(i, item) {
    this.deleteIndex = i;
    this.deleteItem = item;
    this.deleteRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true,
    });
  }

  cancelDelete() {
    this.deleteRef.close();
  }

  fileDelete() {
    let index = this.deleteIndex;
    let item = this.deleteItem;
    this.vendor.vendorfiles.splice(index, 1);

    for (var i = 0; i < this.vendorfilestemp.length; i++) {
      if (item.fileUrl == this.vendorfilestemp[i].fileUrl) {
        this.vendorfilestemp.splice(i, 1);
      }
    }

    if (item.id) {
      this.apolloService
        .mutate(vendor_file_delete, {
          idCompany: this.vendor.idCompany,
          idVendor_file: item.id,
          revision: item.revision,
        })
        .then((res) => {
          let result = res.vendor_file_delete;
          if (result.error) {
            this.toastrService.info(result.message, '');
          }
        });
    }
    this.deleteRef.close();
  }

  archiveRef;

  openArchiveModal() {
    if (this.idvendor > 0) {
      this.archiveRef = this.deleteRef = this.modalService.open(
        this.archiveModal,
        {
          backdrop: 'static',
          size: '443',
          centered: true,
        }
      );
    }
  }

  cancelArchive() {
    this.archiveRef.close();
  }

  vendor_archive() {
    if (this.idvendor > 0 && this.revision > 0) {
      this.apolloService
        .mutate(vendor_archive, {
          idCompany: this.vendor.idCompany,
          id: this.idvendor,
          revision: this.revision,
        })
        .then((res) => {
          let result = res.vendor_archive;
          if (result.error) {
            this.toastrService.info(result.message, '');
          } else {
            this.modalService.dismissAll();
          }
        });
    }
    this.archiveRef.close();
  }

  selectType(item) {
    this.vendor.vendorType = item;
  }

  createVendorList = [];
  findVendorList() {
    this.emailRef.close();
    this.apolloService
      .query(getassociatedcompany_list, {
        idCompany: parseInt(localStorage.getItem('idcompany')),
        vendorEmail: this.vendor.email,
      })
      .then((res) => {
        const result = res.getassociatedcompany_list;
        if (!result.error) {
          this.createVendorList = result.data;
          if (result.code == 0) {
            if (this.createVendorList.length > 1) {
              this.openNewVendorModal();
            } else if (this.createVendorList.length == 1) {
              this.emailRef.close();
              this.CreateNewVendor();
            } else {
              this.emailRef.close();
            }
          } else {
            this.toastrService.info(result.message, '');
            this.modalRef.close();
          }
        }
      });
  }

  newVendorRef;
  openNewVendorModal() {
    this.newVendorRef = this.modalService.open(this.newVendorListModal, {
      backdrop: 'static',
      size: '443',
      centered: true,
    });
  }

  cancelNewVendor() {
    this.newVendorRef.close();
  }

  newVendorShow = false;
  CreateNewVendor() {
    if (this.newVendorRef) this.newVendorRef.close();

    let idCompanylist = [];
    if (this.createVendorList.length > 1) {
      this.createVendorList.forEach((item) => {
        if (item.selected) idCompanylist.push(item.idInvitedCompany);
      });
    } else {
      idCompanylist.push(this.createVendorList[0].idInvitedCompany);
    }
    this.vendor.idCompanylist = idCompanylist;
    this.save();

    // this.createVendorList.forEach((item) => {
    //   if (this.vendor.idInvitedCompany == item.idInvitedCompany) {
    //     this.vendor.vendorName = item.companyName;
    //     this.save();
    //     return;
    //   }
    // });
    // this.newVendorRef.close();
  }

  emailRef;
  openEnterEmailModal() {
    this.emailRef = this.modalService.open(this.enteremailModal, {
      backdrop: 'static',
      size: '443',
      centered: true,
    });
  }

  selectFlag = false;

  selectAll() {
    if (!this.selectFlag) {
      this.createVendorList.forEach((item) => (item.selected = true));
      this.selectFlag = true;
    } else {
      this.createVendorList.forEach((item) => (item.selected = false));
      this.selectFlag = false;
    }
  }

  closeAll(){
    this.modalService.dismissAll();
  }
}
