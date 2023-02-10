import LogoSection from "../LogoSection";
import EmailSubscribe from "../EmailSubscribe";

function FooterTabletPortrait() {
  return (
    <div className="grid grid-rows-2">
      <div className="grid grid-cols-2">
        <LogoSection />
        <EmailSubscribe />
      </div>

      <div className="grid grid-cols-2">
        <div>
          2-1
        </div>
        <div>
          2-2
        </div>
      </div>
    </div>
  );
}

export default FooterTabletPortrait;