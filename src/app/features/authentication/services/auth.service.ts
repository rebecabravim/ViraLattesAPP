import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';
import { LoginModel } from '../models/login.model';
import { ApiResponse } from '../../../core/shared/api-response.model';
import { AuthResultModel } from '../models/auth-result.model';

 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5158/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    public loaderService: LoaderService,
  ) {}

  public login(loginDto: LoginModel): Observable<ApiResponse<AuthResultModel>> {
    return this.http.post<ApiResponse<AuthResultModel>>(`${this.API_URL}/Auth/LoginUser`, loginDto);
  }

  public register(loginDto: LoginModel): Observable<ApiResponse<AuthResultModel>> {
    return this.http.post<ApiResponse<AuthResultModel>>(`${this.API_URL}/Auth/RegisterUser`, loginDto);
  }

  public deleteUser(userId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.API_URL}/Auth/DeleteUser/${userId}`);
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public setUserInfo(name: string, userId: string): void {
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', userId);
  }

  public getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  public getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }

  public logout(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loaderService.show();

    this.http
      .post(
        `${this.API_URL}/Auth/LogoutUser`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .subscribe({
        next: () => {
          this.clearStorage();
          this.router.navigate(['/login']);
          this.loaderService.hide();
        },
        error: err => {
          console.error('Logout error:', err);
          this.loaderService.hide();
          // even if server fails, clear token client-side
          this.clearStorage();
          this.router.navigate(['/login']);
        },
      });
  }
}
