import CsvRow from '../model/csvRow'

export const RAW_PAGE_SIZE = 5000

const DB_NAME = 'so-salary-guide'
const DB_VERSION = 1
const STORE = 'rawRows'

export interface RawPage {
    year: number
    page: number
    rows: CsvRow[]
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, { keyPath: ['year', 'page'] })
            }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

/**
 * Persists the exact raw CSV rows in IndexedDB, paginated in chunks of RAW_PAGE_SIZE.
 * The full dataset is therefore never held in RAM at once; consumers load single
 * pages on demand.
 */
export class IdbRawStore {
    private dbPromise: Promise<IDBDatabase> | null = null

    private getDb(): Promise<IDBDatabase> {
        if (!this.dbPromise) {
            this.dbPromise = openDB()
        }
        return this.dbPromise
    }

    // IndexedDB structured-clone cannot store undefined / non-plain values, so
    // coerce every cell to a string (empty cells become empty strings).
    private sanitizeRows(rows: CsvRow[]): CsvRow[] {
        return rows.map(row => {
            const clean: CsvRow = {}
            for (const key of Object.keys(row)) {
                const value = row[key]
                clean[key] = value == null ? '' : String(value)
            }
            return clean
        })
    }

    async savePage(year: number, page: number, rows: CsvRow[]): Promise<void> {
        const sanitized = this.sanitizeRows(rows)
        const db = await this.getDb()
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite')
            tx.objectStore(STORE).put({ year, page, rows: sanitized } as RawPage)
            tx.oncomplete = () => resolve()
            tx.onerror = () => reject(tx.error)
        })
    }

    async getPage(year: number, page: number): Promise<CsvRow[]> {
        const db = await this.getDb()
        return new Promise<CsvRow[]>((resolve, reject) => {
            const tx = db.transaction(STORE, 'readonly')
            const req = tx.objectStore(STORE).get([year, page])
            req.onsuccess = () => resolve((req.result as RawPage | undefined)?.rows ?? [])
            req.onerror = () => reject(req.error)
        })
    }

    async getPageCount(year: number): Promise<number> {
        const db = await this.getDb()
        return new Promise<number>((resolve, reject) => {
            const tx = db.transaction(STORE, 'readonly')
            const store = tx.objectStore(STORE)
            const range = IDBKeyRange.bound([year, -Infinity], [year, Infinity])
            const req = store.getAllKeys(range)
            req.onsuccess = () => {
                const keys = (req.result as [number, number][]) ?? []
                resolve(keys.length)
            }
            req.onerror = () => reject(req.error)
        })
    }

    async getColumnNames(year: number): Promise<string[]> {
        const first = await this.getPage(year, 0)
        return first.length > 0 ? Object.keys(first[0]) : []
    }

    async clearYear(year: number): Promise<void> {
        const db = await this.getDb()
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite')
            const range = IDBKeyRange.bound([year, -Infinity], [year, Infinity])
            tx.objectStore(STORE).delete(range)
            tx.oncomplete = () => resolve()
            tx.onerror = () => reject(tx.error)
        })
    }
}

export const idbRawStore = new IdbRawStore()
