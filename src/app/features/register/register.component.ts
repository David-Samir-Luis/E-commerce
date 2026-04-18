import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isShowPassword=signal<string>('password');
  isShowRepassword=signal<string>('password');
  strength = signal<number>(0);
  strengthText = signal<string>('Weak');
  strengthColor = signal<string>('bg-red-400');


  passwordErrorMessage = signal<string>('');

  acountErrorMessage=signal<string>('');

  loading=signal<boolean>(false);

  showErrors = signal<boolean>(false);

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  privacyCheck: FormControl = this.fb.control(false, Validators.requiredTrue)
  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  }, { validators: this.confirmPassword })


  confirmPassword(g: AbstractControl) {
    const password = g.get('password')?.value;
    const rePassword = g.get('rePassword')?.value;
    if (password !== rePassword && rePassword !== '') {
      g.get('rePassword')?.setErrors({ mismatch: true })
      return { misMatch: true }
    }
    return null
  }



  submitForm(): void {
    if (this.registerForm.invalid || this.privacyCheck.invalid) {
      this.showErrors.set(true);
      return
    }
    
     this.sendSignUpData();

  }

  sendSignUpData():void{
    this.loading.set(true)
    this.authService.signUp(this.registerForm.value).subscribe({
      next:res=>{
        if (res.message==='success') {
          this.router.navigate(['/login'])
          this.loading.set(false)
        }
      },
      error:err=>{
        this.acountErrorMessage.set(err.error.message);
        this.loading.set(false)
      }
    })
  }


  checkStrength(password: string) {
    let score = 0;

    if (password.length >= 8) { score++; }
    else { this.passwordErrorMessage.set('* Password must be at least 8 characters long') }

    if (/[^A-Za-z0-9]/.test(password)) { score++; }
    else { this.passwordErrorMessage.set('* Password must contain at least one special character') }

    if (/[0-9]/.test(password)) { score++; }
    else { this.passwordErrorMessage.set('* Password must contain at least one number') }

    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) { score++; }
    else {this.passwordErrorMessage.set('* Password must contain at least one uppercase and one lowercase character')  }

    this.strength.set((score / 4) * 100);

    switch (score) {
      case 1:
        this.strengthText.set('Weak');
        this.strengthColor.set('bg-red-500');
        break;
      case 2:
        this.strengthText.set('fair');
        this.strengthColor.set('bg-orange-500');
        break;
      case 3:
        this.strengthText.set('good');
        this.strengthColor.set('bg-blue-500');
        break;
      case 4:
        this.strengthText.set('strong');
        this.strengthColor.set('bg-green-500');
        break;
    }
  }
}
