import Styles from "../styles/Button.module.css";

const Button = ({ children, type, className }) => {
  return (
    <button type={type} className={`${Styles.BaseStyling} ${className}`}>
      {children}
    </button>
  );
};
export default Button;
