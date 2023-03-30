interface InjectGoogleReCaptchaScriptParams {
  version?: 'v2Invisible' | 'v2Checkbox' | 'v3'
  render: string;
  onLoadCallbackName: string;
  onLoad: () => void;
  onError: () => void;
  locale?: string;
  scriptProps?: {
    nonce?: string;
    defer?: boolean;
    async?: boolean;
    appendTo?: 'head' | 'body';
    id?: string;
  };
}

const cleanGstaticRecaptchaScript = () => {
  const script = document.querySelector(
    'script[src^="https://www.gstatic.com/recaptcha/releases"]'
  );

  if (script) {
    script.remove();
  }
};

export const isScriptInjected = (scriptId: string) => !!document.querySelector(`#${scriptId}`);

const removeDefaultBadge = () => {
  const nodeBadge = document.querySelector('.grecaptcha-badge');
  if (nodeBadge && nodeBadge.parentNode) {
    document.body.removeChild(nodeBadge.parentNode);
  }
};

const cleanCustomBadge = (customBadge: HTMLElement | null) => {
  if (!customBadge) {
    return;
  }

  while (customBadge.lastChild) {
    customBadge.lastChild.remove();
  }
};

export const cleanBadge = (container?: HTMLElement | string) => {
  if (!container) {
    removeDefaultBadge();

    return;
  }

  const customBadge =
    typeof container === 'string' ? document.getElementById(container) : container;

  cleanCustomBadge(customBadge);
};

export const cleanGoogleReCaptcha = (scriptId: string, container?: HTMLElement | string) => {
  // remove badge
  cleanBadge(container);

  // remove old config from window
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (window as any).___grecaptcha_cfg = undefined;

  // remove script
  const script = document.querySelector(`#${scriptId}`);
  if (script) {
    script.remove();
  }

  cleanGstaticRecaptchaScript();
};

export const injectGoogleReCaptchaScript = ({
  // version,
  render,
  onLoadCallbackName,
  locale,
  onLoad,
  scriptProps: { nonce = '', defer = false, async = false, id = '', appendTo } = {}
}: InjectGoogleReCaptchaScriptParams) => {
  const scriptId = id || 'google-recaptcha';

  if (isScriptInjected(scriptId)) {
    onLoad();
    return;
  }

  const js = document.createElement('script');
  js.id = scriptId;
  js.src = `https://www.recaptcha.net/recaptcha/api.js?render=${render}${
    render === 'explicit' ? `&onload=${onLoadCallbackName}` : ''
  }${locale ? `&hl=${locale}` : ''}`;

  if (!!nonce) {
    js.nonce = nonce;
  }

  js.defer = !!defer;
  js.async = !!async;
  js.onload = onLoad;

  const elementToInjectScript =
    appendTo === 'body' ? document.body : document.getElementsByTagName('head')[0];

  elementToInjectScript.appendChild(js);
};

export const logWarningMessage = (message: string) => {
  const isDevelopmentMode =
    typeof process !== 'undefined' && !!process.env && process.env.NODE_ENV !== 'production';

  if (isDevelopmentMode) {
    return;
  }

  console.warn(message);
};
