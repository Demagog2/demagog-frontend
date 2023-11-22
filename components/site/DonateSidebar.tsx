import Script from 'next/script';
export default function DonateSidebar() {
    return (
      <div className="bg-light text-dark p-5 p-lg-8 rounded-l d-none d-lg-flex">
        <div className="w-100">
            <h2 className="fs-2">Podpořte Demagog.cz</h2>
            <div className="mt-2">
                <span className="fs-6">Fungujeme díky podpoře od&nbsp;čtenářů, jako jste vy.</span>
            </div>
            <div className="mt-4" data-darujme-widget-token="rfq62o07d045bw95">&nbsp;</div>
            <Script id="donate-script1" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `+function(w, d, s, u, a, b) {w['DarujmeObject'] = u;w[u] = w[u] || function () { (w[u].q = w[u].q || []).push(arguments) };a = d.createElement(s); b = d.getElementsByTagName(s)[0];a.async = 1; a.src = "https:\/\/www.darujme.cz\/assets\/scripts\/widget.js";b.parentNode.insertBefore(a, b);}(window, document, 'script', 'Darujme');Darujme(1, "rfq62o07d045bw95", 'render', "https:\/\/www.darujme.cz\/widget?token=rfq62o07d045bw95", "270px");`,}}/>
        </div>
      </div>
    )
}