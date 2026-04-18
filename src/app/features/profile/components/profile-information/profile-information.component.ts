import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MystorageService } from '../../../../core/services/mystorage.service';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-profile-information',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.css',
})
export class ProfileInformationComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly mystorageService = inject(MystorageService);
  private readonly authService = inject(AuthService);
  showErrors = signal<boolean>(false)
  isSuccess = signal<boolean>(false)
  Message = signal<string>('')
  loading = signal<boolean>(false)
  userId = signal<string>('')
  role = signal<string>('')
  infoForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', Validators.email],
    phone: ['', Validators.pattern(/^01[0125][0-9]{8}$/)],
  })

  ngOnInit(): void {
    if (this.mystorageService.getUserObject()) {
      const user: Iuser = JSON.parse(this.mystorageService.getUserObject()!)
      this.role.set(user.role)
      this.infoForm.setValue({
        name: user.name,
        email: '',
        phone: '',
      })
    }

    if (this.mystorageService.getUserId()) {
      this.userId.set(this.mystorageService.getUserId()!)
    }

  }




  submitInfo() {

    if (this.infoForm.invalid) {
      this.showErrors.set(true)
      return
    }
    const data = this.infoForm.value;
    let filteredData: { name: string, email?: string, phone?: string } = { name: data.name };

    if (data.email) {
      filteredData.email = data.email
    } else if (data.phone) {
      filteredData.phone = data.phone
    }

    this.updateLoggedUserData(filteredData);

  }


  updateLoggedUserData(data: object) {

    if (this.loading()) return

    this.loading.set(true)

    this.authService.updateLoggedUser(data).subscribe({
      next: res => {
        
        this.isSuccess.set(true)
        this.Message.set('Profile updated successfully')
        this.authService.user.set(res.user)
        if (this.mystorageService.get('freshUser')) {
          localStorage.setItem('freshUser', JSON.stringify(res.user));
        } else {
          sessionStorage.setItem('freshUser', JSON.stringify(res.user));
        }
        this.loading.set(false)

      }, error: err => {
        this.isSuccess.set(false)
        this.Message.set(err.error.errors.msg)
        this.loading.set(false)
      }
    })
  }

}
