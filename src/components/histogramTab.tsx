import React from 'react'
import { observer } from 'mobx-react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import { uiStore } from '../stores/uiStore'
import controlStore from '../stores/controlStore'
import entryStore from '../stores/entryStore'
import translationStore from '../stores/translationStore'

const HistogramTab = observer(() => {
    const t = translationStore.t
    const selectedYearNum = parseInt(controlStore.selectedYear, 10)
    const selectedYearData = entryStore.parsedDataByYear[selectedYearNum]
    const selectedCurrency = controlStore.selectedCurrency
    const filteredData = uiStore.filteredData[selectedYearNum] ?? []
    const mappedData = selectedYearData?.resultSet ?? []

    const isLoading = mappedData.length === 0

    if (isLoading) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <p>{t.noDataAvailable || t.salaryTab}... <br/>Loading large dataset, please wait.</p>
            </div>
        )
    }

    if (filteredData.length === 0) {
        return (
            <div style={{flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <p style={{ color: '#666' }}>No data available for histogram</p>
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
        <div style={{flex: 1, minHeight: 0, overflow: 'auto'}}>
            <Plot
                data={histogramData}
                layout={histogramLayout}
                style={{width: '100%', height: '100%'}}
            />
        </div>
    )
})

export default HistogramTab
