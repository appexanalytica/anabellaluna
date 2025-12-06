import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AppTest from './App.test';
import { ContextProvider } from './contexts/ContextProvider';

// Cambiar entre App y AppTest para debugging
const USE_TEST = false;

ReactDOM.render(
  <React.StrictMode>
    {USE_TEST ? (
      <AppTest />
    ) : (
      <ContextProvider>
        <App />
      </ContextProvider>
    )}
  </React.StrictMode>,
  document.getElementById('root'),
);
