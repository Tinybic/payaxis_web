import { Component, ViewChild } from '@angular/core';
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
} from 'src/app/core/gql/company';
import { ApolloService } from 'src/app/core/service/apollo.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  tabs2: number = 2;
  formatter = (result: string) => result.toUpperCase();

  statesList: string[] = [];
  industryList = [];
  industryNameList = [];
  paymentTermsList = [];
  typeaheadModel: any;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

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

  constructor(private apolloService: ApolloService) {}

  ngOnInit(): void {
    this.statesList = STATES;

    this.apolloService.query(compayDetail, {}).then((res) => {
      const result = res.company_details;
      this.industryList = result.comboxIndustry;
      this.industryNameList = result.comboxIndustry.map(
        ({ txtName }) => txtName
      );
      this.paymentTermsList = result.comboxPaymentTerms.map(
        ({ txtName }) => txtName
      );
      this.companyName = result.companyName;

      console.log(this.paymentTermsList);
      if (result.company) this.company = result.company;
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
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.industryNameList
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 5)
      )
    );

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
      let result = {};
      if (this.company.id != 0) {
        result = res.company_update;
      } else {
        result = res.company_new;
      }
      console.log(result);
    });
  }
}
