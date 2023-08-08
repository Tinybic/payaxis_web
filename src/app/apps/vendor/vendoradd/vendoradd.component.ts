import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companycostcode_list } from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { vendor_new, vendor_update } from 'src/app/core/gql/vendor';
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
@Component({
  selector: 'app-vendoradd',
  templateUrl: './vendoradd.component.html',
  styleUrls: ['./vendoradd.component.scss'],
})
export class VendoraddComponent {
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
  vendorError = {
    vendorName: false,
    primaryContact: false,
    email: false,
  };

  id = 0;
  revision = 0;

  costCodeList = [];
  fileList = [];
  vendorcostcodesText = '';
  statesList = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.statesList = STATES;
    this.getCostCodeList();
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
          }
        });
    }
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
    console.log(event.currentTarget.checked);
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
                fileType: file.name.substring(file.name.lastIndexOf('.') + 1),
                fileUrl: this.uploadUrl.split('?')[0],
              });
            });
          }
        });
    }
  }

  save() {
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
      if (this.id > 0) {
        gql = vendor_update;
        data = {
          id: this.id,
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
          vendorcontracts: this.vendor.vendorcontracts,
        };
      } else {
        data = this.vendor;
      }

      this.apolloService.mutate(gql, data).then((res) => {
        let result;
        if (this.id > 0) {
          result = res.company_update;
        } else {
          result = res.vendor_new;
        }
        let message = '';
        if (!result.error) {
          message = 'Save success';
          this.id = result.data.id;
          this.revision = result.data.revision;
          //this.modalService.dismissAll();
        } else {
          message = result.message;
        }
        this.toastrService.info(message, '');
      });
    }
  }

  cancel() {
    this.modalService.dismissAll();
  }

  fileDelete(index) {
    this.vendor.vendorcontracts.splice(index, 1);
  }
}
