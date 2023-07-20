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
import { compayDetail } from 'src/app/core/gql/company';
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
    paymentTerms: '',
    website: '',
    txtAddress: '',
    txtCity: '',
    txtState: '',
    txtZipcode: '',
    contactNumber: '',
    description: '',
    avatar: '',
  };

  constructor(private apolloService: ApolloService) {}

  ngOnInit(): void {
    this.statesList = STATES;

    this.apolloService.query(compayDetail, {}).then((res) => {
      const result = res.company_details;
      this.industryList = result.comboxIndustry;
      this.paymentTermsList = result.comboxPaymentTerms;
      this.companyName = result.companyName;
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

  searchIndustry: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.statesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 5))
  )


}
