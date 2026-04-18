import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressesService } from '../addresses/addresses.service';

@Component({
  selector: 'app-addresses-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './addresses-modal.component.html',
  styleUrl: './addresses-modal.component.css',
})
export class AddressesModalComponent implements OnInit {
  openModal = output<boolean>()
  AddressesList = output<Iaddress[]>()
  showErrors = signal<boolean>(false)
  loading = signal<boolean>(false)
  isModalAdd = input.required<boolean>()
  AddressToUpdate = input.required<Iaddress>()
  private readonly fb = inject(FormBuilder)
  private readonly addressesService = inject(AddressesService)

  addressForm = this.fb.group({
    name: ['', Validators.required],
    details: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', Validators.required]
  })

  ngOnInit(): void {
    if (this.isModalAdd()) return

    this.addressForm.setValue({
      name: this.AddressToUpdate().name,
      details: this.AddressToUpdate().details,
      phone: this.AddressToUpdate().phone,
      city: this.AddressToUpdate().city
    })
  }







  submitAddress() {
    if (this.addressForm.invalid || this.loading()) {
      this.showErrors.set(true)
      return
    }

    this.addAddress(this.addressForm.value);
  }

  closeModal() {
    if (this.loading()) return
    this.openModal.emit(false)
  }

  addAddress(data: object) {
    this.loading.set(true)
    this.addressesService.addAddress(data).subscribe({
      next: (res) => {
        this.loading.set(false)
        this.AddressesList.emit(res.data)
        this.openModal.emit(false)
      },
      error: (err) => {
        this.loading.set(false)
      }
    })
  }

}
