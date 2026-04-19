import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AddressesService } from '../addresses.service';
import { AddressTriggerService } from '../../../address-trigger.service';

@Component({
  selector: 'app-item-address',
  imports: [],
  templateUrl: './item-address.component.html',
  styleUrl: './item-address.component.css',
})
export class ItemAddressComponent {
  private readonly addressesService = inject(AddressesService)
  private readonly AddressTriggerService = inject(AddressTriggerService)
  address = input.required<Iaddress>()
  addressesList = output<Iaddress[]>()
  AddressToUpdate = output<Iaddress>()
  openModal = output<boolean>()
  isModalAdd = output<boolean>()
  loadingDelete = signal<boolean>(false)

  constructor(){
    effect(()=>{
      if (this.AddressTriggerService.addId()===this.address()._id) {
        this.deleteAction()
      }
    })
  }

  deleteAddress() {
    if (this.loadingDelete()) return;

    this.loadingDelete.set(true)
   this.deleteAction()
  }

deleteAction(){
   this.addressesService.removeAddress(this.address()._id).subscribe({
      next: res => {
        this.loadingDelete.set(false)
        this.addressesList.emit(res.data)
      },
      error: err => {
        this.loadingDelete.set(false)
      }
    })
}
  editAddress(){
    if (this.loadingDelete()) return
    this.AddressToUpdate.emit(this.address())
    this.isModalAdd.emit(false)
    this.openModal.emit(true)
  }
}
