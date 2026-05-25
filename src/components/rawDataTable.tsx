import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import entryStore from '../stores/entryStore'
import SurveyEntry from '../model/surveyEntry'

const RawDataTable = observer(() => {
    const rawData = entryStore.parsedData.resultSet as SurveyEntry[];
    if (rawData.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#007bff" />
                <p>Loading raw data...</p>
            </div>
        );
    }

    // Add an id field for each row as required by MUI DataGrid
    const rowsWithId = rawData.map((entry, index) => ({
        ...entry,
        id: index.toString()
    }));

    // Create column definitions from the first entry
    const firstEntry = rawData[0];
    const columns: GridColDef[] = Object.keys(firstEntry).map(key => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 100,
    }));

    return (
        <div style={{padding: '20px', height: '100%'}}>
            <h2>Raw Data from CSV</h2>
            <div style={{height: 'calc(100% - 48px)', width: '100%'}}>
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
                Showing {rawData.length} raw entries
            </div>
        </div>
    );
});

export default RawDataTable;