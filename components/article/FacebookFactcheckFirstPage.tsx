import { FragmentType, gql, useFragment } from '@/__generated__'
import Link from 'next/link'
import ArticleItem from './Item'
import { drop, take } from 'lodash'

const FacebookFactcheckFirstPageFragment = gql(`
    fragment FacebookFactcheckFirstPageFragment on ArticleConnection {
        nodes {
            id
            ...ArticleDetail
        }
    }
`)

export function FacebookFactcheckFirstPage(props: {
  data: FragmentType<typeof FacebookFactcheckFirstPageFragment>
  title: string
  description: JSX.Element
}) {
  const data = useFragment(FacebookFactcheckFirstPageFragment, props.data)
  return (
    <>
      <div className="col col-12 col-lg-4">
        <div
          className="bg-dark-light text-white p-5 p-lg-8 rounded-l mb-10"
          data-controller="components--mobile-expander"
          data-action="resize@window->components--mobile-expander#layout"
          data-components--mobile-expander-breakpoint="992"
          data-components--mobile-expander-min-height="100px"
          data-components--mobile-expander-open-label="Skrýt obsah"
          data-components--mobile-expander-close-label="Zobrazit více"
        >
          <div
            className="expander expander-dark-light"
            data-target="components--mobile-expander.expander"
          >
            <h1 className="display-5 fw-bold m-0 p-0">{props.title}</h1>
            <div className="fs-5 mt-5 dark-content">{props.description}</div>
          </div>
          <div className="d-flex">
            <a
              href="#"
              className="text-white text-underline mt-3 hide"
              data-target="components--mobile-expander.link"
              data-action="click->components--mobile-expander#toggle"
            >
              <span
                className="py-2 fs-5"
                data-target="components--mobile-expander.label"
              >
                Zobrazit více
              </span>
            </a>
          </div>
        </div>
        <div className="bg-light text-dark p-5 p-lg-8 rounded-l d-none d-lg-flex">
          <div className="w-100">
            <div className="mb-4">
              <h2 className="fs-2">Podpořte Demagog.cz</h2>
              <p className="fs-6">
                Fungujeme díky podpoře od&nbsp;čtenářů, jako jste vy.
              </p>
            </div>
            <div className="d-flex justify-content-center">
              <div data-darujme-widget-token="rfq62o07d045bw95">&nbsp;</div>
              {/* <script type="text/javascript">
            +function(w, d, s, u, a, b) {
              w['DarujmeObject'] = u;
              w[u] = w[u] || function () { (w[u].q = w[u].q || []).push(arguments) };
              a = d.createElement(s); b = d.getElementsByTagName(s)[0];
              a.async = 1; a.src = "https:\/\/www.darujme.cz\/assets\/scripts\/widget.js";
              b.parentNode.insertBefore(a, b);
            }(window, document, 'script', 'Darujme');
            Darujme(1, "rfq62o07d045bw95", 'render', "https:\/\/www.darujme.cz\/widget?token=rfq62o07d045bw95", "270px");
          </script> */}
            </div>
          </div>
        </div>
      </div>
      <div className="col col-12 col-lg-8 mb-0 mb-lg-10">
        <div className="row row-cols-1 g-5 g-lg-10">
          {take(data.nodes, 4)?.flatMap((article) => {
            if (!article) {
              return []
            }

            return [
              <ArticleItem
                key={article?.id}
                article={article}
                prefix="/diskuze/"
              />,
            ]
          })}
        </div>
      </div>
      <div className="col col-12">
        <div className="row row-cols-1 row-cols-lg-2 g-5">
          {drop(data.nodes, 4)?.flatMap((article) => {
            if (!article) {
              return null
            }

            return [
              <ArticleItem
                key={article?.id}
                article={article}
                prefix="/diskuze/"
              />,
            ]
          })}
        </div>
      </div>
    </>
  )
}
