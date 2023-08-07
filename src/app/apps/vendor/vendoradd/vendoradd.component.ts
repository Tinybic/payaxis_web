import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { companycostcode_list } from 'src/app/core/gql/costcode';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { vendor_new } from 'src/app/core/gql/vendor';
import { Observable, OperatorFunction, Subject, debounceTime, distinctUntilChanged, filter, map, merge } from 'rxjs';
import { STATES } from 'src/app/pages/forms/forms-advanced/data';
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
    idCompany:0,
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
  costCodeList = [];
  fileList = [];
  vendorcostcodesText = '';
  statesList = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  
  constructor(
    private apolloService: ApolloService,
    private modalService: NgbModal,
    private toastrService: ToastrService
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


  save() {
    this.apolloService
    .mutate(vendor_new, this.vendor)
    .then((res) => {
      const result = res.vendor_new;
      let message='';
      if (!result.error) {
        message = "Save success";
        this.modalService.dismissAll();
      }
      else{
        message= result.message
      }
      this.toastrService.info(message,'');
    });

  }

  cancel() {
    this.modalService.dismissAll();
  }
}
