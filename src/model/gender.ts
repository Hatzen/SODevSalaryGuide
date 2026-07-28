export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER' // (Combined, too few data)
}

// Index signature so Gender[name] / Gender[anyString] is a valid lookup
export type GenderRecord = { [key: string]: Gender }