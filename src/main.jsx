import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from './store';

import "../src/style/index.css";
import '../src//style/main.scss'
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </>,
)
