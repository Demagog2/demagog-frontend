// <% content_for(:title, get_web_content("article.collaboration_with_facebook", "title")) %>
// <% content_for(:description, strip_tags(get_web_content("article.collaboration_with_facebook", "intro")).truncate(230)) %>

import { gql } from '@/__generated__'
import { FacebookCollaborationQuery } from '@/__generated__/graphql'
import ArticleItem from '@/components/article/Item'
import ArticleTags from '@/components/article/Tags'
import client from '@/libs/apollo-client'
import { parsePage } from '@/libs/pagination'
import { NextPageContext } from 'next'
import Link from 'next/link'

export async function getStaticProps({ query }: NextPageContext) {
  const page = parsePage(query?.page)

  const { data } = await client.query({
    query: gql(`
        query facebookCollaboration {
          articles {
            id
            articleType
            ...ArticleDetail
          }
          articleTags(limit: 5) {
            ...ArticleTagDetail
          }
        #   ...MostSearchedSpeakers
        }
      `),
  })

  return {
    props: {
      data,
      page,
    },
  }
}

export default function FacebookCollaboration({
  data,
  page,
}: {
  data: FacebookCollaborationQuery
  page: number
}) {
  return (
    <div className="container">
      <div className="row g-5 g-lg-10 flex-lg-row-reverse">
        <div className="col col-12">
          <ArticleTags tags={data.articleTags} isFacebookActive />
        </div>
        {/* <% if @page_number.blank? %> */}
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
              {/* <h1 className="display-5 fw-bold m-0 p-0"><%= get_web_content("article.collaboration_with_facebook", "title") %></h1> */}
              <h1 className="display-5 fw-bold m-0 p-0">
                Spolupráce s Facebookem
              </h1>
              <div className="fs-5 mt-5 dark-content">
                {/* <%= raw(get_web_content("article.collaboration_with_facebook", "intro")) %> */}
                Demagog.cz se v květnu 2020 zapojil do sítě nezávislých
                fact-checkingových partnerů, kteří pro společnost Facebook
                ověřují pravdivost vybraného facebookového a instagramového
                obsahu. Pokud se ukáže, že jde o nepravdivý nebo zavádějící
                obsah, díky naší spolupráci s Facebookem se při dalším sdílení
                uživatelům může ukázat varování a odkaz na ověření na našem
                webu.{' '}
                <Link href="/diskuze/demagog-cz-bude">
                  Více o spolupráci si přečtete v našem komentáři.
                </Link>
              </div>
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
            {/* TODO: Remove filter, fetch facebook fact chcecks directly */}
            {page === 1 &&
              data.articles
                .filter(
                  (article) => article.articleType === 'facebook_factcheck'
                )
                .map((article) => (
                  <ArticleItem
                    key={article.id}
                    article={article}
                    prefix="/diskuze/"
                  />
                ))}
          </div>
        </div>
        <div className="col col-12">
          <div className="row row-cols-1 row-cols-lg-2 g-5">
            {/* <% @bottom_articles.each do |article| %>
          <%= render partial: "components/article_main", object: article, as: :article %>
        <% end %> */}
          </div>
        </div>
        {/* <% end %> */}
        {/* <% if @page_number %>
    <div className="col col-12">
      <div className="row row-cols-1 row-cols-lg-2 g-5 g-lg-10">
        <% @articles.each do |article| %>
          <%= render partial: "components/article_main", object: article, as: :article %>
        <% end %>
      </div>
    </div>
  <% end %> */}

        {/* <div className="col col-12">
    <div className="mb-10">
      <% if path_to_prev_page @articles %>
        <a href="<%= path_to_prev_page  @articles %>" className="btn h-50px fs-6 me-2 mb-2 px-8">
          <span>Zobrazit předchozí</span>
        </a>
      <% end %>
      <% if path_to_next_page @articles %>
        <a href="<%= path_to_next_page  @articles %>" className="btn h-50px fs-6 me-2 mb-2 px-8">
          <span>Zobrazit další</span>
        </a>
      <% end %>
    </div>
  </div> */}
      </div>
    </div>
  )
}
