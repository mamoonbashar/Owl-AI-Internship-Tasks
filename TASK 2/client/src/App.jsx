
import SignUpForm from "./components/Signup-Form";
import Styles from "./styles/App.module.css";
function App() {
  return (
    <div className={Styles.appWrapper}>
      <div className={Styles.IllustrationImage}></div>
      <main className={Styles.contentOverlay}>
        <SignUpForm />
      </main>
    </div>
  );
}

export default App;
