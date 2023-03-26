import { useContext } from 'react';
import { GoogleReCaptchaContext } from './GoogleReCaptchaProvider';

export const useGoogleReCaptcha = () => useContext(GoogleReCaptchaContext);
