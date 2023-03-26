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

interface GoogleReCaptchaProviderProps {
  reCaptchaKey: string; // sitekey
  locale?: string; // hl
  // useRecaptchaNet?: boolean;
  // useEnterprise?: boolean;
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
      // badge?: 'inline' | 'bottomleft' | 'bottomright';
      theme?: 'dark' | 'light';
      size?: 'compact' | 'normal';
      tabindex?: number;
      callback?: () => void;
      expiredCallback?: () => void;
      errorCallback?: () => void;
    };
  };
  children: ReactNode;
}

export interface IGoogleReCaptchaConsumerProps {
  executeReCaptcha?: (action?: string) => Promise<string>;
  container?: string | HTMLElement;
}
const GoogleReCaptchaContext = createContext<IGoogleReCaptchaConsumerProps>({
  executeReCaptcha: () => {
    // This default context function is not supposed to be called
    throw Error(
      'GoogleReCaptcha Context has not yet been implemented, if you are using useGoogleReCaptcha hook, make sure the hook is called inside component wrapped by GoogleRecaptchaProvider'
    );
  }
});

const { Consumer: GoogleReCaptchaConsumer } = GoogleReCaptchaContext;

export function GoogleReCaptchaProvider({
  reCaptchaKey,
  // useEnterprise = false,
  // useRecaptchaNet = false,
  scriptProps,
  locale,
  container,
  children
}: GoogleReCaptchaProviderProps) {
  const [googleReCaptchaInstance, setGoogleReCaptchaInstance] = useState<null | {
    execute: Function;
  }>(null);
  const clientId = useRef(reCaptchaKey);

  const scriptPropsJson = JSON.stringify(scriptProps);
  const parametersJson = JSON.stringify(container?.parameters);

  useEffect(() => {
    if (!reCaptchaKey) {
      logWarningMessage(`<GoogleReCaptchaProvider /> recaptcha key not provided`);
      return;
    }

    const scriptId = scriptProps?.id || 'google-recaptcha-v2';
    const onLoadCallbackName = scriptProps?.onLoadCallbackName || 'onReCaptchaLoadCallback';

    (window as unknown as { [key: string]: () => void })[onLoadCallbackName] = () => {
      const googleRecaptcha = (window as any).grecaptcha;

      const googleRecaptchaParams = {
        // badge: 'inline',
        size: 'normal',
        sitekey: reCaptchaKey,
        ...(container?.parameters || {})
      };
      clientId.current = googleRecaptcha.render(container?.element, googleRecaptchaParams);
    };

    const onLoad = () => {
      if (!window || !(window as any).grecaptcha) {
        logWarningMessage(`<GoogleRecaptchaProvider /> Recaptcha script is not available`);
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
      render: container?.element ? 'explicit' : reCaptchaKey,
      onLoadCallbackName,
      // useEnterprise,
      // useRecaptchaNet,
      scriptProps,
      locale,
      onLoad,
      onError
    });

    return () => {
      cleanGoogleReCaptcha(scriptId, container?.element);
    };
  }, [
    // useEnterprise,
    // useRecaptchaNet,
    scriptPropsJson,
    parametersJson,
    locale,
    reCaptchaKey,
    container?.element
  ]);

  const executeReCaptcha = useCallback(
    (action?: string) => {
      if (!googleReCaptchaInstance || !googleReCaptchaInstance.execute) {
        throw new Error('<GoogleReCaptchaProvider /> Google Recaptcha has not been loaded');
      }

      return googleReCaptchaInstance.execute(clientId.current, { action });
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
    <GoogleReCaptchaContext.Provider value={googleReCaptchaContextValue}>
      {children}
    </GoogleReCaptchaContext.Provider>
  );
}

export { GoogleReCaptchaConsumer, GoogleReCaptchaContext };
