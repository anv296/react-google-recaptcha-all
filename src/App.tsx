import { useCallback, useEffect, useState } from 'react';
import { useGoogleReCaptcha } from './provider/useGoogleRecaptcha';

function App() {
  const { executeReCaptcha } = useGoogleReCaptcha();
  const [token, setToken] = useState('');
  const [noOfVerifications, setNoOfVerifications] = useState(0);
  const [dynamicAction, setDynamicAction] = useState('homepage');
  const [actionToChange, setActionToChange] = useState('');

  const clickHandler = useCallback(async () => {
    if (!executeReCaptcha) {
      return;
    }

    const result = await executeReCaptcha('dynamicAction');

    setToken(result);
    setNoOfVerifications((noOfVerifications) => noOfVerifications + 1);
  }, [dynamicAction, executeReCaptcha]);

  const handleTextChange = useCallback((event) => {
    setActionToChange(event.target.value);
  }, []);

  const handleCommitAction = useCallback(() => {
    setDynamicAction(actionToChange);
  }, [actionToChange]);

  useEffect(() => {
    if (!executeReCaptcha || !dynamicAction) {
      return;
    }

    const handleReCaptchaVerify = async () => {
      const token = await executeReCaptcha(dynamicAction);
      setToken(token);
      setNoOfVerifications((noOfVerifications) => noOfVerifications + 1);
    };

    handleReCaptchaVerify();
  }, [executeReCaptcha, dynamicAction]);

  return (
    <div>
      <div>
        <p>Current ReCaptcha action: {dynamicAction}</p>
        <input type='text' onChange={handleTextChange} value={actionToChange} />
        <button onClick={handleCommitAction}>Change action</button>
      </div>
      <br />
      <button onClick={clickHandler}>Run verify</button>
      <br />
      {token && <p>Token: {token}</p>}
      <p> No of verifications: {noOfVerifications}</p>
    </div>
  );
}

export default App;
