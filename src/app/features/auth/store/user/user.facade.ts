import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser, selectUserLoaded, selectUserRole } from './user.selectors';
import { loadUser } from './user.actions';

@Injectable({ providedIn: 'root' })
export class AuthUserFacade {
  private store = inject(Store);

  user$ = this.store.select(selectUser);
  role$ = this.store.select(selectUserRole);
  loaded$ = this.store.select(selectUserLoaded);

  loadUser() {
    this.store.dispatch(loadUser());
  }
}
