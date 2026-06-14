import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import entryStore from '../stores/entryStore'
import controlStore from '../stores/controlStore'
import { FormLabel } from '@material-ui/core'

const RawDataTable = observer(() => {
    const selectedYearNum = parseInt(controlStore.selectedYear, 10)
    const selectedYearData = entryStore.parsedDataByYear[selectedYearNum]
    const rawData = selectedYearData?.rawCsvRows ?? []
    
    if (rawData.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#007bff" />
                <p>Loading raw CSV data...</p>
            </div>
        )
    }

    const rowsWithId = rawData.map((entry, index) => ({
        ...entry,
        id: index.toString()
    }))

    const firstEntry = rawData[0]
    const columns: GridColDef[] = Object.keys(firstEntry).map(key => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 100,
    }))

    return (
        <div style={{padding: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2><FormLabel>Raw CSV Data (Exact from File)</FormLabel></h2>
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
            <div style={{marginTop: '10px', fontSize: '0.9em', color: '#666'}}>
                Showing {rawData.length} raw entries (exact CSV values)
            </div>
        </div>
    )
})

export default RawDataTable