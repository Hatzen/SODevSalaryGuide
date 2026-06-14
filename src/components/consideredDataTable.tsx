import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { uiStore } from '../stores/uiStore'
import controlStore from '../stores/controlStore'
import entryStore from '../stores/entryStore'
import { FormLabel, Tabs, Tab, Typography } from '@material-ui/core'

const formatValueForDisplay = (value: any): string => {
    if (value === null || value === undefined) {
        return ''
    }
   
    if (typeof value === 'object') {
        if (value instanceof Date) {
            return value.toLocaleDateString()
        }
     
        if (value.min !== undefined && value.max !== undefined) {
            return `${value.min}-${value.max === null ? '∞' : value.max}`
        }
     
        if (Array.isArray(value)) {
            return value.join(', ')
        }
     
        if (Object.prototype.hasOwnProperty.call(value, 'name') && typeof value.name === 'string') {
            return value.name
        }
     
        try {
            const entries = Object.entries(value)
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
    
    const rawCsvRows = selectedYearData?.rawCsvRows ?? []
    const mappedData = selectedYearData?.resultSet ?? []
    const filteredData = uiStore.filteredData[selectedYearNum] ?? []

    const isLoading = mappedData.length === 0

    const changeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue)
    }

    if (isLoading) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#F48024" />
                <p>Loading considered data...</p>
            </div>
        )
    }

    const renderRawCsvTable = () => {
        if (rawCsvRows.length === 0) {
            return (
                <Typography style={{padding: '20px'}}>No raw CSV data available</Typography>
            )
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

    const renderMappedTable = () => {
        const rowsWithId = mappedData.map((entry, index) => ({
            ...entry,
            id: `mapped-${index}`,
            convertedSalary: entry._salary / (entryStore.currencyValues?.getRatioByCode(entry.currency) ?? 1),
            salary: entry._salary
        }))

        const columns: GridColDef[] = [
            { field: 'salary', headerName: 'Salary (raw)', flex: 1, minWidth: 100 },
            {
                field: 'convertedSalary',
                headerName: 'Salary (converted)',
                flex: 1,
                minWidth: 120,
                valueFormatter: (params) => {
                    const value = params.value as number
                    return value ? Math.round(value).toLocaleString() : ''
                }
            },
            { field: 'gender', headerName: 'Gender', flex: 1, minWidth: 80 },
            { field: 'country', headerName: 'Country', flex: 1, minWidth: 100 },
            { field: 'highestDegree', headerName: 'Highest Degree', flex: 1, minWidth: 120 },
            {
                field: 'expirienceInYears',
                headerName: 'Experience',
                flex: 1,
                minWidth: 120,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'abilities',
                headerName: 'Abilities',
                flex: 1,
                minWidth: 200,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'companySize',
                headerName: 'Company Size',
                flex: 1,
                minWidth: 120,
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

    const renderFilteredTable = () => {
        const rowsWithId = filteredData.map((entry, index) => ({
            ...entry,
            id: `filtered-${index}`,
            convertedSalary: entry._salary / (entryStore.currencyValues?.getRatioByCode(entry.currency) ?? 1),
            salary: entry._salary
        }))

        const columns: GridColDef[] = [
            { field: 'salary', headerName: 'Salary (raw)', flex: 1, minWidth: 100 },
            {
                field: 'convertedSalary',
                headerName: 'Salary (converted)',
                flex: 1,
                minWidth: 120,
                valueFormatter: (params) => {
                    const value = params.value as number
                    return value ? Math.round(value).toLocaleString() : ''
                }
            },
            { field: 'gender', headerName: 'Gender', flex: 1, minWidth: 80 },
            { field: 'country', headerName: 'Country', flex: 1, minWidth: 100 },
            { field: 'highestDegree', headerName: 'Highest Degree', flex: 1, minWidth: 120 },
            {
                field: 'expirienceInYears',
                headerName: 'Experience',
                flex: 1,
                minWidth: 120,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'abilities',
                headerName: 'Abilities',
                flex: 1,
                minWidth: 200,
                valueFormatter: (params) => formatValueForDisplay(params.value)
            },
            {
                field: 'companySize',
                headerName: 'Company Size',
                flex: 1,
                minWidth: 120,
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
            <h2><FormLabel>Data Tables</FormLabel></h2>
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
                <Tab label={`Raw CSV (${rawCsvRows.length})`} />
                <Tab label={`Mapped All (${mappedData.length})`} />
                <Tab label={`Filtered (${filteredData.length})`} />
            </Tabs>
            {tabIndex === 0 && renderRawCsvTable()}
            {tabIndex === 1 && renderMappedTable()}
            {tabIndex === 2 && renderFilteredTable()}
        </div>
    )
})

export default ConsideredDataTable