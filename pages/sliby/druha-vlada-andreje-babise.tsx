import TitleIcon from '@/assets//icons/promises.svg'
// TODO - List statements, filters

export default function BabisPromises() {
    return (
      <div className="container">
          <div className="row row g-5 mb-5">
            <div className="col col-12">
              <div className="d-flex">
                <span className="d-flex align-items-center me-2">
                  <TitleIcon />
                </span>
                <h1 className="display-4 fw-bold m-0 p-0">Sliby vlády Andreje Babiše</h1>
              </div>
            </div>
            <div className="col col-12 col-lg-6">
                <span className="fs-2 fw-bold">Speciální výstup Demagog.cz k plnění slibů vlády Andreje Babiše</span>
            </div>
          </div>
          <div className="row g-10">
            <div className="col col-12 col-lg-6">
                <div className="mb-4">
                    <span className="fs-6">
                        S&nbsp;končícím volebním obdobím zpracoval Demagog.cz unikátní analýzu, nakolik menšinová vláda hnutí ANO a&nbsp;ČSSD splnila závazky, které si na začátku volebního období sama vytyčila. Vláda Andreje Babiše schválila své programové prohlášení 27.&nbsp;června&nbsp;2018. Z&nbsp;něj jsme vybrali padesátku slibů napříč tématy a&nbsp;ty jsme po celé volební období průběžně sledovali.
                    </span>
                </div>
                <div>
                    <span className="fs-6">
                        Nyní si tak můžete přečíst, jak si druhá Babišova vláda vedla v&nbsp;plnění slibů v&nbsp;oblasti hospodářství, životního prostředí, sociálního státu, vzdělanosti, právního státu a&nbsp;bezpečnosti. U&nbsp;každého slibu jsme na základě dohledávání primárních zdrojů informací zkoumali, zda se jej koalici podařilo naplnit. Pro potřeby tohoto výstupu pracujeme s&nbsp;třemi kategoriemi hodnocení — jde o&nbsp;sliby splněné, částečně splněné nebo porušené (více v <a href="https://demagog.cz/diskuze/overujeme-sliby-vlady-andreje-babise">metodice</a>). Cílem hodnocení není říct, zda vláda byla dobrá, nebo špatná, úspěšná, nebo neúspěšná. To si rozhodne každý volič 8.&nbsp;a&nbsp;9.&nbsp;října u&nbsp;volební urny. Naším cílem bylo nabídnout veřejnosti tvrdá data a&nbsp;poctivou analýzu namísto impulzivních a zkratkovitých hodnocení, která s&nbsp;sebou nese (nejen) předvolební kampaň.
                    </span>
                </div>
            </div>
            <div className="col col-12 col-lg-6">
                <div className="mb-4">
                    <span className="fs-6">
                        Z&nbsp;výsledků analýzy vyplývá, že z&nbsp;celkových 50 slibů vláda splnila 22 slibů, 13 splnila částečně a&nbsp;zbývajících 15 slibů porušila.
                    </span>
                </div>
                <div className="mb-4">
                    <span className="fs-6">
                        Druhá polovina funkčního období vlády byla charakterizována probíhající pandemií covidu-19. S&nbsp;ní spojené výzvy se pochopitelně podepsaly i&nbsp;na plnění programového prohlášení. Na naši metodiku hodnocení jednotlivých slibů to vliv nemělo, při čtení naší analýzy ale dopad pandemie na práci vlády mějte na paměti.
                    </span>
                </div>
                <div className="mb-4">
                    <span className="fs-6">
                        Analýzu jsme zpracovali k&nbsp;17.&nbsp;září&nbsp;2021, s&nbsp;ohledem na případné legislativní posuny u&nbsp;některých slibů ji budeme do sněmovních voleb aktualizovat.
                    </span>
                </div>
                <div>
                    <span className="fs-6">
                        Za podporu děkujeme Nadačnímu fondu pro nezávislou žurnalistiku.
                    </span>
                </div>
            </div>
          </div>
      </div>
    )
}