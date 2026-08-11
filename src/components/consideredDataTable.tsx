import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { uiStore } from '../stores/uiStore'
import controlStore from '../stores/controlStore'
import entryStore from '../stores/entryStore'
import { Tabs, Tab, Typography } from '@mui/material'
import translationStore from '../stores/translationStore'
import RawCsvDataGrid from './rawCsvDataGrid'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

const formatValueForDisplay = (value: unknown): string => {
    if (value === null || value === undefined) {
        return ''
    }

    if (typeof value === 'object') {
        if (value instanceof Date) {
            return value.toLocaleDateString()
        }

        if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
            const obj = value as { min: number; max: number | null }
            return `${obj.min}-${obj.max === null ? '\u221e' : obj.max}`
        }

        if (Array.isArray(value)) {
            return value.join(', ')
        }

        if (typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, 'name') && typeof (value as { name?: unknown }).name === 'string') {
            return (value as { name: string }).name
        }

        try {
            const entries = Object.entries(value as object)
            if (entries.length <= 2) {
                return entries.map(([k, v]) => `${k}: ${v}`).join(', ')
            }
        } catch (e) {
            // ignore
        }

        return '[Object]'
    }

    return String(value)
}

const formatGenderValue = (value: unknown, t: typeof translationStore.t): string => {
    const genderTranslations: Record<string, string> = {
        MALE: t.genderMale,
        FEMALE: t.genderFemale,
        OTHER: t.genderOther
    }
    return genderTranslations[value as string] || String(value)
}

const ConsideredDataTable = observer(() => {
    const [tabIndex, setTabIndex] = React.useState(0)
    const plotRef = React.useRef<HTMLDivElement>(null)
    const selectedYearNum = parseInt(controlStore.selectedYear, 10)
    const selectedYearData = entryStore.parsedDataByYear[selectedYearNum]
    const selectedCurrency = controlStore.selectedCurrency
    const t = translationStore.t

    const mappedData = selectedYearData?.resultSet ?? []
    const filteredData = uiStore.filteredData[selectedYearNum] ?? []

    const isLoading = mappedData.length === 0

    const changeTab = (_event: React.ChangeEvent<unknown>, newValue: number): void => {
        setTabIndex(newValue)
    }

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (plotRef.current) {
                const plotlyEl = plotRef.current.querySelector('.js-plotly-plot') as HTMLElement & { Plotly?: { relayout: (el: HTMLElement, layout: Partial<Layout>) => void } }
                if (plotlyEl && plotlyEl.Plotly) {
                    plotlyEl.Plotly.relayout(plotlyEl, { autosize: true })
                }
            }
        }, 0)
        return () => clearTimeout(timer)
    }, [tabIndex])

    if (isLoading) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#F48024" />
                <p>{t.noDataAvailable || t.salaryTab}... <br/>Loading large dataset, please wait.</p>
            </div>
        )
    }

    const renderRawCsvTable = (): JSX.Element => {
        return (
            <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
                <RawCsvDataGrid year={selectedYearNum} />
            </div>
        )
    }

    const buildColumns = (): GridColDef[] => [
        { field: 'salary', headerName: t.salaryRaw, flex: 1, minWidth: 100 },
        {
            field: 'convertedSalary',
            headerName: `${t.salaryConverted} (${selectedCurrency})`,
            flex: 1,
            minWidth: 120,
            valueFormatter: (value: number) => {
                return value ? Math.round(value).toLocaleString() : ''
            }
        },
        { field: 'currency', headerName: t.currencyLabel, flex: 1, minWidth: 80 },
        { field: 'gender', headerName: t.genderLabel, flex: 1, minWidth: 80, valueFormatter: (value) => formatGenderValue(value, t) },
        { field: 'country', headerName: t.countriesLabel, flex: 1, minWidth: 100 },
        { field: 'highestDegree', headerName: t.degreeLabel, flex: 1, minWidth: 120 },
        {
            field: 'expirienceInYears',
            headerName: t.experienceLabel,
            flex: 1,
            minWidth: 120,
            valueFormatter: (value) => formatValueForDisplay(value)
        },
        {
            field: 'abilities',
            headerName: t.abilitiesLabel,
            flex: 1,
            minWidth: 200,
            valueFormatter: (value) => formatValueForDisplay(value)
        },
        {
            field: 'companySize',
            headerName: t.companySizeLabel,
            flex: 1,
            minWidth: 120,
            valueFormatter: (value) => formatValueForDisplay(value)
        }
    ]

    const renderMappedTable = (): JSX.Element => {
        const rowsWithId = mappedData.map((entry, index) => {
            const rawSalary = entry._salary
            const entryCurrencyRatio = entryStore.currencyValues?.getRatioByCode(entry.currency) ?? 1
            const usdSalary = entry.salaryIsUsd ? rawSalary : rawSalary / entryCurrencyRatio
            const targetCurrencyRatio = entryStore.currencyValues?.getRatioByCode(selectedCurrency) ?? 1
            return {
                ...entry,
                id: `mapped-${index}`,
                convertedSalary: usdSalary * targetCurrencyRatio,
                salary: rawSalary
            }
        })

        return (
            <div style={{flex: 1, minHeight: 0}}>
                <DataGrid
                    rows={rowsWithId}
                    columns={buildColumns()}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    style={{ height: '100%' }}
                />
            </div>
        )
    }

    const renderFilteredTable = (): JSX.Element => {
        const rowsWithId = filteredData.map((entry, index) => {
            const rawSalary = entry._salary
            const entryCurrencyRatio = entryStore.currencyValues?.getRatioByCode(entry.currency) ?? 1
            const usdSalary = rawSalary / entryCurrencyRatio
            const targetCurrencyRatio = entryStore.currencyValues?.getRatioByCode(selectedCurrency) ?? 1
            return {
                ...entry,
                id: `filtered-${index}`,
                convertedSalary: usdSalary * targetCurrencyRatio,
                salary: rawSalary
            }
        })

        return (
            <div style={{flex: 1, minHeight: 0}}>
                <DataGrid
                    rows={rowsWithId}
                    columns={buildColumns()}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    style={{ height: '100%' }}
                />
            </div>
        )
    }

    const renderHistogram = (): JSX.Element => {
        if (filteredData.length === 0) {
            return (
                <div style={{flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="body2" style={{ color: '#666' }}>No data available for histogram</Typography>
                </div>
            )
        }

        const currencyValues = entryStore.currencyValues
        const salaries = filteredData.map(entry => {
            const rawSalary = entry._salary
            const entryCurrencyRatio = currencyValues?.getRatioByCode(entry.currency) ?? 1
            const usdSalary = entry.salaryIsUsd ? rawSalary : rawSalary / entryCurrencyRatio
            const targetCurrencyRatio = currencyValues?.getRatioByCode(selectedCurrency) ?? 1
            return usdSalary * targetCurrencyRatio
        })

        const binSize = 10000
        const maxSalary = Math.max(...salaries)
        const maxBin = Math.max(Math.ceil(maxSalary / binSize) * binSize, binSize * 2)
        const numBins = maxBin / binSize

        const bins: number[] = new Array(numBins).fill(0)
        salaries.forEach(salary => {
            const binIndex = Math.min(Math.floor(salary / binSize), bins.length - 1)
            if (binIndex >= 0 && binIndex < bins.length) {
                bins[binIndex]++
            }
        })

        const xLabels = bins.map((_, i) => {
            const from = i * binSize
            const to = (i + 1) * binSize
            return `${(from / 1000)}k - ${(to / 1000)}k`
        })

        const histogramData: Data[] = [{
            x: xLabels,
            y: bins,
            type: 'bar',
            marker: { color: '#F48024' }
        }]

        const histogramLayout: Partial<Layout> = {
            title: { text: 'Salary Distribution' },
            xaxis: {
                title: { text: `Salary (${selectedCurrency})` },
                tickangle: -45
            },
            yaxis: {
                title: { text: 'Number of Salaries' }
            },
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000',
            margin: {
                l: 60,
                r: 30,
                t: 60,
                b: 120
            }
        }

        return (
            <div ref={plotRef} style={{flex: 1, minHeight: 0, overflow: 'auto'}}>
                <Plot
                    data={histogramData}
                    layout={histogramLayout}
                    style={{width: '100%', height: '100%'}}
                />
            </div>
        )
    }

    return (
        <div style={{padding: '20px', display: 'flex', flexDirection: 'column'}}>
            <Tabs
                value={tabIndex}
                onChange={changeTab}
                style={{marginBottom: '10px'}}
                sx={{
                    '& .MuiTabs-indicator': { backgroundColor: '#F48024' },
                    '& .MuiTab-root': {
                        color: '#F48024',
                        '&.Mui-selected': { color: '#F48024', fontWeight: 500 }
                    }
                }}
            >
                <Tab label={`${t.filteredTab} (${filteredData.length})`} />
                <Tab label={`${t.mappedTab} (${mappedData.length})`} />
                <Tab label={t.rawCsvTab} />
                <Tab label={t.histogramTab} />
            </Tabs>
            {tabIndex === 0 && renderFilteredTable()}
            {tabIndex === 1 && renderMappedTable()}
            {tabIndex === 2 && renderRawCsvTable()}
            {tabIndex === 3 && renderHistogram()}
        </div>
    )
})

export default ConsideredDataTable
