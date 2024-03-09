import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../Redux/Reducers/index';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

export default function renderWithReduxAndRouter(
  ui,
  {
    initialState,
    store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    }),
    route = '/',
  } = {}
) {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );

  return {
    user: userEvent.setup(),
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
