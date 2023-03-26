import React, { useEffect } from 'react';
import { useGoogleReCaptcha } from '../provider/useGoogleRecaptcha';
import { logWarningMessage } from '../utils/helpers';

export interface IGoogleRecaptchaProps {
  onVerify: (token: string) => void | Promise<void>;
  action?: string;
  refreshReCaptcha?: boolean | string | number | null;
}

export function GoogleReCaptchaV3({ action, onVerify, refreshReCaptcha }: IGoogleRecaptchaProps) {
  const googleRecaptchaContextValue = useGoogleReCaptcha();

  useEffect(() => {
    const { executeReCaptcha } = googleRecaptchaContextValue;

    if (!executeReCaptcha) {
      return;
    }

    const handleExecuteRecaptcha = async () => {
      const token = await executeReCaptcha(action);

      if (!onVerify) {
        logWarningMessage('Please define an onVerify function');

        return;
      }

      onVerify(token);
    };

    handleExecuteRecaptcha();
  }, [action, onVerify, refreshReCaptcha, googleRecaptchaContextValue]);

  const { container } = googleRecaptchaContextValue;

  if (typeof container === 'string') {
    return <div id={container} />;
  }

  return null;
}
