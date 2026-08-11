import Papa from 'papaparse'

interface ParseRequest {
  type: 'parse'
  url: string
  id: number
}

interface ParseResponseSuccess {
  type: 'result'
  id: number
  data: any[]
  meta: any
}

interface ParseResponseError {
  type: 'error'
  id: number
  error: string
}

type ParseResponse = ParseResponseSuccess | ParseResponseError

self.onmessage = async (e: MessageEvent<ParseRequest>) => {
    const { url, id } = e.data

    try {
        const results = await new Promise<any>((resolve, reject) => {
            Papa.parse(url, {
                download: true,
                header: true,
                worker: false,
                transformHeader: function(header: string, index: number): string {
                    const UNNAMED_COLUMN_PREFIX = 'columnIndex-'
                    if (header == null || header === '') {
                        return UNNAMED_COLUMN_PREFIX + index
                    }
                    return header
                },
                complete: (results) => resolve(results),
                error: (err: any) => reject(err)
            })
        })

        const response: ParseResponse = {
            type: 'result',
            id,
            data: results.data,
            meta: results.meta
        }

        self.postMessage(response)
    } catch (err) {
        const response: ParseResponse = {
            type: 'error',
            id,
            error: err instanceof Error ? err.message : String(err)
        }
        self.postMessage(response)
    }
}
