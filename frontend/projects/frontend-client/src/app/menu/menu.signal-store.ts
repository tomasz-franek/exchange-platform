import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

type MenuState = {
  darkMode: boolean;
};
export const initialMenuState: MenuState = {
  darkMode: false,
};

export const MenuStore = signalStore(
  { providedIn: 'root' },
  withState(initialMenuState),
  withMethods((store) => ({
    toggleDarkMode: rxMethod<void>(
      pipe(
        tap(() => {
          const currentMode = store.darkMode();
          patchState(store, { darkMode: !currentMode });
        }),
      ),
    ),
  })),
);
