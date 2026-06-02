import ControlState from '../model/controlState'

describe('ControlStore', () => {
    const controlStore = require('../stores/controlStore').default

    beforeEach(() => {
        controlStore.pendingState = null
        controlStore.setSelectedYear('2025')
        controlStore.setAbilities([])
        controlStore.setCountries([])
        controlStore.setDegrees([])
        controlStore.genders = []
        controlStore.expirienceInYears = [4, 20]
        controlStore.companySize = [null, null]
    })

    describe('getSessionState and loadFromSessionState', () => {
        it('should save and load session state correctly', () => {
            const state = {
                selectedYear: '2020',
                abilities: ['javascript', 'python'],
                countries: ['usa', 'germany'],
                degrees: ['bachelor'],
                genders: ['MALE', 'FEMALE'],
                expirienceInYears: [5, 15],
                companySize: [10, 1000],
                gendersFilterActive: true,
                abilitiesFilterActive: true,
                expirienceFilterActive: true,
                companySizeFilterActive: false,
                degreeFilterActive: true,
                countriesFilterActive: false
            }

            controlStore.loadFromSessionState(state)

            expect(controlStore.selectedYear).toBe('2020')
            expect(controlStore.abilities).toEqual(['javascript', 'python'])
            expect(controlStore.countries).toEqual(['usa', 'germany'])
            expect(controlStore.degrees).toEqual(['bachelor'])
            expect(controlStore.genders).toEqual(['MALE', 'FEMALE'])
            expect(controlStore.expirienceInYears).toEqual([5, 15])
            expect(controlStore.companySize).toEqual([10, 1000])
            expect(controlStore.gendersFilterActive).toBe(true)
            expect(controlStore.abilitiesFilterActive).toBe(true)
            expect(controlStore.expirienceFilterActive).toBe(true)
            expect(controlStore.degreeFilterActive).toBe(true)
        })

        it('should get correct session state', () => {
            controlStore.setSelectedYear('2022')
            controlStore.setAbilities(['java'])
            controlStore.setCountries(['uk'])

            const state = controlStore.getSessionState()

            expect(state.selectedYear).toBe('2022')
            expect(state.abilities).toEqual(['java'])
            expect(state.countries).toEqual(['uk'])
        })
    })

    describe('loadPendingState', () => {
        it('should load pending state and clear it', () => {
            controlStore.pendingState = {
                selectedYear: '2019',
                abilities: ['csharp'],
                countries: ['canada']
            }

            controlStore.loadPendingState()

            expect(controlStore.selectedYear).toBe('2019')
            expect(controlStore.abilities).toEqual(['csharp'])
            expect(controlStore.countries).toEqual(['canada'])
            expect(controlStore.pendingState).toBeNull()
        })
    })
})