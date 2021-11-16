import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './customer';
import { catchError} from 'rxjs/operators'
import { Observable, of } from 'rxjs';

const url = 'https://ng-firebase-dep-default-rtdb.europe-west1.firebasedatabase.app/customers';
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  customers: Customer[] = [];

  constructor(private httpClient: HttpClient) { }

  createData(customer: Customer): void {
    this.httpClient.post<Customer>(`${url}.json`, customer, httpOptions).subscribe(
      res => {this.customers.push({...{key: res.name}, ...customer})},
      catchError(this.errorHandler<Customer>('POST'))
    )
  }

  getData(): void {
    this.httpClient.get<Customer[]>(`${url}.json`, httpOptions).subscribe(
      res  => {Object.keys(res).forEach((key) => {this.customers.push({key, ...res[key as any]})})},
      catchError(this.errorHandler<Customer[]>('GET'))
    )
  }

  updateData(customer: Customer, i: number): void {
    const {key, ...data} = customer;
    this.httpClient.put<Customer>(`${url}/${key}.json`, data, httpOptions).subscribe(
      res => this.customers[i] = customer,
      catchError(this.errorHandler<Customer>('PUT'))
    )
  }

  deleteData(customer: Customer): void {
    this.httpClient.delete<void>(`${url}/${customer.key}.json`, httpOptions).subscribe(
      () => this.customers.splice(this.customers.indexOf(customer), 1),
      catchError(this.errorHandler<void>('DELETE'))
    )
    
  }

  private errorHandler<T>(operation: string, res?: T): any {
    return (err: any): Observable<T> => {
      console.log(`${operation} failed: ${err}`);
      return of(res as T)
    }
  }
}
