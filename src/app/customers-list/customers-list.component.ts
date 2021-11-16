import { Component, OnInit } from '@angular/core';
import { Customer } from '../shared/customer';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {

  isEditPos: number | null = null;
  isChanged = false;
  private tempCustomer!: Customer;

  constructor(public httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getData();
  }

  editCustomer(i: number): void {
    this.tempCustomer = this.resetCustomer();
    this.isEditPos = i;
  }

  cancelEdit(): void {
    this.tempCustomer = this.resetCustomer();
    this.isEditPos = null;
    this.isChanged = false;
  }

  saveCustomer(customer: Customer, i: number): void {
    const mergeCustomer: Customer = this.mergeCustomerProps(customer, this.tempCustomer);
    this.httpService.updateData(mergeCustomer, i)
    this.isEditPos = null;
    this.isChanged = false;
  }

  deleteCustomer(customer: Customer): void {
    this.httpService.deleteData(customer)
  }

  setValue(key: string, value: string, original: string): void {
    const valueTrim = value.trim();
    if (valueTrim !== original && valueTrim !== this.tempCustomer[key as keyof Customer]) {
      this.tempCustomer[key as keyof Customer] = value;
      this.isChanged = true;
    }   
  }

  private resetCustomer = (): Customer => ({
    key: null,
    name: null,
    email: null,
    mobile: null,
    location: null
  })

  private mergeCustomerProps<T>(original: T, temp: T): T {
    const result: T = {...original};
    Object.keys(temp).forEach(key => {
      if (temp[key as keyof T]) {
        result[key as keyof T] = temp[key as keyof T]
      }
    })
    return result
  }
  
}
