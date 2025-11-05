import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();

  toggle() {
    const currentValue = this.isOpen.value;
    const newValue = !currentValue;
    this.isOpen.next(newValue);
   }

  close() {
    this.isOpen.next(false);
  }

  open() {
    this.isOpen.next(true);
  }
}
