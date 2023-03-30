// import { GoogleReCaptchaV2CheckBox } from "./components/GoogleReCaptchaV2CheckBox";

// import { GoogleReCaptchaV2Invisible } from "./components/GoogleReCaptchaV2Invisible";

function App() {

  // const onSubmit = function(token) {
  //   console.log('success!');
  // };
  //
  // const onloadCallback = function() {
  //   grecaptcha.render('submit', {
  //     'sitekey' : 'your_site_key',
  //     'callback' : onSubmit
  //   });
  // };

  return (
    <div>
      <h1>Invisible</h1>
      <div id='test' />
      {/*<GoogleReCaptchaV2CheckBox />*/}
      <form action="?" method="POST">
        <input id="submit" type="submit" value="Submit"/>
      </form>
      {/*<GoogleReCaptchaV2Invisible />*/}
    </div>
  );
}

export default App;
