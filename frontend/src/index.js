// import React from 'react'
// import ReactDOM from 'react-dom/client'

// import App from './App'

// ReactDOM.createRoot(document.getElementById('root')).render(<App />)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App'
import store from './store';

// const queryClient = new QueryClient();
console.log(store.getState());

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)