import { useContext } from 'react';
import { GoogleReCaptchaContext } from './GoogleReCaptchaProvider';
import { GoogleReCaptchaV2InvisibleContext } from "./GoogleReCaptchaV2InvisibleProvider";

export const useGoogleReCaptchaV2Checkbox = () => useContext(GoogleReCaptchaContext);
export const useGoogleReCaptchaV2Invisible = () => useContext(GoogleReCaptchaV2InvisibleContext);
