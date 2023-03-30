import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { GoogleReCaptchaProvider } from './provider/GoogleReCaptchaProvider';
import { GoogleReCaptchaV2InvisibleProvider } from "./provider/GoogleReCaptchaV2InvisibleProvider";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <GoogleReCaptchaProvider
  //   reCaptchaKey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
  //   locale='ru'
  //   scriptProps={{
  //     async: false,
  //     defer: false,
  //     appendTo: 'head',
  //     nonce: undefined
  //   }}
  //   container={{
  //     element: 'test',
  //     parameters: {}
  //   }
  //   }
  // >
  //   <App />
  // </GoogleReCaptchaProvider>

  <GoogleReCaptchaV2InvisibleProvider
    reCaptchaKey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
    locale='ru'
    scriptProps={{
      appendTo: 'head',
      onLoadCallbackName: 'onloadCallback'
    }}
    container={{
      element: 'submit',
      parameters: {
        callback: function(token) {
          console.log('success!');
        },
        badge: 'bottomright'
      }
    }
    }
  >
    <App />
  </GoogleReCaptchaV2InvisibleProvider>
);
