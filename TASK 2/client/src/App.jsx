import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SignInForm from "./components/Login-Form";
import SignUpForm from "./components/Signup-Form";
import Styles from "./styles/App.module.css";
function App() {
  return (
    <Router>
      <div className={Styles.appWrapper}>
        <div className={Styles.IllustrationImage}></div>

        <main className={Styles.contentOverlay}>
          <Routes>
            <Route path="/" element={<SignInForm />} />
            <Route path="/SignUp" element={<SignUpForm />} />
            <Route path="/home" element={<Home />} />
            {/* <SignUpForm /> */}
            {/* <SignInForm /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
