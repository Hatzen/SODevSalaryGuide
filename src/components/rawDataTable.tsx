import React from 'react'
import { observer } from 'mobx-react'
import entryStore from '../stores/entryStore'
import SurveyEntry from '../model/surveyEntry'

const RawDataTable = observer(() => {
    const rawData = entryStore.parsedData.resultSet as SurveyEntry[];
    if (rawData.length === 0) {
        return <div>Loading raw data...</div>;
    }
    const keys = Object.keys(rawData[0]);
    return (
        <div style={{padding: '20px'}}>
            <h2>Raw Data from CSV</h2>
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
                    {rawData.map((entry, rowIndex) => (
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
                Showing {rawData.length} raw entries
            </div>
        </div>
    );
});

export default RawDataTable;