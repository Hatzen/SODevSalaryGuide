import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { uiStore } from '../stores/uiStore'
import controlStore from '../stores/controlStore'
import entryStore from '../stores/entryStore'
import { FormLabel } from '@material-ui/core'
import { Tabs, Tab } from '@mui/material'
import translationStore from '../stores/translationStore'

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

const ConsideredDataTable = observer(() => {
    const [tabIndex, setTabIndex] = React.useState(0)
    const selectedYearNum = parseInt(controlStore.selectedYear, 10)
    const selectedYearData = entryStore.parsedDataByYear[selectedYearNum]
    const selectedCurrency = controlStore.selectedCurrency
    const t = translationStore.t

    const rawCsvRows = selectedYearData?.rawCsvRows ?? []
    const mappedData = selectedYearData?.resultSet ?? []
    const filteredData = uiStore.filteredData[selectedYearNum] ?? []

    const isLoading = mappedData.length === 0

    const changeTab = (_event: React.ChangeEvent<unknown>, newValue: number): void => {
        setTabIndex(newValue)
    }

    if (isLoading) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#F48024" />
                <p>{t.noDataAvailable || 'Loading...'}...</p>
            </div>
        )
    }

    const renderRawCsvTable = (): JSX.Element => {
        if (rawCsvRows.length === 0) {
            return <p style={{padding: '20px'}}>{t.noDataAvailable || 'No raw CSV data available'}</p>
        }
        const rowsWithId = rawCsvRows.map((entry, index) => ({
            ...entry,
            id: `raw-${index}`
        }))
        const firstEntry = rawCsvRows[0]
        const columns: GridColDef[] = Object.keys(firstEntry).map(key => ({
            field: key,
            headerName: key,
            flex: 1,
            minWidth: 100,
            resizable: true,
        }))
        return (
            <div style={{flex: 1, minHeight: 0}}>
                <DataGrid
                    rows={rowsWithId}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50, 100]}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        )
    }

    const renderMappedTable = (): JSX.Element => {
        const rowsWithId = mappedData.map((entry, index) => {
            const rawSalary = entry._salary
            const entryCurrencyRatio = entryStore.currencyValues?.getRatioByCode(entry.currency) ?? 1
            const usdSalary = rawSalary / entryCurrencyRatio
            const targetCurrencyRatio = entryStore.currencyValues?.getRatioByCode(selectedCurrency) ?? 1
            return {
                ...entry,
                id: `mapped-${index}`,
                convertedSalary: usdSalary * targetCurrencyRatio,
                salary: rawSalary
            }
        })

        const columns: GridColDef[] = [
            { field: 'salary', headerName: t.salaryRaw, flex: 1, minWidth: 100, resizable: true },
            {
                field: 'convertedSalary',
                headerName: `${t.salaryConverted} (${selectedCurrency})`,
                flex: 1,
                minWidth: 120,
                resizable: true,
                valueFormatter: (params) => {
                    const value = params.value as number
                    return value ? Math.round(value).toLocaleString() : ''
                }
            },
            { field: 'gender', headerName: t.genderLabel, flex: 1, minWidth: 80, resizable: true },
            { field: 'country', headerName: t.countriesLabel, flex: 1, minWidth: 100, resizable: true },
            { field: 'highestDegree', headerName: t.degreeLabel, flex: 1, minWidth: 120, resizable: true },
            {
                field: 'expirienceInYears',
                headerName: t.experienceLabel,
                flex: 1,
                minWidth: 120,
                resizable: true,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'abilities',
                headerName: t.abilitiesLabel,
                flex: 1,
                minWidth: 200,
                resizable: true,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'companySize',
                headerName: t.companySizeLabel,
                flex: 1,
                minWidth: 120,
                resizable: true,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            }
        ]

        return (
            <div style={{flex: 1, minHeight: 0}}>
                <DataGrid
                    rows={rowsWithId}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50, 100]}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
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

        const columns: GridColDef[] = [
            { field: 'salary', headerName: t.salaryRaw, flex: 1, minWidth: 100, resizable: true },
            {
                field: 'convertedSalary',
                headerName: `${t.salaryConverted} (${selectedCurrency})`,
                flex: 1,
                minWidth: 120,
                resizable: true,
                valueFormatter: (params) => {
                    const value = params.value as number
                    return value ? Math.round(value).toLocaleString() : ''
                }
            },
            { field: 'gender', headerName: t.genderLabel, flex: 1, minWidth: 80, resizable: true },
            { field: 'country', headerName: t.countriesLabel, flex: 1, minWidth: 100, resizable: true },
            { field: 'highestDegree', headerName: t.degreeLabel, flex: 1, minWidth: 120, resizable: true },
            {
                field: 'expirienceInYears',
                headerName: t.experienceLabel,
                flex: 1,
                minWidth: 120,
                resizable: true,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'abilities',
                headerName: t.abilitiesLabel,
                flex: 1,
                minWidth: 200,
                resizable: true,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'companySize',
                headerName: t.companySizeLabel,
                flex: 1,
                minWidth: 120,
                resizable: true,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            }
        ]

        return (
            <div style={{flex: 1, minHeight: 0}}>
                <DataGrid
                    rows={rowsWithId}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50, 100]}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        )
    }

    return (
        <div style={{padding: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2><FormLabel>{t.dataTables}</FormLabel></h2>
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
                <Tab label={`${t.rawCsvTab} (${rawCsvRows.length})`} />
                <Tab label={`${t.mappedTab} (${mappedData.length})`} />
                <Tab label={`${t.filteredTab} (${filteredData.length})`} />
            </Tabs>
            {tabIndex === 0 && renderRawCsvTable()}
            {tabIndex === 1 && renderMappedTable()}
            {tabIndex === 2 && renderFilteredTable()}
        </div>
    )
})

export default ConsideredDataTable