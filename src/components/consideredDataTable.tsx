import React from 'react'
import { observer } from 'mobx-react'
import { uiStore, UiStore } from '../stores/uiStore'
import SurveyEntry from '../model/surveyEntry'

const ConsideredDataTable = observer(() => {
    const consideredData = Object.values(uiStore.filteredData).flat() as SurveyEntry[];
    if (consideredData.length === 0) {
        return <div>Loading considered data...</div>;
    }
    const sampleEntry = consideredData[0];
    const keys = Object.keys(sampleEntry);
    return (
        <div style={{padding: '20px'}}>
            <h2>Considered Data (Filtered)</h2>
            <table style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                    <tr>
                        {keys.map((key, index) => (
                            <th 
                                key={index} 
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    textAlign: 'left',
                                    backgroundColor: '#f2f2f2'
                                }}
                            >
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {consideredData.map((entry, rowIndex) => (
                        <tr key={rowIndex} style={{borderBottom: '1px solid #ddd'}}>
                            {keys.map((key, colIndex) => {
                                const value = (entry as any)[key];
                                return (
                                    <td 
                                        key={colIndex} 
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {value !== undefined && value !== null ? String(value) : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{marginTop: '10px', fontSize: '0.9em', color: '#666'}}>
                Showing {consideredData.length} considered entries
            </div>
        </div>
    );
});

export default ConsideredDataTable;