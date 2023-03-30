import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  cleanGoogleReCaptcha,
  injectGoogleReCaptchaScript,
  logWarningMessage
} from '../utils/helpers';

interface GoogleReCaptchaV2InvisibleProviderProps {
  reCaptchaKey: string; // sitekey
  locale?: string; // hl
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
    id?: string;
    onLoadCallbackName?: string;
  };
  container?: {
    element?: string | HTMLElement;
    parameters: {
      badge?: 'inline' | 'bottomleft' | 'bottomright';
      size?: 'invisible';
      tabindex?: number;
      callback?: (token: any) => void;
      expiredCallback?: () => void;
      errorCallback?: () => void;
      isolated?: boolean;
    };
  };
  children: ReactNode;
}

export interface GoogleReCaptchaV2InvisibleConsumerProps {
  executeReCaptcha?: (action?: string) => Promise<string>;
  container?: string | HTMLElement;
}
const GoogleReCaptchaV2InvisibleContext = createContext<GoogleReCaptchaV2InvisibleConsumerProps>({
  executeReCaptcha: () => {
    // This default context function is not supposed to be called
    throw Error(
      'GoogleReCaptcha Context has not yet been implemented, if you are using useGoogleReCaptcha hook, make sure the hook is called inside component wrapped by GoogleRecaptchaProvider'
    );
  }
});

const { Consumer: GoogleReCaptchaV2InvisibleConsumer } = GoogleReCaptchaV2InvisibleContext;

export function GoogleReCaptchaV2InvisibleProvider({
                                          reCaptchaKey,
                                          scriptProps,
                                          locale,
                                          container,
                                          children
                                        }: GoogleReCaptchaV2InvisibleProviderProps) {
  console.log('@ GoogleReCaptchaV2InvisibleProvider');
  const [googleReCaptchaInstance, setGoogleReCaptchaInstance] = useState<null | {
    execute: Function;
  }>(null);
  const clientId = useRef(reCaptchaKey);

  const scriptPropsJson = JSON.stringify(scriptProps);
  const parametersJson = JSON.stringify(container?.parameters);

  useEffect(() => {
    if (!reCaptchaKey) {
      logWarningMessage(`<GoogleReCaptchaV2InvisibleProvider /> recaptcha key not provided`);
      return;
    }

    const scriptId = scriptProps?.id || 'google-recaptcha-v2-invisible';
    const onLoadCallbackName = scriptProps?.onLoadCallbackName || 'onReCaptchaLoadCallback';

    (window as unknown as { [key: string]: () => void })[onLoadCallbackName] = () => {
      const googleRecaptcha = (window as any).grecaptcha;

      const googleRecaptchaParams = {
        badge: 'inline',
        size: 'invisible',
        sitekey: reCaptchaKey,
        ...(!!container && {...container.parameters})
      };
      clientId.current = googleRecaptcha.render(container?.element, googleRecaptchaParams);
    };

    const onLoad = () => {
      if (!window || !(window as any).grecaptcha) {
        logWarningMessage(`<GoogleReCaptchaV2InvisibleProvider /> Recaptcha script is not available`);
        return;
      }

      const googleRecaptcha = (window as any).grecaptcha;

      googleRecaptcha.ready(() => {
        setGoogleReCaptchaInstance(googleRecaptcha);
      });
    };

    const onError = () => {
      logWarningMessage('Error loading google recaptcha script');
    };

    injectGoogleReCaptchaScript({
      version: 'v2Invisible',
      render: container?.element ? 'explicit' : onLoadCallbackName,
      onLoadCallbackName,
      scriptProps,
      locale,
      onLoad,
      onError
    });

    return () => {
      cleanGoogleReCaptcha(scriptId, container?.element);
    };
  }, [
    scriptPropsJson,
    parametersJson,
    locale,
    reCaptchaKey,
    container?.element
  ]);

  const executeReCaptcha = useCallback(
    () => {
      if (!googleReCaptchaInstance || !googleReCaptchaInstance.execute) {
        throw new Error('<GoogleReCaptchaV2InvisibleProvider /> Google Recaptcha has not been loaded');
      }

      return googleReCaptchaInstance.execute(clientId.current);
    },
    [googleReCaptchaInstance, clientId]
  );

  const googleReCaptchaContextValue = useMemo(
    () => ({
      executeRecaptcha: googleReCaptchaInstance ? executeReCaptcha : undefined,
      container: container?.element
    }),
    [executeReCaptcha, googleReCaptchaInstance, container?.element]
  );

  return (
    <GoogleReCaptchaV2InvisibleContext.Provider value={googleReCaptchaContextValue}>
      {children}
    </GoogleReCaptchaV2InvisibleContext.Provider>
  );
}

export { GoogleReCaptchaV2InvisibleConsumer, GoogleReCaptchaV2InvisibleContext };
