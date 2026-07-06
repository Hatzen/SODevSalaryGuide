import React from 'react'
import { observer } from 'mobx-react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Loader from 'react-loader-spinner'
import { idbRawStore } from '../services/idbRawStore'
import CsvRow from '../model/csvRow'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import translationStore from '../stores/translationStore'

interface RawCsvDataGridProps {
    year: number
}

interface RawCsvDataGridState {
    page: number
    pageCount: number
    rows: CsvRow[]
    columnNames: string[]
    loading: boolean
    total: number
}

class RawCsvDataGrid extends React.Component<RawCsvDataGridProps, RawCsvDataGridState> {
    constructor(props: RawCsvDataGridProps) {
        super(props)
        this.state = {
            page: 0,
            pageCount: 0,
            rows: [],
            columnNames: [],
            loading: true,
            total: 0
        }
    }

    componentDidMount(): void {
        this.loadPage(0)
    }

    componentDidUpdate(prevProps: RawCsvDataGridProps): void {
        if (prevProps.year !== this.props.year) {
            this.loadPage(0)
        }
    }

    private async loadPage(page: number): Promise<void> {
        this.setState({ loading: true, page })
        try {
            const [rows, pageCount, columnNames] = await Promise.all([
                idbRawStore.getPage(this.props.year, page),
                idbRawStore.getPageCount(this.props.year),
                idbRawStore.getColumnNames(this.props.year)
            ])
            this.setState({
                rows,
                pageCount,
                columnNames,
                total: pageCount * 5000,
                loading: false
            })
        } catch (e) {
            console.error('Failed to load raw CSV page from IndexedDB', e)
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

        if (this.state.rows.length === 0 && this.state.pageCount === 0) {
            return <p style={{ padding: '20px' }}>{t.noDataAvailable || 'No raw CSV data available'}</p>
        }

        const rowsWithId = this.state.rows.map((entry, index) => ({
            ...entry,
            id: `raw-${this.state.page}-${index}`
        }))
        const columns: GridColDef[] = (this.state.columnNames.length > 0
            ? this.state.columnNames
            : Object.keys(this.state.rows[0] ?? {})
        ).map(key => ({
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
                    pageSizeOptions={[10, 25, 50, 100]}
                    paginationModel={{ page: 0, pageSize: 10 }}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                    <span>
                        {t.rawCsvTab}: {this.state.total} {t.entries} · {t.page} {this.state.page + 1}/{Math.max(1, this.state.pageCount)}
                    </span>
                    <span>
                        <Button
                            size="small"
                            disabled={this.state.page <= 0}
                            onClick={() => this.loadPage(this.state.page - 1)}
                        >
                            {'<'}
                        </Button>
                        <Button
                            size="small"
                            disabled={this.state.page + 1 >= this.state.pageCount}
                            onClick={() => this.loadPage(this.state.page + 1)}
                        >
                            {'>'}
                        </Button>
                    </span>
                </Box>
            </div>
        )
    }
}

export default observer(RawCsvDataGrid)
