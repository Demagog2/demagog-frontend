import {useShareableState} from "@/libs/useShareableState"
import { useBetween } from "use-between";
import Script from 'next/script';
import CloseIcon from '@/assets/icons/close.svg'

export default function DonateModal() {
    const { setDonateModal } = useBetween(useShareableState);
    return (
      <div className="modal">
        <div className="modal-overlay"></div>
        <div className="modal-container px-5">
            <div className="w-100 mw-500px bg-light p-5 p-lg-8 rounded-l shadow">
                <div className="mb-4">
                    <h2 className="fs-2">Podpořte Demagog.cz</h2>
                    <p className="fs-6">Fungujeme díky podpoře od&nbsp;čtenářů, jako jste vy.</p>
                </div>
                <div className="donate d-flex justify-content-center">
                    <div data-darujme-widget-token="2lxybp84z777gdff">&nbsp;</div>
                    <Script
                        id="donate-script2"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                            +function(w, d, s, u, a, b) {
                                w['DarujmeObject'] = u;
                                w[u] = w[u] || function () { (w[u].q = w[u].q || []).push(arguments) };
                                a = d.createElement(s); b = d.getElementsByTagName(s)[0];
                                a.async = 1; a.src = "https:\/\/www.darujme.cz\/assets\/scripts\/widget.js";
                                b.parentNode.insertBefore(a, b);
                            }(window, document, 'script', 'Darujme');
                            Darujme(1, "2lxybp84z777gdff", 'render', "https:\/\/www.darujme.cz\/widget?token=2lxybp84z777gdff", "270px");
                        `,
                        }}
                    />
                </div>

            </div>
        </div>
        <div
            className="close-button rounded-circle bg-white"
            onClick={() => setDonateModal(false)}
        >
            <span className="symbol symbol-50px d-flex align-items-center justify-content-center ">
                <CloseIcon className="h-40px w-40px"/>
            </span>
        </div>
      </div>

    )
}
