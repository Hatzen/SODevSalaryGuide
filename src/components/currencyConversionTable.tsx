import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import entryStore from '../stores/entryStore'
import CurrencyValues from '../model/currencyValues'
import { FormLabel, Typography } from '@material-ui/core'
import controlStore from '../stores/controlStore'
import translationStore from '../stores/translationStore'

const CurrencyConversionTable = observer(() => {
    const currencyValues = entryStore.currencyValues as CurrencyValues | undefined
    const selectedCurrency = controlStore.selectedCurrency
    const t = translationStore.t

    if (!currencyValues) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#F48024" />
                <p>{t.currencyRates}...</p>
            </div>
        )
    }

    const sourceInfo = currencyValues.isFallback
        ? `${t.usingDefaults}`
        : (currencyValues.query?.base_currency === 'USD' && Object.keys(currencyValues.data || {}).length > 0
            ? `${t.sourceApi} (base: ${currencyValues.query?.base_currency}, fetched: ${new Date(currencyValues.query?.timestamp * 1000).toLocaleDateString()})`
            : t.usingDefaults)

    const baseRatio = currencyValues.getRatioByCode(selectedCurrency)

    const currencies = Object.entries(currencyValues.data || {}) as [string, number][]

    const rows = currencies.map(([currency, rate], index) => {
        const rateToSelected = rate / baseRatio
        return {
            id: index.toString(),
            currency,
            rateToUSD: rate,
            rateFromUSD: rate > 0 ? (1 / rate) : 0,
            rateToSelected: rateToSelected,
            rateFromSelected: rate > 0 && baseRatio > 0 ? (baseRatio / rate) : 0
        }
    })

    const columns: GridColDef[] = [
        { field: 'currency', headerName: t.currencyLabel, flex: 1, minWidth: 100, resizable: true },
        {
            field: 'rateToUSD',
            headerName: t.rateToUSD,
            flex: 1,
            minWidth: 150,
            resizable: true,
            valueFormatter: (params) => {
                const value = params.value as number
                return value ? value.toFixed(4) : 'N/A'
            }
        },
        {
            field: 'rateFromUSD',
            headerName: t.rateFromUSD,
            flex: 1,
            minWidth: 180,
            resizable: true,
            valueFormatter: (params) => {
                const value = params.value as number
                return value ? value.toFixed(6) : 'N/A'
            }
        },
        {
            field: 'rateToSelected',
            headerName: `1 ${selectedCurrency} = X`,
            flex: 1,
            minWidth: 150,
            resizable: true,
            valueFormatter: (params) => {
                const value = params.value as number
                return value ? value.toFixed(4) : 'N/A'
            }
        },
        {
            field: 'rateFromSelected',
            headerName: `1 X = ${selectedCurrency}`,
            flex: 1,
            minWidth: 180,
            resizable: true,
            valueFormatter: (params) => {
                const value = params.value as number
                return value ? value.toFixed(6) : 'N/A'
            }
        }
    ]

    return (
        <div style={{padding: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2><FormLabel>{t.currencyRates}</FormLabel></h2>
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
                {translationStore.translate('showingRates', { count: rows.length.toString() })}
            </div>
        </div>
    )
})

export default CurrencyConversionTable