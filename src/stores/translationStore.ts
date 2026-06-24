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
        dataTables: 'Data Tables',
        rawCsvTab: 'Raw CSV',
        mappedTab: 'Mapped All',
        filteredTab: 'Filtered',
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

        // Modal
        disclaimer: 'Disclaimer',
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

        // Modal
        disclaimer: 'Hinweis',
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