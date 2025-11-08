import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterModel, RegisterRequest } from '../../models/register.model';
import { ROUTE_PATHS } from '../../../../app.paths';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  registerModel: RegisterModel = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(form: NgForm): void {
    if (!form.valid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (this.registerModel.password !== this.registerModel.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (this.registerModel.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerRequest: RegisterRequest = {
      name: this.registerModel.name,
      email: this.registerModel.email,
      password: this.registerModel.password
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Conta criada com sucesso! Redirecionando para login...';
          
          // Redireciona para login após 2 segundos
          setTimeout(() => {
            this.router.navigate([ROUTE_PATHS.login]);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Erro ao criar conta. Tente novamente.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro no registro:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Erro ao conectar com o servidor. Tente novamente.';
        }
      }
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate([ROUTE_PATHS.login]);
  }

  validatePasswords(): boolean {
    return this.registerModel.password === this.registerModel.confirmPassword;
  }

  getPasswordStrength(): string {
    const password = this.registerModel.password;
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
    return 'medium';
  }
}