import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
  <footer className={`${styles.footer}  text-center text-lg-start`}>
    <div className={`text-center p-3 ${styles.copyright}`}>
      © {currentYear} Copyright:
<a className={`text-center p-3 ${styles.copyright}`} href="https://www.spacecodey.com/">SpaceCodey</a>
    </div>
  </footer>
  );
};

export default Footer;
