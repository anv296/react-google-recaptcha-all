import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleReCaptchaProvider } from './provider/GoogleReCaptchaProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleReCaptchaProvider
    reCaptchaKey='6LdXj_8aAAAAAJQ3LLRMT6Luw_sMURCe9m_bKZeo'
    locale='ru'
    scriptProps={{
      async: false,
      defer: false,
      appendTo: 'head',
      nonce: undefined
    }}
  >
    <App />
  </GoogleReCaptchaProvider>
);
