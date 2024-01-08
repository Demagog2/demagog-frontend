import { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'

const codeSnippets = {
  curlExample: `curl -X POST -H "Content-Type: application/json" --data '{"query": "{ speakers(name: \\"Miloš\\") { id firstName lastName } }"}' https://demagog.cz/graphql`,
  speakerQuery: `{
 speakers(name: "Miloš") {
   id
   firstName
   lastName
 }
}`,
  speakerResponse: `{
 "data": {
   "speakers": [
     {
       "id": "244",
       "firstName": "Miloš",
       "lastName": "Vystrčil"
     },
     {
       "id": "168",
       "firstName": "Miloš",
       "lastName": "Zeman"
     }
   ]
 }
}`,
  speakersQuery: `{
  speakers(limit: 100, offset: 0) {
    id
    firstName
    lastName
    body {
      shortName
      name
    }
    stats {
      true
      untrue
      misleading
      unverifiable
    }
  }
}`,
  statementsQuery: `{
  statements(speaker: 168, limit: 20, offset: 0) {
    id
    excerptedAt
    content
    assessment {
      veracity {
        name
      }
      shortExplanation
      explanationHtml
    }
  }
}`,
}

export function DeveloperApi() {
  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll()
    }

    highlight()
  }, [])

  return (
    <>
      <div className="content fs-6">
        <p>
          Veškerá zveřejněná data projektu Demagog.cz jsou dostupná i&nbsp;přes
          API pro zobrazení na jiných serverech či pro zpracování
          v&nbsp;analýzách. Jde o&nbsp;API rozumějící dotazovacímu jazyku
          GraphQL a&nbsp;v&nbsp;současné době nevyžaduje autentizaci pro přístup
          k&nbsp;veřejné části dat a&nbsp;ani neomezuje množství dotazů.
        </p>

        <p>
          Máme jen jeden požadavek. Plánujete-li data (či analýzu z&nbsp;nich)
          zobrazovat veřejně, napište nám prosím na
          <a href="mailto:info@demagog.cz">info@demagog.cz</a>. Nechceme Vám
          házet klacky pod nohy, jen nám na formě zveřejnění záleží. Předem
          děkujeme.
        </p>

        <p>
          Na stejný email, <a href="mailto:info@demagog.cz">info@demagog.cz</a>,
          se nám neváhejte ozvat, pokud budete při použití API potřebovat
          asistenci.
        </p>

        <h2>GraphQL API</h2>

        <p>
          GraphQL API je dostupné na adrese{' '}
          <code>https://demagog.cz/graphql</code>
          a&nbsp;GraphQL dotazy přijímá zabalené v&nbsp;JSON formátu
          a&nbsp;v&nbsp;HTTP dotazech metody POST. Funguje tedy jako standardní
          GraphQL API.
        </p>

        <p>
          Jednoduchý GraphQL dotaz, například na seznam řečníků se jménem
          Miloš...
        </p>

        <pre className="mb-5">
          <code className="language-graphql" style={{ fontSize: 14 }}>
            {codeSnippets.speakerQuery}
          </code>
        </pre>

        <p>... by tak pomocí nástroje cURL vypadal následovně:</p>

        <pre className="mb-5">
          <code
            className="language-bash"
            style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}
          >
            {codeSnippets.curlExample}
          </code>
        </pre>

        <p>API by pak na takový dotaz mělo odpovědět:</p>

        <pre className="mb-5">
          <code className="language-json" style={{ fontSize: 14 }}>
            {codeSnippets.speakerResponse}
          </code>
        </pre>

        <h2>GraphQL schéma a rozhraní klienta GraphiQL</h2>

        <p>
          V&nbsp;příkladu výše si můžete všimnout, že v&nbsp;dotazu jsme se
          ptali u&nbsp;řečníků pouze na jejich ID (pozn. pouze interní ID pro
          identifikaci v rámci projektu Demagog.cz), křestní jméno
          a&nbsp;příjmení. Dat o&nbsp;řečnících máme ale mnohem víc &mdash;
          kromě jiného jejich příslušnost k&nbsp;politickým stranám, adresu
          profilového obrázku, nebo samozřejmě seznam jejich výroků, které jsme
          ověřili.
        </p>

        <p>
          Dotazovací jazyk GraphQL umožňuje zvolit si přesně, o&nbsp;která data
          máte zájem. A&nbsp;abyste věděli, co je vůbec dostupné, API umí
          zprostředkovat GraphQL schéma se všemi dostupnými dotazy
          a&nbsp;parametry. Schéma se vám tedy zobrazí, pokud API otevřete
          v&nbsp;některém z&nbsp;GraphQL klientů. My vedle API nainstalovali
          klienta GraphiQL a&nbsp;je to tedy nejjednodušší cesta, jak se ke
          schématu dostat.
        </p>

        <p>
          Rozhraní klienta GraphiQL je dostupné na adrese
          <a href="https://demagog.cz/graphiql">https://demagog.cz/graphiql</a>
          a&nbsp;schéma zobrazuje v pravém sloupci, který se zobrazí po kliknutí
          na <em>Docs</em> v pravém horním rohu. Kliknete-li dále na{' '}
          <em>Query</em>, zobrazí se seznam všech dostupných dotazů, jejich
          možné parametry a&nbsp;typy výsledků. Najdete mezi nimi i&nbsp;dotaz{' '}
          <code>speakers</code>, který jsme použili výše.
        </p>

        <p>
          Kromě zobrazení schématu lze přes GraphiQL i&nbsp;rovnou posílat
          dotazy na API a&nbsp;rychle se tak dostat k&nbsp;datům. Neumožňuje ale
          například export do souboru. Pokud jsou pro vás funkce jako export
          důležité, můžeme doporučit desktopového GraphQL klienta
          <a href="https://altair.sirmuel.design/">Altair</a>.
        </p>

        <h2>Příklady GraphQL dotazů</h2>

        <p>
          Prokousat se schématem dat nemusí být jednoduché, připravili jsme tedy
          několik příkladů GraphQL dotazů, které se mohou během začátku hodit.
        </p>

        <p>
          Seznam všech řečníků s&nbsp;příslušností ke straně či hnutí a&nbsp;se
          statistikami ověřených výroků:
        </p>

        <pre className="mb-5">
          <code className="language-graphql" style={{ fontSize: 14 }}>
            {codeSnippets.speakersQuery}
          </code>
        </pre>

        <p>
          Prvních dvacet ověřených výroků prezidenta Miloše Zemana s hodnocením
          a odůvodněním (168 je naše interní ID, ID jiných řečníků lze najít
          přes seznam všech řečníků):
        </p>

        <pre>
          <code className="language-graphql mb-5" style={{ fontSize: 14 }}>
            {codeSnippets.statementsQuery}
          </code>
        </pre>
      </div>
    </>
  )
}
