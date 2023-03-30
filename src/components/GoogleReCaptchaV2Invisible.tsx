import React, { useEffect } from 'react';
import { useGoogleReCaptchaV2Invisible } from '../provider/useGoogleRecaptcha';

export function GoogleReCaptchaV2Invisible() {
  const googleReCaptchaContextValue = useGoogleReCaptchaV2Invisible();
  console.log('@@@ GoogleReCaptchaV2Invisible', googleReCaptchaContextValue);

  useEffect(() => {
    const { executeReCaptcha } = googleReCaptchaContextValue;

    if (!executeReCaptcha) {
      return;
    }

    executeReCaptcha();
  }, [googleReCaptchaContextValue]);

  const { container } = googleReCaptchaContextValue;
  console.log('@ container', container);

  if (typeof container === 'string') {
    return <div id={container} />;
  }

  return null;
}
