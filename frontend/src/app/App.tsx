import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { loadCartFromStorage } from '../store/middleware/cartPersist';
import { syncCartSuccess } from '../store/sagas/cart/reducer';
import AppContent from './AppContent';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadCartFromStorage().then((items) => {
      if (items.length > 0) {
        store.dispatch(syncCartSuccess(items ?? []));
      }
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
