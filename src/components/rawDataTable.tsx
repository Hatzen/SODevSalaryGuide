import React from 'react'
import { observer } from 'mobx-react'
import { FormLabel } from '@mui/material'
import entryStore from '../stores/entryStore'
import RawCsvDataGrid from './rawCsvDataGrid'

const RawDataTable = observer(() => {
    const selectedYearNum = parseInt(entryStore.selectedYear, 10)

    return (
        <div style={{padding: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2><FormLabel>Raw CSV Data (Exact from File)</FormLabel></h2>
            <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
                <RawCsvDataGrid year={selectedYearNum} />
            </div>
        </div>
    )
})

export default RawDataTable
