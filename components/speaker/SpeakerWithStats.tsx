import Image from 'next/image'
import classNames from 'classnames'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { SpeakerLink } from './SpeakerLink'

export const SpeakerWithStatsFragment = gql(`
  fragment SpeakerWithStats on ArticleSpeakerStats {
    speaker {
      id
      avatar(size: detail)
      fullName
      role
      body {
        shortName
      }
      ...SpeakerLink
    }
    stats {
      true
      untrue
      misleading
      unverifiable
    }
  }
`)

export function SpeakerWithStats(props: {
  data: FragmentType<typeof SpeakerWithStatsFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const { speaker, stats } = useFragment(SpeakerWithStatsFragment, props.data)

  if (!speaker) {
    return null
  }

  return (
    <div className="row">
      <div className="col col-6 col-md-5">
        <div className="w-100 px-5">
          <SpeakerLink speaker={speaker} className="d-block position-relative">
            <span className="symbol symbol-square symbol-circle">
              {speaker.avatar && (
                <Image
                  src={mediaUrl + speaker.avatar}
                  alt={speaker.fullName}
                  width={127}
                  height={127}
                />
              )}
            </span>
            {speaker.body?.shortName && (
              <div className="symbol-label d-flex align-items-center justify-content-center w-45px h-45px rounded-circle bg-dark">
                <span className="smallest text-white lh-1 text-center p-2">
                  {speaker.body.shortName}
                </span>
              </div>
            )}
          </SpeakerLink>
        </div>
        <div className="text-center lh-1 mt-5">
          <h3 className="fs-4 fw-bold mb-4">{speaker.fullName}</h3>
          <p className="fs-6 fw-bold mb-4">{speaker.role}</p>
        </div>
      </div>

      <div className="col col-6 col-md-7">
        <div className="stats">
          <div className="row g-5" data-controller="components--stats">
            <div className="col col-6">
              <div
                className={classNames('d-flex align-items-center mb-5', {
                  'cursor-pointer stat-link': (stats?.true ?? 0) > 0,
                })}
                title="Pravda"
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=true&recnici[]=<%= speaker.id %>"
                data-count="<%= stats[:true] %>"
              >
                <span className="w-35px h-35px d-flex align-items-center justify-content-center bg-primary rounded-circle me-2">
                  <svg
                    width="17"
                    height="13"
                    viewBox="0 0 17 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.0507812 6.4745L1.38245 5.10858L6.00525 9.6629L15.5667 0.135742L16.9326 1.50166L6.00525 12.3947L0.0507812 6.4745Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span className="fs-2 fw-bold">{stats?.true}</span>
              </div>
              <div
                className={classNames('d-flex align-items-center mb-5', {
                  'cursor-pointer stat-link': (stats?.unverifiable ?? 0) > 0,
                })}
                title="Neověřitelné"
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=unverifiable&recnici[]=<%= speaker.id %>"
                data-count="<%= stats[:unverifiable] %>"
              >
                <span className="w-35px h-35px d-flex align-items-center justify-content-center bg-gray rounded-circle me-2">
                  <svg
                    width="12"
                    height="22"
                    viewBox="0 0 15 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.21838 18.8279V18.6782C5.23443 17.111 5.40024 15.8647 5.71047 14.934C6.0207 14.0086 6.46466 13.2544 7.04233 12.6821C7.62001 12.1098 8.30466 11.5803 9.11233 11.0935C9.59373 10.7993 10.0323 10.4463 10.4174 10.0398C10.8026 9.63328 11.1074 9.16258 11.3321 8.6277C11.5567 8.09281 11.6691 7.50444 11.6691 6.85723C11.6691 6.05491 11.4819 5.35421 11.1021 4.76584C10.7223 4.17747 10.2195 3.71747 9.58838 3.40189C8.95721 3.08096 8.25652 2.92049 7.48094 2.92049C6.80698 2.92049 6.15977 3.05956 5.53396 3.3377C4.90815 3.61584 4.38931 4.05444 3.9721 4.65351C3.55489 5.25258 3.30884 6.03886 3.24466 7.007H0.142334C0.20652 5.61095 0.570241 4.41816 1.2335 3.42328C1.8914 2.4284 2.76861 1.66886 3.85443 1.14468C4.94024 0.620491 6.14908 0.358398 7.48094 0.358398C8.92512 0.358398 10.1821 0.647236 11.2519 1.21956C12.3216 1.79189 13.1507 2.58351 13.7391 3.58375C14.3274 4.58398 14.6216 5.72328 14.6216 7.007C14.6216 7.91095 14.4826 8.72398 14.2098 9.45677C13.937 10.1896 13.5412 10.8421 13.0277 11.4144C12.5142 11.9868 11.8991 12.4949 11.177 12.9389C10.4549 13.3882 9.87721 13.8642 9.43861 14.3616C9.00535 14.8591 8.68977 15.4475 8.49187 16.1268C8.29396 16.8061 8.18698 17.6565 8.17094 18.6728V18.8226H5.21838V18.8279ZM6.79628 26.113C6.18652 26.113 5.66768 25.8937 5.23443 25.4605C4.80117 25.0272 4.58187 24.503 4.58187 23.8986C4.58187 23.2942 4.80117 22.77 5.23443 22.3368C5.66768 21.9035 6.19187 21.6842 6.79628 21.6842C7.4007 21.6842 7.92489 21.9035 8.35814 22.3368C8.7914 22.77 9.0107 23.2942 9.0107 23.8986C9.0107 24.2998 8.90907 24.6689 8.71117 25.0058C8.50791 25.3428 8.24582 25.6102 7.90884 25.8135C7.57721 26.0168 7.2028 26.113 6.79628 26.113Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span className="fs-2 fw-bold">{stats?.unverifiable}</span>
              </div>
            </div>
            <div className="col col-6">
              <div
                className={classNames('d-flex align-items-center mb-5', {
                  'cursor-pointer stat-link': (stats?.untrue ?? 0) > 0,
                })}
                title="Nepravda"
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=untrue&recnici[]=<%= speaker.id %>"
                data-count="<%= stats[:untrue] %>"
              >
                <span className="w-35px h-35px d-flex align-items-center justify-content-center bg-red rounded-circle me-2">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8642 1.58955L11.4983 0.223633L6.80319 4.90351L2.1081 0.223633L0.742188 1.58955L5.43348 6.26562L0.742188 10.9417L2.1081 12.3076L6.80319 7.62773L11.4983 12.3076L12.8642 10.9417L8.17291 6.26562L12.8642 1.58955Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span className="fs-2 fw-bold">{stats?.untrue}</span>
              </div>
              <div
                className={classNames('d-flex align-items-center mb-5', {
                  'cursor-pointer stat-link': (stats?.misleading ?? 0) > 0,
                })}
                title="Zavádějící"
                data-action="click->components--stats#toggleLink"
                data-url="?hodnoceni[]=misleading&recnici[]=<%= speaker.id %>"
                data-count="<%= stats[:misleading] %>"
              >
                <span className="w-35px h-35px d-flex align-items-center justify-content-center bg-secondary rounded-circle me-2">
                  <svg
                    width="4"
                    height="22"
                    viewBox="0 0 5 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.38458 25.9392C1.77482 25.9392 1.25598 25.7199 0.822722 25.2866C0.389467 24.8534 0.170166 24.3292 0.170166 23.7248C0.170166 23.1204 0.389467 22.5962 0.822722 22.1629C1.25598 21.7297 1.78016 21.5104 2.38458 21.5104C2.989 21.5104 3.51319 21.7297 3.94644 22.1629C4.3797 22.5962 4.599 23.1204 4.599 23.7248C4.599 24.1259 4.49737 24.495 4.29946 24.832C4.09621 25.169 3.82877 25.4364 3.49714 25.6397C3.16551 25.8429 2.79109 25.9392 2.38458 25.9392ZM4.05877 0.532227L3.81272 18.6541H0.956443L0.710397 0.532227H4.05877Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span className="fs-2 fw-bold">{stats?.misleading}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
