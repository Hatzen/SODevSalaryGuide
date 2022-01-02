import SurveyEntry from "./surveyEntry";

export default class ResultSetForYear {
    resultSet: SurveyEntry[] = []
    overallEntryCount: number = 0
    invalidEntryCount: number = 0

    year: number = -1

    chunksAvailable: number = -1
    chunksParsed: number = -1
}