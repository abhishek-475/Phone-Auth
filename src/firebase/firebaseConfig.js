import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAhP73Ye4F60BDYGF7UkKuPMqSafp9oNdc",
  authDomain: "phone-auth-ea55b.firebaseapp.com",
  projectId: "phone-auth-ea55b",
  storageBucket: "phone-auth-ea55b.firebasestorage.app",
  messagingSenderId: "1038741416904",
  appId: "1:1038741416904:web:243fbbeac633003d876efd"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const setupRecaptcha = (containerId) => {
  const recaptchaVerifier = new RecaptchaVerifier(containerId, {
    size: 'invisible', 
    callback: (response) => console.log('reCAPTCHA response:', response),
    'expired-callback': () => console.log('Captcha expired'),
  }, auth);


  return recaptchaVerifier;
};

export { auth, setupRecaptcha };