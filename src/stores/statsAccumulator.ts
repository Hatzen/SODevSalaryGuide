export interface BoxStats {
    count: number
    median: number
    mean: number
    std: number
    q1: number
    q3: number
    lowerFence: number
    upperFence: number
}

const BIN_MIN = 0
const BIN_MAX = 400000
const BIN_WIDTH = 1000
const BIN_COUNT = Math.ceil((BIN_MAX - BIN_MIN) / BIN_WIDTH)

/**
 * Memory-bounded running statistics over a stream of salaries.
 * Only a fixed-size histogram (BIN_COUNT numbers) plus a few scalars are kept,
 * so the full distribution never has to reside in RAM. Quantiles are estimated
 * from the cumulative histogram.
 */
export class StatsAccumulator {
    private counts: number[] = new Array(BIN_COUNT).fill(0)
    private n = 0
    private mean = 0
    private m2 = 0
    private min = Infinity

    reset(): void {
        this.counts.fill(0)
        this.n = 0
        this.mean = 0
        this.m2 = 0
        this.min = Infinity
    }

    add(value: number): void {
        if (!isFinite(value) || value <= 0) return
        const bin = Math.min(BIN_COUNT - 1, Math.max(0, Math.floor((value - BIN_MIN) / BIN_WIDTH)))
        this.counts[bin]++
        this.n++
        if (value < this.min) {
            this.min = value
        }
        const delta = value - this.mean
        this.mean += delta / this.n
        this.m2 += delta * (value - this.mean)
    }

    get count(): number {
        return this.n
    }

    private quantile(q: number): number {
        if (this.n === 0) return 0
        const target = q * this.n
        let cumulative = 0
        for (let i = 0; i < BIN_COUNT; i++) {
            const c = this.counts[i]
            if (c === 0) continue
            if (cumulative + c >= target) {
                const binStart = BIN_MIN + i * BIN_WIDTH
                const binEnd = binStart + BIN_WIDTH
                const positionInBin = (target - cumulative) / c
                return binStart + positionInBin * (binEnd - binStart)
            }
            cumulative += c
        }
        return BIN_MAX
    }

    toBoxStats(): BoxStats {
        const median = this.quantile(0.5)
        const q1 = this.quantile(0.25)
        const q3 = this.quantile(0.75)
        const iqr = q3 - q1
        const std = this.n > 0 ? Math.sqrt(this.m2 / this.n) : 0
        const lowerFence = q1 - 1.5 * iqr
        return {
            count: this.n,
            median,
            mean: this.mean,
            std,
            q1,
            q3,
            lowerFence: lowerFence < 0 ? this.min : lowerFence,
            upperFence: q3 + 1.5 * iqr
        }
    }
}
