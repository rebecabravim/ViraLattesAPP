import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ROUTE_PATHS } from '../../../../app.paths';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { LoginModel } from '../../models/login.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  private loginModel!: LoginModel;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  protected onSubmit() {
    if (this.loginForm.valid) {
      this.loginModel = this.transformToLoginModel();

      this.loaderService.show();

      this.authService.login(this.loginModel).subscribe({
        next: response => {
          if (response.success && response.data) {
            this.authService.setToken(response.data.token);
            this.authService.setUserInfo(response.data.name, response.data.userId);

            this.loginForm.reset();

            this.router.navigate([ROUTE_PATHS.home]);

            this.loaderService.hide();

            return;
          }

          if (response.success == false) {
            this.loaderService.hide();
            alert(response.message);
            this.loginForm.reset();
          }
        },
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }

  private transformToLoginModel(): LoginModel {
    let model: LoginModel;

    model = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    return model;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  goToRegister() {
    this.router.navigate([ROUTE_PATHS.register]);
  }
}
