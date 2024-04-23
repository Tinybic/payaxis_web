import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
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
import { STATES } from 'src/app/core/constants/states';
import {
  companyNew,
  companyUpate,
  company_info,
} from 'src/app/core/gql/company';
import { get_file_url, getNewFileName } from 'src/app/core/gql/file';
import { ApolloService } from 'src/app/core/service/apollo.service';
import { ToastrService } from 'ngx-toastr';
import { EventService } from 'src/app/core/service/event.service';
import { EventType } from 'src/app/core/constants/events';
import { HttpService } from 'src/app/core/service/http.service';
import { Base } from 'src/app/core/base';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends Base implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('userSignatureModal') userSignatureModal: NgbModalRef;

  tabs: number = 1;
  formatter = (result: string) => result.toUpperCase();

  statesList: string[] = [];
  industryList = [];
  industryNameList = [];
  paymentTermsList = [];
  typeaheadModel: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focus1$ = new Subject<string>();
  click1$ = new Subject<string>();
  uploadUrl = '';
  companyName: string = '';

  company = {
    id: 0,
    revision: 0,
    txtName: this.companyName,
    taxId: '',
    idMasterCompany: 0,
    industry: '',
    paymentTerms: '',
    website: '',
    txtAddress: '',
    txtCity: '',
    txtState: '',
    txtZipcode: '',
    contactNumber: '',
    description: '',
    avatar: '',
    suiteNumber: '',
  };

  orderError = {
    txtName: -1,
    paymentTerms: -1,
    txtAddress: -1,
    txtCity: -1,
    txtState: -1,
    txtZipcode: -1,
  };
  
  userSignatureModalRef: NgbModalRef;

  constructor(
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private eventService: EventService,
    private httpService: HttpService,
    private modalService: NgbModal,
  ) {
    super();
  }

  canEdit = false;
  ngOnInit(): void {
    this.statesList = STATES;
    let gql = company_info;
    let data = {};
    if (localStorage.getItem('idcompany')) {
      this.canEdit = super.setRole('Edit Company details');
      data = { id: parseInt(localStorage.getItem('idcompany')) };
    } else {
      this.canEdit = true;
      data = { id: 0 };
    }

    this.apolloService.query(gql, data).then((res) => {
      let result = res.company_info;
      this.industryList = result.data.comboxIndustry;
      this.industryNameList = result.data.comboxIndustry.map(
        ({ txtName }) => txtName
      );
      this.paymentTermsList = result.data.comboxPaymentTerms.map(
        ({ txtName }) => txtName
      );

      if (result.data.company) {
        this.company = JSON.parse(JSON.stringify(result.data.company));
      }
    });
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

  searchIndustry: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click1$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus1$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === ''
          ? this.industryNameList
          : this.industryNameList.filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 5)
      )
    );
  };

  setIndustry(event) {
    for (let item of this.industryList) {
      if (item.txtName == event.item) {
        this.company.idMasterCompany = item.id;
        break;
      }
    }
  }

  saveCompany() {
    if (this.company.txtName == '') {
      this.orderError.txtName = 0;
      return;
    } else {
      this.orderError.txtName = -1;
    }

    if (this.company.paymentTerms.length == 0) {
      this.orderError.paymentTerms = 0;
      return;
    } else {
      this.orderError.paymentTerms = -1;
    }

    if (this.company.txtAddress.length == 0) {
      this.orderError.txtAddress = 0;
      return;
    } else {
      this.orderError.txtAddress = -1;
    }

    if (this.company.txtCity.length == 0) {
      this.orderError.txtCity = 0;
      return;
    } else {
      this.orderError.txtCity = -1;
    }

    if (this.company.txtState.length == 0) {
      this.orderError.txtState = 0;
      return;
    } else {
      this.orderError.txtState = -1;
    }

    if (this.company.txtZipcode.length == 0) {
      this.orderError.txtZipcode = 0;
      return;
    } else {
      this.orderError.txtZipcode = -1;
    }

    let gql = companyNew;
    if (this.company.id != 0) {
      gql = companyUpate;
    }
    this.apolloService.mutate(gql, this.company).then((res) => {
      let result;
      if (this.company.id != 0) {
        result = res.company_update;
      } else {
        result = res.company_new;
      }

      if (!result.error) {
        this.company.id = result.data.id;
        this.company.revision = result.data.revision;
        localStorage.setItem('idcompany', this.company.id.toString());
        this.eventService.broadcast(EventType.CHANGE_COMPANY, true);
      }
      this.toastrService.info(result.message, '', {
        positionClass: 'toast-top-right3'
      });
    });
  }

  ngOnDestroy() {
    this.eventService.broadcast(EventType.CHANGE_COMPANY, true);
  }

  dropdownSelect(item) {
    this.company.paymentTerms = item;
  }

  onSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const fileName = getNewFileName(file.name);
      file.filename = fileName;
      this.apolloService
        .query(get_file_url, { fileName: fileName, folder: 'avatarcompany' })
        .then((res) => {
          if (!res.get_file_url.error) {
            this.uploadUrl = res.get_file_url.data;
            this.httpService.put(this.uploadUrl, file).then((res) => {
              this.company.avatar = this.uploadUrl.split('?')[0];
            });
          }
        });
    }
  }

  deleteAvatar() {
    this.company.avatar = '';
  }

  showFileDialog(): void {
    this.fileInput.nativeElement.click();
  }
  
  openUserSignatureModal(): void {
    this.userSignatureModalRef = this.modalService.open(this.userSignatureModal,{
      centered: true,
      backdrop: 'static',
      size: '530',
    });
    
    this.userSignatureModalRef.result.then(
      (res) => {
        console.log('OK');
      },
      (dismiss) => {
        console.log('dismiss');
      }
    );
  }
  
  
}
