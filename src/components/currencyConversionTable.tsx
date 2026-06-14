import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import entryStore from '../stores/entryStore'
import CurrencyValues from '../model/currencyValues'
import { FormLabel, Typography } from '@material-ui/core'

const CurrencyConversionTable = observer(() => {
    const currencyValues = entryStore.currencyValues as CurrencyValues | undefined
    
    if (!currencyValues) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#F48024" />
                <p>Loading currency conversion rates...</p>
            </div>
        )
    }

    const sourceInfo = currencyValues.query?.base_currency === 'USD' && Object.keys(currencyValues.data || {}).length > 0
        ? `Source: FreeCurrencyAPI (base: ${currencyValues.query?.base_currency}, fetched: ${new Date(currencyValues.query?.timestamp * 1000).toLocaleDateString()})`
        : 'Using default values (API unavailable)'

    const currencies = Object.entries(currencyValues.data || {}) as [string, number][]
    
    const rows = currencies.map(([currency, rate], index) => ({
        id: index.toString(),
        currency,
        rateToUSD: rate,
        rateFromUSD: rate > 0 ? (1 / rate) : 0
    }))

    const columns: GridColDef[] = [
        { field: 'currency', headerName: 'Currency', flex: 1, minWidth: 100 },
        {
            field: 'rateToUSD',
            headerName: 'Rate (1 USD = X)',
            flex: 1,
            minWidth: 150,
            valueFormatter: (params) => {
                const value = params.value as number
                return value ? value.toFixed(4) : 'N/A'
            }
        },
        {
            field: 'rateFromUSD',
            headerName: 'Inverse Rate (1 X = USD)',
            flex: 1,
            minWidth: 180,
            valueFormatter: (params) => {
                const value = params.value as number
                return value ? value.toFixed(6) : 'N/A'
            }
        }
    ]

    return (
        <div style={{padding: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2><FormLabel>Currency Conversion Rates</FormLabel></h2>
            <Typography variant="body2" style={{ marginBottom: '10px', color: '#666', fontSize: '0.85em' }}>
                {sourceInfo}
            </Typography>
            <div style={{flex: 1, minHeight: 0}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50, 100]}
                    pageSize={20}
                    disableSelectionOnClick
                />
            </div>
            <div style={{marginTop: '10px', fontSize: '0.9em', color: '#666'}}>
                Showing {rows.length} currency conversion rates
            </div>
        </div>
    )
})

export default CurrencyConversionTable