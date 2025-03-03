import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ce service est disponible dans toute l'application
})
export class ActivationService {
  // BehaviorSubject pour stocker l'état d'activation des services
  private activationState = new BehaviorSubject<{ [key: string]: boolean }>({});

  // Observable pour permettre aux composants de s'abonner aux changements
  activationState$ = this.activationState.asObservable();

  constructor() {}

  /**
   * Active ou désactive un service.
   * @param serviceId L'identifiant du service.
   * @param isActive L'état d'activation (true = activé, false = désactivé).
   */
  setActivationState(serviceId: string, isActive: boolean) {
    const currentState = this.activationState.value;
    this.activationState.next({ ...currentState, [serviceId]: isActive });
  }

  /**
   * Récupère l'état d'activation d'un service.
   * @param serviceId L'identifiant du service.
   * @returns L'état d'activation (true = activé, false = désactivé).
   */
  getActivationState(serviceId: string): boolean {
    return this.activationState.value[serviceId] || false;
  }
}
