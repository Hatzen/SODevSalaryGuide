import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { idbRawStore } from '../services/idbRawStore'
import CsvRow from '../model/csvRow'
import translationStore from '../stores/translationStore'

interface RawCsvDataGridProps {
    year: number
}

interface RawCsvDataGridState {
    rows: CsvRow[]
    columnNames: string[]
    loading: boolean
}

class RawCsvDataGrid extends React.Component<RawCsvDataGridProps, RawCsvDataGridState> {
    constructor(props: RawCsvDataGridProps) {
        super(props)
        this.state = {
            rows: [],
            columnNames: [],
            loading: true
        }
    }

    componentDidMount(): void {
        this.loadAll()
    }

    componentDidUpdate(prevProps: RawCsvDataGridProps): void {
        if (prevProps.year !== this.props.year) {
            this.loadAll()
        }
    }

    private async loadAll(): Promise<void> {
        this.setState({ loading: true })
        try {
            const pageCount = await idbRawStore.getPageCount(this.props.year)
            const pages: CsvRow[][] = await Promise.all(
                Array.from({ length: pageCount }, (_, i) => idbRawStore.getPage(this.props.year, i))
            )
            const allRows = pages.flat()
            this.setState({
                rows: allRows,
                columnNames: allRows.length > 0 ? Object.keys(allRows[0]) : [],
                loading: false
            })
        } catch (e) {
            console.error('Failed to load raw CSV from IndexedDB', e)
            this.setState({ loading: false })
        }
    }

    render(): JSX.Element {
        const t = translationStore.t

        if (this.state.loading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader type="ThreeDots" height={80} width={80} color="#F48024" />
                    <p>{t.noDataAvailable || 'Loading raw CSV data...'}</p>
                </div>
            )
        }

        if (this.state.rows.length === 0) {
            return <p style={{ padding: '20px' }}>{t.noDataAvailable || 'No raw CSV data available'}</p>
        }

        const rowsWithId = this.state.rows.map((entry, index) => ({
            ...entry,
            id: `raw-${index}`
        }))
        const columns: GridColDef[] = this.state.columnNames.map(key => ({
            field: key,
            headerName: key,
            flex: 1,
            minWidth: 100,
        }))

        return (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <DataGrid
                    rows={rowsWithId}
                    columns={columns}
                    style={{ flex: 1, minHeight: 0 }}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } }
                    }}
                    checkboxSelection
                    disableRowSelectionOnClick
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            printOptions: { disableToolbarButton: true },
                            // Keep only the search; hide export/columns toggles for raw data
                            csvOptions: { disableToolbarButton: true }
                        }
                    }}
                />
            </div>
        )
    }
}

export default observer(RawCsvDataGrid)
