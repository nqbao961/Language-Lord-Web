import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './services/@redux/store';
import { Routes } from './services/router';
import { BrowserRouter } from 'react-router-dom';
import 'simplebar/dist/simplebar.min.css';
import { Loading, Modal } from './components';
import './i18n';
import { Suspense } from 'react';

ReactDOM.render(
  <Suspense fallback={<Loading loading />}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <Loading />
      <Modal />
    </Provider>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
