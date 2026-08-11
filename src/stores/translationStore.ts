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
        yearLabel: 'Survey Year',
        currencyLabel: 'Currency',
        controlPaneHint: 'The filters below need to be activated with the checkbox, only enabled checkboxes will lead to consider the selected  filter values below.',
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
        salaryFilterHint: 'When disabled: consider all salaries. When enabled: filter by salary range',
        companySizeFrom: 'From',
        companySizeTo: 'To',
        saveToSession: 'Save to Session',
        loadFromSession: 'Load from Session',
        downloadJson: 'Download JSON',
        uploadJson: 'Upload JSON',
        shareLink: 'Share Link',
        shareLinkSuccess: 'Share link copied to clipboard!',

        // ConsideredDataTable
        rawCsvTab: 'Roh CSV',
        mappedTab: 'Alle gemappt',
        filteredTab: 'Gefiltert',
        histogramTab: 'Histogramm',
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