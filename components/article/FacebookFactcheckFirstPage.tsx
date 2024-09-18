import { FragmentType, gql, useFragment } from '@/__generated__'
import ArticleItem from './Item'
import { drop, take } from 'lodash'
import { TagIntro } from './ArticleTagIntro'

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
        <TagIntro {...props} />
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

            return [<ArticleItem key={article?.id} article={article} />]
          })}
        </div>
      </div>
      <div className="col col-12">
        <div className="row row-cols-1 row-cols-lg-2 g-5">
          {drop(data.nodes, 4)?.flatMap((article) => {
            if (!article) {
              return null
            }

            return [<ArticleItem key={article?.id} article={article} />]
          })}
        </div>
      </div>
    </>
  )
}
