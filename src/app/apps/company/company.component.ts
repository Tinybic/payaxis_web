import { Component, ElementRef, ViewChild } from '@angular/core';
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
  compayDetail,
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
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef<HTMLInputElement>;

  tabs2: number = 2;
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

  constructor(
    private apolloService: ApolloService,
    private toastrService: ToastrService,
    private eventService: EventService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.statesList = STATES;

    let gql = compayDetail;
    let data = {};
    if (localStorage.getItem('idcompany')) {
      gql = company_info;
      data = { id: parseInt(localStorage.getItem('idcompany')) };
    }

    this.apolloService.query(gql, data).then((res) => {
      let result = res.company_details;
      if (gql == company_info) {
        result = res.company_info;
      }
      this.industryList = result.comboxIndustry;
      this.industryNameList = result.comboxIndustry.map(
        ({ txtName }) => txtName
      );
      this.paymentTermsList = result.comboxPaymentTerms.map(
        ({ txtName }) => txtName
      );
      this.company.txtName = result.companyName;

      if (result.company) {
        this.company = JSON.parse(JSON.stringify(result.company));
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
        (term === ''
          ? this.statesList
          : this.statesList.filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 5)
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
        this.eventService.broadcast(EventType.CHANGE_COMPANY, true);
      }
      this.toastrService.info(result.message, '');
    });
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

  showFileDialog(): void {
    this.fileInput.nativeElement.click();
  }
}
