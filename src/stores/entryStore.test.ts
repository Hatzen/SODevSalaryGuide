import ResultSetForYear from '../model/resultSetForYear'

describe('ResultSetForYear', () => {
    it('should have properties that can be updated', () => {
        const rs = new ResultSetForYear()
        rs.year = 2025
        rs.chunksParsed = 1
        expect(rs.chunksParsed).toBe(1)
        
        rs.chunksParsed = 2
        expect(rs.chunksParsed).toBe(2)
    })
})