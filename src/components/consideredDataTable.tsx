import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { uiStore, UiStore } from '../stores/uiStore'
import SurveyEntry from '../model/surveyEntry'
import { FormLabel } from '@material-ui/core'

// Helper function to format values for display
const formatValueForDisplay = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    // Handle nested objects like expirienceInYears, companySize
    if (value.min !== undefined && value.max !== undefined) {
      return `${value.min}-${value.max === null ? '∞' : value.max}`;
    }
    
    // For arrays, join them
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // For other objects, try to show a meaningful representation
    if (value.hasOwnProperty('name') && typeof value.name === 'string') {
      return value.name;
    }
    
    // Fallback: show key-value pairs
    try {
      const entries = Object.entries(value);
      if (entries.length <= 2) {
        return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
      }
    } catch (e) {
      // ignore
    }
    
    return '[Object]';
  }
  
  return String(value);
};

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
        // Custom value formatter to handle complex objects
        valueFormatter: (params) => {
          const value = params.value;
          return formatValueForDisplay(value);
        }
    }));

    return (
        <div style={{padding: '20px', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2><FormLabel>Considered Data (Filtered)</FormLabel></h2>
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
                Showing {consideredData.length} considered entries
            </div>
        </div>
    );
});

export default ConsideredDataTable;