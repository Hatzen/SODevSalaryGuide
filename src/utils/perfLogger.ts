const MARK_PREFIX = 'salary-guide:'

export function mark(name: string): void {
    try {
        performance.mark(`${MARK_PREFIX}${name}`)
    } catch {
        // ignore if performance API is unavailable or mark already exists
    }
}

export function measure(name: string, startMark: string, endMark?: string): number {
    try {
        const start = `${MARK_PREFIX}${startMark}`
        const end = endMark ? `${MARK_PREFIX}${endMark}` : undefined
        const measureName = `${MARK_PREFIX}${name}`
        if (end) {
            performance.measure(measureName, { start, end })
        } else {
            performance.measure(measureName, { start })
        }
        const entries = performance.getEntriesByName(measureName)
        const last = entries[entries.length - 1]
        return last ? last.duration : 0
    } catch {
        return 0
    }
}

export function logLongTasks(thresholdMs = 50): (() => void) | null {
    if (typeof PerformanceObserver === 'undefined') {
        return null
    }
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration >= thresholdMs) {
                    console.warn(
                        `[PERF] Long task detected: ${entry.duration.toFixed(1)}ms (start: ${entry.startTime.toFixed(0)}ms)`
                    )
                }
            }
        })
        observer.observe({ type: 'longtask', buffered: true })
        return () => observer.disconnect()
    } catch {
        return null
    }
}
