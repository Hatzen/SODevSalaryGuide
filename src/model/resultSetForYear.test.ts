import ResultSetForYear from '../model/resultSetForYear'

describe('ResultSetForYear', () => {
    it('should create with default values', () => {
        const rs = new ResultSetForYear()

        expect(rs.resultSet).toEqual([])
        expect(rs.overallEntryCount).toBe(0)
        expect(rs.invalidEntryCount).toBe(0)
        expect(rs.year).toBe(-1)
        expect(rs.chunksAvailable).toBe(-1)
        expect(rs.chunksParsed).toBe(-1)
    })

    it('should have properties that can be updated', () => {
        const rs = new ResultSetForYear()
        rs.year = 2025
        rs.chunksParsed = 1
        expect(rs.chunksParsed).toBe(1)

        rs.chunksParsed = 2
        expect(rs.chunksParsed).toBe(2)
    })
})