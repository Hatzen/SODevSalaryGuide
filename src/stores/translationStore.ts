import { makeAutoObservable } from 'mobx'
import controlStore from './controlStore'

const translations = {
    en: {
        // App Bar
        title: 'Stackoverflow Developer Salary Guide',
        language: 'Language',

        // Tabs
        salaryTab: 'Salary',
        participationTab: 'Participation',
        consideredDataTab: 'Considered Data',
        currencyRatesTab: 'Currency Rates',
        estimatorTab: 'Salary Estimator',

        // ControlPane
        filters: 'Filters',
        lastFilterUpdate: 'Last filter update',
        yearLabel: 'Show data for year',
        currencyLabel: 'Currency',
        genderLabel: 'Gender',
        genderMale: 'Male',
        genderFemale: 'Female',
        genderOther: 'Other',
        experienceLabel: 'Years of Expirience',
        abilitiesLabel: 'Tools and Technologies',
        companySizeLabel: 'Company Size',
        countriesLabel: 'Countries',
        degreeLabel: 'Highest Degree',
        salaryFilterLabel: 'Salary Threshold Filter',
        salaryFilterHint: 'When disabled: consider all salaries. When enabled: filter 10k-250k',
        companySizeFrom: 'From',
        companySizeTo: 'To',
        saveToSession: 'Save to Session',
        loadFromSession: 'Load from Session',
        downloadJson: 'Download JSON',
        uploadJson: 'Upload JSON',
        shareLink: 'Share Link',
        shareLinkSuccess: 'Share link copied to clipboard!',

        // ConsideredDataTable
        rawCsvTab: 'Raw CSV',
        mappedTab: 'Mapped All',
        filteredTab: 'Filtered',
        entries: 'entries',
        page: 'Page',
        salaryRaw: 'Salary (raw)',
        salaryConverted: 'Salary',

        // BoxPlot
        noDataAvailable: 'No data available',
        medianLabel: 'Median',
        meanLabel: 'Mean',
        stdLabel: 'Std',

        // CurrencyConversionTable
        currencyRates: 'Currency Conversion Rates',
        sourceApi: 'Source: FreeCurrencyAPI',
        usingDefaults: 'Using default values (API unavailable)',
        rateToUSD: 'Rate (1 USD = X)',
        rateFromUSD: 'Inverse Rate (1 X = USD)',
        showingRates: 'Showing {count} currency conversion rates',

        // Statistics Modal
        statisticsHelp: 'What do these numbers mean?',
        statisticsMeanTitle: 'Mean (Average)',
        statisticsMeanText: 'The arithmetic average of all salaries. It is pulled up by very high incomes, so the mean is often higher than what a typical developer actually earns.',
        statisticsMedianTitle: 'Median',
        statisticsMedianText: 'The value in the exact middle: half of the developers earn more, half earn less. The median describes a "typical" salary better than the mean because it is not distorted by extremes.',
        statisticsStdTitle: 'Standard Deviation (Std)',
        statisticsStdText: 'Describes how wide the salaries are spread around the mean. A small std means the values are close together (consistent data), a large std means there are big differences between developers.',
        statisticsQualityTitle: 'How good is the data?',
        statisticsQualityText: 'The reliability depends mainly on the sample size and the std. With only a few entries (small sample size) or a very large std, the values become unreliable. A large std also means the realistic range of salaries is wide, so your personal result can differ a lot.',
        statisticsCompanySizeTitle: 'Company size matters',
        statisticsCompanySizeText: 'Large companies usually pay more and have structured, well-documented salary systems. Small companies or startups may offer a lower base salary but broader responsibilities, faster growth or equity. Always compare within a comparable company size.',
        statisticsWorkforceTitle: 'Factual income through the workforce',
        statisticsWorkforceText: 'The "factual" salary is what employees actually earn on average at a given employer. This can differ strongly from the self-reported survey values here, because voluntary surveys are biased: higher earners and people with strong opinions tend to respond more often, while underpaid employees are underrepresented.',
        statisticsSourcesTitle: 'Where to get information about a specific company or job',
        statisticsSourcesText: 'For a concrete employer or position, check independent sources: kununu (employee reviews and reported salaries), the official annual financial statements / company balance that some countries legally require to be published, and trade unions or collective agreements (Tarifverträge) that define binding salary ranges for entire industries.',
        statisticsRealisticTitle: 'Where are realistic salaries?',
        statisticsRealisticText: 'For a normal distribution, roughly 68% of all developers earn between "Mean − Std" and "Mean + Std". This range is a good estimate of what a realistic salary looks like.',

        // Estimator
        estimatorIntro: 'Enter your profile and we estimate the salary you could expect, based on the Stack Overflow data. You can also compare similar datasets.',
        estimatorExperience: 'Years of experience',
        estimatorAbilities: 'Tools and Technologies',
        estimatorCountries: 'Countries',
        estimatorDegree: 'Highest Degree',
        estimatorCompanySize: 'Company Size',
        estimatorGender: 'Gender',
        estimatorCalculate: 'Estimate expected salary',
        estimatorResultTitle: 'Estimated expected salary',
        estimatorNoData: 'Not enough data for this combination of filters. Try to broaden your selection.',
        estimatorSampleSize: 'Based on {count} data points',
        estimatorTypicalRange: 'Typical realistic range',
        estimatorDataQuality: 'Data quality',
        estimatorQualityGood: 'Good - enough data and a consistent spread',
        estimatorQualityMedium: 'Medium - the estimate is an approximation',
        estimatorQualityLow: 'Low - too little data or very high spread, treat with caution',
        estimatorSimilarTitle: 'Similar datasets to compare',
        estimatorSimilarHint: 'Datasets that differ in only one criterion from your selection, so you can see its effect on the salary.',
        estimatorDifference: 'Difference',
        estimatorSameAsSelected: 'Your selection',
        estimatorLoading: 'Calculating...',

        // Modal
        disclaimer: 'Disclaimer',
        disclaimerGotIt: 'Got it!',
        disclaimerContent: 'This project is not affiliated with Stack Overflow. Salary data is for informational purposes only.'
    },
    de: {
        // App Bar
        title: 'Stackoverflow Entwickler Gehaltsrechner',
        language: 'Sprache',

        // Tabs
        salaryTab: 'Gehalt',
        participationTab: 'Teilnahme',
        consideredDataTab: 'Berücksichtigte Daten',
        currencyRatesTab: 'Währungskurse',
        estimatorTab: 'Gehaltsschätzer',

        // ControlPane
        filters: 'Filter',
        lastFilterUpdate: 'Letzte Filteraktualisierung',
        yearLabel: 'Daten für Jahr anzeigen',
        currencyLabel: 'Währung',
        genderLabel: 'Geschlecht',
        genderMale: 'Männlich',
        genderFemale: 'Weiblich',
        genderOther: 'Andere',
        experienceLabel: 'Jahre Erfahrung',
        abilitiesLabel: 'Tools und Technologien',
        companySizeLabel: 'Firmengröße',
        countriesLabel: 'Länder',
        degreeLabel: 'Höchster Abschluss',
        salaryFilterLabel: 'Gehaltsfilter',
        salaryFilterHint: 'Wenn deaktiviert: alle Gehälter berücksichtigen. Wenn aktiviert: Filter 10k-250k',
        companySizeFrom: 'Von',
        companySizeTo: 'Bis',
        saveToSession: 'In Sitzung speichern',
        loadFromSession: 'Aus Sitzung laden',
        downloadJson: 'JSON herunterladen',
        uploadJson: 'JSON hochladen',
        shareLink: 'Link teilen',
        shareLinkSuccess: 'Link in die Zwischenablage kopieren!',

        // ConsideredDataTable
        dataTables: 'Daten Tabellen',
        rawCsvTab: 'Roh CSV',
        mappedTab: 'Alle gemappt',
        filteredTab: 'Gefiltert',
        entries: 'Einträge',
        page: 'Seite',
        salaryRaw: 'Gehalt (roh)',
        salaryConverted: 'Gehalt',

        // BoxPlot
        noDataAvailable: 'Keine Daten verfügbar',
        medianLabel: 'Median',
        meanLabel: 'Mittel',
        stdLabel: 'Std',

        // CurrencyConversionTable
        currencyRates: 'Währungskurse',
        sourceApi: 'Quelle: FreeCurrencyAPI',
        usingDefaults: 'Verwende Standardwerte (API nicht verfügbar)',
        rateToUSD: 'Kurs (1 USD = X)',
        rateFromUSD: 'Umgekehrt (1 X = USD)',
        showingRates: '{count} Währungskurse werden angezeigt',

        // Statistics Modal
        statisticsHelp: 'Was bedeuten diese Zahlen?',
        statisticsMeanTitle: 'Mittelwert (Durchschnitt)',
        statisticsMeanText: 'Der rechnerische Durchschnitt aller Gehälter. Sehr hohe Einkommen ziehen den Wert nach oben, weshalb der Mittelwert oft höher ist als das, was ein typischer Entwickler verdient.',
        statisticsMedianTitle: 'Median',
        statisticsMedianText: 'Der Wert genau in der Mitte: Die Hälfte der Entwickler verdient mehr, die Hälfte weniger. Der Median beschreibt ein "typisches" Gehalt besser als der Mittelwert, da er nicht durch Extremwerte verzerrt wird.',
        statisticsStdTitle: 'Standardabweichung (Std)',
        statisticsStdText: 'Beschreibt, wie stark die Gehälter um den Mittelwert streuen. Ein kleiner Std bedeutet, die Werte liegen eng beieinander (konsistente Daten), ein großer Std bedeutet große Unterschiede zwischen den Entwicklern.',
        statisticsQualityTitle: 'Wie gut sind die Daten?',
        statisticsQualityText: 'Die Zuverlässigkeit hängt vor allem von der Stichprobengröße und dem Std ab. Bei wenigen Einträgen (kleine Stichprobe) oder sehr großem Std werden die Werte unzuverlässig. Ein großer Std bedeutet zudem, dass die Spanne realistischer Gehälter breit ist und dein persönliches Ergebnis stark abweichen kann.',
        statisticsCompanySizeTitle: 'Unternehmensgröße spielt eine Rolle',
        statisticsCompanySizeText: 'Große Unternehmen zahlen meist mehr und haben strukturierte, gut dokumentierte Gehaltssysteme. Kleine Firmen oder Startups bieten eventuell niedrigere Grundgehälter, dafür breitere Verantwortung, schnelleres Wachstum oder Anteile. Vergleiche immer innerhalb einer vergleichbaren Unternehmensgröße.',
        statisticsWorkforceTitle: 'Faktisches Einkommen über die Belegschaft',
        statisticsWorkforceText: 'Das "faktische" Gehalt ist das, was Beschäftigte bei einem bestimmten Arbeitgeber tatsächlich im Schnitt verdienen. Das kann stark von den hier selbst gemeldeten Umfragewerten abweichen, da freiwillige Umfragen verzerrt sind: Gutverdiener und Menschen mit starker Meinung antworten häufiger, während Geringverdiener unterrepräsentiert sind.',
        statisticsSourcesTitle: 'Wo gibt es Informationen zu einem bestimmten Unternehmen oder Job?',
        statisticsSourcesText: 'Für einen konkreten Arbeitgeber oder eine Stelle solltest du unabhängige Quellen prüfen: kununu (Mitarbeiterbewertungen und gemeldete Gehälter), den gesetzlich in manchen Ländern veröffentlichungspflichtigen Jahresabschluss / die Bilanz des Unternehmens sowie Gewerkschaften oder Tarifverträge, die bindende Gehaltsbereiche für ganze Branchen festlegen.',
        statisticsRealisticTitle: 'Wo liegen realistische Gehälter?',
        statisticsRealisticText: 'Bei einer Normalverteilung liegen etwa 68% aller Entwickler zwischen "Mittelwert − Std" und "Mittelwert + Std". Dieser Bereich ist eine gute Schätzung für ein realistisches Gehalt.',

        // Estimator
        estimatorIntro: 'Gib dein Profil ein und wir schätzen das Gehalt, das du erwarten kannst, basierend auf den Stack-Overflow-Daten. Du kannst auch ähnliche Datensätze vergleichen.',
        estimatorExperience: 'Jahre Erfahrung',
        estimatorAbilities: 'Tools und Technologien',
        estimatorCountries: 'Länder',
        estimatorDegree: 'Höchster Abschluss',
        estimatorCompanySize: 'Firmengröße',
        estimatorGender: 'Geschlecht',
        estimatorCalculate: 'Erwartetes Gehalt schätzen',
        estimatorResultTitle: 'Geschätztes erwartetes Gehalt',
        estimatorNoData: 'Nicht genug Daten für diese Filterkombination. Versuche, deine Auswahl zu erweitern.',
        estimatorSampleSize: 'Basiert auf {count} Datenpunkten',
        estimatorTypicalRange: 'Typischer realistischer Bereich',
        estimatorDataQuality: 'Datenqualität',
        estimatorQualityGood: 'Gut - genug Daten und konsistente Streuung',
        estimatorQualityMedium: 'Mittel - die Schätzung ist eine Näherung',
        estimatorQualityLow: 'Niedrig - zu wenig Daten oder sehr hohe Streuung, mit Vorsicht genießen',
        estimatorSimilarTitle: 'Ähnliche Datensätze zum Vergleich',
        estimatorSimilarHint: 'Datensätze, die sich in nur einem Kriterium von deiner Auswahl unterscheiden, damit du den Effekt auf das Gehalt siehst.',
        estimatorDifference: 'Differenz',
        estimatorSameAsSelected: 'Deine Auswahl',
        estimatorLoading: 'Berechne...',

        // Modal
        disclaimer: 'Hinweis',
        disclaimerGotIt: 'Verstanden!',
        disclaimerContent: 'Dieses Projekt ist nicht mit Stack Overflow verbunden. Gehaltsdaten dienen nur zu Informationszwecken.'
    }
}

export type TranslationKey = keyof typeof translations.en
export type SupportedLanguage = 'en' | 'de'

class TranslationStore {
    constructor() {
        makeAutoObservable(this)
    }

    get language(): SupportedLanguage {
        return controlStore.language ?? 'en'
    }

    get t(): typeof translations.en {
        const lang = this.language as keyof typeof translations
        return translations[lang] ?? translations.en
    }

    translate(key: TranslationKey, params?: Record<string, string>): string {
        let value = this.t[key]
        if (params) {
            Object.entries(params).forEach(([param, val]) => {
                value = value.replace(`{${param}}`, val)
            })
        }
        return value
    }
}

export default new TranslationStore()