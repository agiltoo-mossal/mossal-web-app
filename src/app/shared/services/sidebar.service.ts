import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isOpenSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  // Méthode pour ouvrir le sidebar
  toggleSidebar(val: boolean): void {
    this.isOpenSubject.next(val);
  }

  // Méthode pour obtenir l'état actuel du sidebar (ouvert ou fermé)
  isSidebarOpen(): Observable<boolean> {
    return this.isOpenSubject.asObservable();
  }
}
