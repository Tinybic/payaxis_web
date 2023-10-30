import { Component } from '@angular/core';

@Component({
  selector: 'app-invoicelist',
  templateUrl: './invoicelist.component.html',
  styleUrls: ['./invoicelist.component.scss'],
})
export class InvoicelistComponent {
  keywords = '';
  filterList = [];
  invoiceList = [];
  loading = false;
  direction = 'asc';
  sortColumn = '';
  onSort(a) {}
  filterVendorList(item) {}

  filterTable = (invoice: any) => {
    let values = Object.values(invoice);
    return values.some((v) =>
    invoice.invoiceName.toLowerCase().includes(this.keywords.toLowerCase())
    );
  };
}
