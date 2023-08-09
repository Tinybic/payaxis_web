import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companycostcode_list } from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import {
  vendor_contract_delete,
  vendor_info,
  vendor_new,
  vendor_update,
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
import { RtlScrollAxisType } from '@angular/cdk/platform';
@Component({
  selector: 'app-vendoradd',
  templateUrl: './vendoradd.component.html',
  styleUrls: ['./vendoradd.component.scss'],
})
export class VendoraddComponent {
  @Input() params;
  @Input() public idvendor: number;
  
  @ViewChild('cancelModal') cancelModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('inviteVendor') inviteVendor: any;
  
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;

  tabs1 = 1;
  vendor = {
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
    vendorcostcodes: [],
    vendorcontracts: [],
  };

  vendorcontractstemp = [];
  vendorError = {
    vendorName: false,
    primaryContact: false,
    email: false,
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
    private httpService: HttpService,
  ) {}

  ngOnInit(): void {
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
              vendorcostcodes: [],
              vendorcontracts: result.data.vendorcontracts,
            };
            result.data.vendorcostcodes.forEach((item) => {
              this.costCodeSelect({ currentTarget: { checked: true } }, item);
            });
          }
        });
    }
  }

  getCostCodeList() {
    this.vendor.idCompany = parseInt(localStorage.getItem('idcompany'));
    if (this.vendor.idCompany != 0) {
      this.apolloService
        .query(companycostcode_list, { idCompany: this.vendor.idCompany })
        .then((res) => {
          const result = res.companycostcode_list;
          if (!result.error) {
            this.costCodeList = result.data;
            this.COSTCODE_LIST = JSON.parse(JSON.stringify(result.data));
          }
        });
    }
  }

  costCodeFilter() {
    this.costCodeList = this.COSTCODE_LIST;
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
        (term === ''
          ? this.statesList
          : this.statesList.filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 5)
      )
    );
  };

  uploadUrl = '';
  uploadContract(event) {
    const file = event.target.files[0];
    if (file) {
      const fileName = getNewFileName(file.name);
      file.filename = fileName;
      this.apolloService
        .query(get_file_url, { fileName: fileName, folder: 'files' })
        .then((res) => {
          if (!res.get_file_url.error) {
            this.uploadUrl = res.get_file_url.data;
            this.httpService.put(this.uploadUrl, file).then((res) => {
              this.vendor.vendorcontracts.push({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
                fileUrl: this.uploadUrl.split('?')[0],
              });

              this.vendorcontractstemp.push({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase(),
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
    this.vendorError = {
      vendorName: this.vendor.vendorName.trim().length == 0 ? true : false,
      primaryContact:
        this.vendor.primaryContact.trim().length == 0 ? true : false,
      email: this.vendor.email.trim().length == 0 ? true : false,
    };

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
          vendorcontracts: this.vendorcontractstemp,
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
          //this.modalService.dismissAll();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
    }
  }

  cancelRef;

  cancel() {
    this.cancelRef = this.modalService.open(this.cancelModal, {
      size: '443',
      centered: true,
    });
  }

  cancelClose() {
    this.modalService.dismissAll();
  }

  cancelBack() {
    this.cancelRef.close();
  }

  deleteRef;
  deleteIndex = 0;
  deleteItem;
  openDeleteModal(i,item){
    this.deleteIndex =i;
    this.deleteItem = item;
    this.deleteRef = this.modalService.open(this.deleteModal, {
      size: '443',
      centered: true,
    });
  }

  cancelDelete(){
    this.deleteRef.close();
  }

  fileDelete() {
    let index= this.deleteIndex;
    let item = this.deleteItem;
    this.vendor.vendorcontracts.splice(index, 1);

    for (var i = 0; i < this.vendorcontractstemp.length; i++) {
      if (item.fileUrl == this.vendorcontractstemp[i].fileUrl) {
        this.vendorcontractstemp.splice(i, 1);
      }
    }

    if (item.id) {
      this.apolloService
        .mutate(vendor_contract_delete, {
          idVendor_contract: item.id,
          revision: item.revision,
        })
        .then((res) => {
          let result = res.vendor_contract_delete;
          if (result.error) {
            this.toastrService.info(result.message, '');
          }
        });
    }
    this.deleteRef.close();
  }
}
