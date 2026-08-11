const PREFIX = '[ReactPerf]'

const renderCounts = new Map<string, number>()
const renderDurations = new Map<string, number[]>()

export function getRenderCount(displayName: string): number {
    return renderCounts.get(displayName) || 0
}

export function getRenderStats(displayName: string): { count: number; avgMs: number; maxMs: number } {
    const count = renderCounts.get(displayName) || 0
    const durations = renderDurations.get(displayName) || []
    const avgMs = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
    const maxMs = durations.length > 0 ? Math.max(...durations) : 0
    return { count, avgMs, maxMs }
}

export function resetRenderStats(): void {
    renderCounts.clear()
    renderDurations.clear()
}

export function trackRender(displayName: string): (id: string, phase: 'mount' | 'update' | 'nested-update', actualDuration: number) => void {
    return (_id: string, _phase: string, actualDuration: number) => {
        renderCounts.set(displayName, (renderCounts.get(displayName) || 0) + 1)
        const durations = renderDurations.get(displayName) || []
        durations.push(actualDuration)
        renderDurations.set(displayName, durations)
    }
}

export function startFPSMonitor(intervalMs = 1000): (() => void) | null {
    if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') {
        return null
    }

    let frameCount = 0
    let lastTime = performance.now()
    let rafId: number

    const tick = (time: number): void => {
        frameCount++
        const elapsed = time - lastTime
        if (elapsed >= intervalMs) {
            const fps = (frameCount * 1000) / elapsed
            const minFps = Math.min(fps, 60)
            if (minFps < 30) {
                console.warn(`${PREFIX} Low FPS: ${minFps.toFixed(1)} (avg ${fps.toFixed(1)})`)
            }
            frameCount = 0
            lastTime = time
        }
        rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
}

export function logAllRenderStats(): void {
    console.group(`${PREFIX} Render Statistics`)
    for (const name of renderCounts.keys()) {
        const stats = getRenderStats(name)
        console.log(`${name}: renders=${stats.count}, avg=${stats.avgMs.toFixed(1)}ms, max=${stats.maxMs.toFixed(1)}ms`)
    }
    console.groupEnd()
}
