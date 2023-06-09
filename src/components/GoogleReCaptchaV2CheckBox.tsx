import React, { useEffect } from 'react';
import { useGoogleReCaptchaV2Checkbox } from '../provider/useGoogleRecaptcha';

export function GoogleReCaptchaV2CheckBox() {
  const googleReCaptchaContextValue = useGoogleReCaptchaV2Checkbox();
  console.log('@@@ GoogleReCaptchaV2CheckBox');

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
