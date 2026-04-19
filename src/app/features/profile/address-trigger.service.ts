import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddressTriggerService {
    addId = signal<string>('')

  callDeleteAddress(addressId:string) {
    this.addId.set(addressId)  
  }
}
