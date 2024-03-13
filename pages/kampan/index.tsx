import Image from 'next/image'
import { NextPageWithLayout } from '../_app'

import style from '@/assets/styles/campaign/styles.module.css'

import LogoCedmo from '@/assets/images/campaign/logo-cedmo.png'
import LogoCT from '@/assets/images/campaign/logo-ct.png'
import { useEffect, useState } from 'react'
import { Page } from '../../components/campaign/Page'
import { ButtonBack } from '../../components/campaign/ButtonBack'
import { ButtonNext } from '@/components/campaign/ButtonNext'
import { ArrowsWrapper } from '../../components/campaign/ArrowsWrapper'
import { CampaignHeader } from '@/components/campaign/CampaignHeader'
import { AnimatedChart } from '@/components/campaign/AnimatedChart'
import { runAnimatedChartEffects } from '@/libs/campaign/animate-charts'
import classNames from 'classnames'

const Campaign: NextPageWithLayout = () => {
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (page === 1) {
      runAnimatedChartEffects()
    }
  }, [page])

  return (
    <>
      <Page className={style.page1} isActive={page === 0}>
        <CampaignHeader />

        <div className={style.headerContainerPage1}>
          <h1 className={style.headerWhite}>
            <span className={style.headerOrange}>Dezinformace</span>
            <br></br>
            nás mohou zasáhnout...
          </h1>
        </div>
        <div
          className={classNames(
            style.partnersContainer1,
            style.partnersContainer1Page1
          )}
        >
          <div className={style.partnersContainer2}>
            <p className={style.partnersP}>Partneři projektu:</p>
            <div className={style.partnersContainerLogo}>
              <Image src={LogoCedmo} className={style.logoCedmo} alt="CEDMO" />

              <Image
                src={LogoCT}
                className={style.logoCt}
                alt="Ceska televize"
              />
            </div>
          </div>
        </div>
        <ArrowsWrapper>
          <ButtonBack isHidden />
          <ButtonNext onClick={() => setPage(1)} />
        </ArrowsWrapper>
      </Page>

      <Page className={style.page2} isActive={page === 1}>
        <CampaignHeader />

        <div className={style.headerContainerPage2}>
          <h1 className={style.headerWhitePage2}>...více, než si myslíte</h1>
        </div>
        <div className={style.blurBgPage2}>
          <div className={style.textContainerPage2}>
            <div className={style.textSection1Page2}>
              <AnimatedChart value={65} />

              <p className={style.textWhite}>
                *65% lidí považuje šíření{' '}
                <span className={style.textOrange}>
                  dezinformací na internetu
                </span>{' '}
                za závažný problém
              </p>
            </div>
            <div className={style.textSection2Page2}>
              <AnimatedChart value={61} />

              <p className={style.textWhite}>
                *61% lidí si myslí, že&nbsp;
                <span className={style.textOrange}>
                  šíření dezinformací ohrožuje bezpečnost
                </span>
                &nbsp; České republiky
              </p>
            </div>
            <p className={style.additionalInfo}>
              *Tady vysvětlení hvězdicky, může být takto dlouhé, možná víc
            </p>
          </div>
        </div>
        <div
          className={classNames(
            style.partnersContainer1,
            style.partnersContainer1Page2
          )}
        >
          <div className={style.partnersContainer2}>
            <p className={style.partnersP}>Partneři projektu:</p>
            <div className={style.partnersContainerLogo}>
              <Image src={LogoCedmo} className={style.logoCedmo} alt="CEDMO" />

              <Image
                src={LogoCT}
                className={style.logoCt}
                alt="Ceska televize"
              />
            </div>
          </div>
        </div>

        <ArrowsWrapper>
          <ButtonBack onClick={() => setPage(0)} />
          <ButtonNext onClick={() => setPage(2)} />
        </ArrowsWrapper>
      </Page>

      <Page className={style.page3} isActive={page === 2}>
        <CampaignHeader />

        <div className={style.headerContainerPage3}>
          <h1 className={style.headerPage3}>
            <span className={style.headerOrangePage3}>Ověřujeme</span> pro Vás
          </h1>
        </div>

        <div className={style.blurBg}>
          <p className={style.textPage3}>
            <a className={style.linkOrange} href="https://demagog.cz">
              Demagog.cz
            </a>{' '}
            je unikátní český projekt zaměřený na ověřování politických výroků a
            obsahu na sociálních sítích.
          </p>
          <ul style={{ listStyle: 'bullet' }} className={style.ulPage3}>
            <li className={style.listPage3}>
              <p className={style.liText}>více, než deset let zkušeností</p>
            </li>
            <li className={style.listPage3}>
              <p className={style.liText}>
                součástí mezinárodních fact-checkingových organizací
              </p>
            </li>
            <li className={style.listPage3}>
              <p className={style.liText}>partneři Facebooku pro ČR</p>
            </li>
          </ul>
        </div>

        <div className={style.buttonsContainer1Page3}>
          <div className={style.buttonsContainer2Page3}>
            <a
              className={classNames(style.buttonsPage3, style.btnTop)}
              href="https://demagog.cz/vypis-recniku"
            >
              Co říkají politici
            </a>
            <a
              className={style.buttonsPage3}
              href="https://demagog.cz/spoluprace-s-facebookem"
            >
              Jaké dezinformace se šíří aktuálně na sítích
            </a>
          </div>
          <div className="video-container-page3">
            <button
              className="play-video-icon open-modal"
              title="play-video"
            ></button>
            <a href="https://www.youtube.com/embed/V9QM6XogqvU" title="video">
              <button className="play-video-icon-mobile" title="video"></button>
            </a>
            <button className="play-video-text open-modal" title="video">
              Přehrát video
            </button>
            <a href="https://www.youtube.com/embed/V9QM6XogqvU">
              <button className="play-video-text-mobile" title="video">
                Přehrát video
              </button>
            </a>
          </div>
          <div className={style.modal}>
            {/* <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/V9QM6XogqvU"
              title="Jaromir Jagr commercial (1998)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe> */}
            <span className="close">&times;</span>
          </div>
        </div>
        <div
          className={classNames(
            style.partnersContainer1,
            style.partnersContainer1Page3
          )}
        >
          <div className={style.partnersContainer2page3}>
            <p className={style.partnersP}>Partneři projektu:</p>
            <div className={style.partnersContainerLogo}>
              <Image src={LogoCedmo} className={style.logoCedmo} alt="CEDMO" />

              <Image
                src={LogoCT}
                className={style.logoCt}
                alt="Ceska televize"
              />
            </div>
          </div>
        </div>

        <ArrowsWrapper>
          <ButtonBack onClick={() => setPage(1)} />
          <ButtonNext isHidden />
        </ArrowsWrapper>
      </Page>
    </>
  )
}

Campaign.getLayout = (page) => {
  return <div>{page}</div>
}

export default Campaign
