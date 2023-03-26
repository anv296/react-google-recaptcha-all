import React, { useEffect } from 'react';
import { useGoogleReCaptcha } from '../provider/useGoogleRecaptcha';
import { logWarningMessage } from '../utils/helpers';

export interface GoogleReCaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
  refreshReCaptcha?: boolean | string | number | null;
}

export function GoogleReCaptchaV2CheckBox({
  action,
  onVerify,
  refreshReCaptcha
}: GoogleReCaptchaProps) {
  const googleReCaptchaContextValue = useGoogleReCaptcha();

  useEffect(() => {
    const { executeReCaptcha } = googleReCaptchaContextValue;

    if (!executeReCaptcha) {
      return;
    }

    const handleExecuteReCaptcha = async () => {
      const token = await executeReCaptcha(action);

      if (!onVerify) {
        logWarningMessage('Please define an onVerify function');
        return;
      }

      onVerify(token);
    };

    handleExecuteReCaptcha();
  }, [action, onVerify, refreshReCaptcha, googleReCaptchaContextValue]);

  const { container } = googleReCaptchaContextValue;

  if (typeof container === 'string') {
    return <div id={container} />;
  }

  return null;
}
