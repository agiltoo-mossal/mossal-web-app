import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { User } from 'src/graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  constructor() {
  }
  userSignal: WritableSignal<Partial<User>> = signal({});

  updatUserSelected(data: User) {

    this.userSignal.set({ ...this.userSignal(), ...data });

  }

  get getUserSelected() {
    return this.userSignal(); }


}
