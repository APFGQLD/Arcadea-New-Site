import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './EventReplayPage.css';

const EventReplayPage = () => {
    useEffect(() => {
        // Inject the eWebinar script
        const script = document.createElement('script');
        script.innerHTML = `(function (w,d,s,o,f,js,fjs) { w['eWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) }; if(d.getElementById(o)) return; js = d.createElement(s), fjs = d.getElementsByTagName(s)[0]; js.id = o; js.src = f; fjs.parentNode.insertBefore(js, fjs); }(window, document, 'script', '_ew', 'https://app.ewebinar.com/widget.js'));_ew('init', {"root":"w1766968927369","isReview":false,"mode":"public","openInPopup":false,"for":"Registration","type":"RegForm","source":"callreplay","url":"https://www.apfg.au/event/seminyak","shortUrl":"https://apfg.ewebinar.com/webinar/20889","sessions":[],"formType":"LatestForm","ewebinar":{"title":"Seminyak%20Investment%20Session","borderRadius":50,"primaryColor":"#6bbb9d","readableColor":"#ffffff","actionColor":"#00c1b4ff","readableActionColor":"#ffffff","readableOnWhiteColor":"#6bbb9d","language":"en","duration":814},"showGdprBanner":false,"gdprBannerMode":"Off","gdprBannerText":"","hideBranding":false,"teamId":"8354","carouselId":"","isWebinarRegPage":false,"isMobile":false,"initialized":false,"multiStepRegistration":false,"inSeriesLandingPage":false,"showTimeZone":true,"button":{"btnText":"Join Now","showButtonTimer":false,"buttonPrimaryColor":"#113b15ff","buttonReadableColor":"#ffffff","align":"Center","isFullWidth":false,"step1BtnText":"Complete sign up →"},"registerForm":{"horizontal":false,"hideSessionsDropdown":true,"showOnlyBuiltInFields":true,"showFieldsLabel":false,"openLinkInNewWindow":false,"showConsentCheckbox":false,"formSessionType":"Replay","consentCheckboxText":"","fields":[{"__typename":"RegistrationFormField","fieldName":"Name","propertyName":"name","type":"Text","subType":null,"isRequired":true,"isRemovable":false,"note":"","options":null},{"__typename":"RegistrationFormField","fieldName":"Email","propertyName":"email","type":"Email","subType":null,"isRequired":true,"isRemovable":false,"note":"","options":null},{"__typename":"RegistrationFormField","fieldName":"Phone Number","propertyName":"phoneNumber","type":"Phone","subType":null,"isRequired":true,"isRemovable":true,"note":"","options":null},{"__typename":"RegistrationFormField","fieldName":"ref","propertyName":"ref","type":"Hidden","subType":null,"isRequired":false,"isRemovable":true,"note":"","options":null}]}});window.ewInit && window.ewInit();`;
        document.body.appendChild(script);

        return () => {
            // Cleanup script if necessary, though typical analytics/widget scripts are global
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="event-replay-page">
            <Navbar />

            {/* Hero Section */}
            <section className="event-hero">
                <p>Exclusive Replay</p>
                <h1>Seminyak Investment Session</h1>
                <div className="event-divider"></div>
            </section>

            <main className="event-container">
                {/* eWebinar Embed Container */}
                <div id="w1766968927369" className="ewebinar__Widget ewebinar__RegForm_Root" style={{ width: '100%' }}>
                    {/* The form details are injected by the script logic, but we need the HTML structure present
              However, the provided embed code is a mix of HTML and Script.
              The script targets the ID "w1766968927369".
              We'll render the initial static HTML structure provided to avoid layout shifts.
          */}
                    <form className="ewebinar__RegForm ewebinar--ltr">
                        <div className="ewebinar__RegForm__Content">
                            <div>
                                <div id="session" className="ewebinar__RegForm__Field ewebinar__RegForm__Field--Sessions" style={{ display: 'none' }}>
                                    <input type="hidden" name="session" id="session" />
                                    <div className="ewebinar__RegForm__Field__Error"></div>
                                </div>
                                <div className="ewebinar__RegForm__Field">
                                    <div className="ewebinar__RegForm__Field__Input">
                                        <input id="name" name="name" autoComplete="name" placeholder="Name" />
                                    </div>
                                    <div className="ewebinar__RegForm__Field__Error"></div>
                                </div>
                                <div className="ewebinar__RegForm__Field ewebinar__RegForm__Field__Email">
                                    <div className="ewebinar__RegForm__Field__Input">
                                        <input id="email" name="email" autoComplete="email" placeholder="Email" />
                                    </div>
                                    <div className="ewebinar__RegForm__Field__Error"></div>
                                </div>
                                <div className="ewebinar__RegForm__Field ewebinar__RegForm__Field--Hidden">
                                    <input type="hidden" id="ref" name="ref" placeholder="ref" />
                                </div>
                            </div>
                            <div className="ewebinar__RegForm__Captcha"></div>
                            <div className="ewebinar__RegForm__Error"></div>
                        </div>
                        <div className="ewebinar__RegForm__Footer">
                            <a className="ewebinar__RegisterButton__Wrap ewebinar--ltr" href="javascript:;" style={{ textDecoration: 'none' }}>
                                <button className="ewebinar__Widget ewebinar__RegisterButton" type="submit" style={{ borderRadius: '50px', background: '#113b15ff', color: '#ffffff' }}>
                                    <div className="ewebinar__Dots">
                                        <span className="ewebinar__LoadingDot" style={{ background: '#ffffff' }}></span>
                                        <span className="ewebinar__LoadingDot" style={{ background: '#ffffff' }}></span>
                                        <span className="ewebinar__LoadingDot" style={{ background: '#ffffff' }}></span>
                                    </div>
                                    <span className="ewebinar__ButtonText" style={{ whiteSpace: 'nowrap' }}>Join Now</span>
                                </button>
                            </a>
                            <noscript style={{ display: 'flex', minWidth: 'fit-content' }}>
                                <div style={{ textAlign: 'center', margin: '0.5em', textDecoration: 'none' }}>
                                    <a style={{ color: '#000', fontSize: '13px' }} href="https://www.apfg.au/event/seminyak">Join Now</a>
                                </div>
                            </noscript>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EventReplayPage;
