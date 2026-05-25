import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { uiStore, UiStore } from '../stores/uiStore'
import SurveyEntry from '../model/surveyEntry'

const ConsideredDataTable = observer(() => {
    const consideredData = Object.values(uiStore.filteredData).flat() as SurveyEntry[];
    if (consideredData.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Loader type="ThreeDots" height={80} width={80} color="#007bff" />
                <p>Loading considered data...</p>
            </div>
        );
    }

    // Add an id field for each row as required by MUI DataGrid
    const rowsWithId = consideredData.map((entry, index) => ({
        ...entry,
        id: index.toString()
    }));

    // Create column definitions from the first entry
    const firstEntry = consideredData[0];
    const columns: GridColDef[] = Object.keys(firstEntry).map(key => ({
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 100,
    }));

    return (
        <div style={{padding: '20px', height: '100%'}}>
            <h2>Considered Data (Filtered)</h2>
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
                Showing {consideredData.length} considered entries
            </div>
        </div>
    );
});

export default ConsideredDataTable;