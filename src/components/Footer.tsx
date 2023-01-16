import "./Footer.css";
import { HoverUnderline } from "./HoverUnderline";

const Footer = () => (
  <section className="footer my-5 text-end fixed-bottom container">
    <small>
      <span className="pe-1">&copy;2023</span>
      <a
        href="mailto:weijingjaylin@gmail.com"
        className="link-dark text-decoration-none"
        style={{}}
      >
        <HoverUnderline>Feedback</HoverUnderline>
      </a>
    </small>
  </section>
);

export default Footer;
