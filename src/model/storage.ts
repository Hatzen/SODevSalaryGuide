import Config from "./config";
import DefaultConfig from "./defaultConfig";
import SurveyEntry from "./surveyEntry";

export default class Storage {
    
    parsedData: SurveyEntry[] = []
    parsedDataByYear: { [year: number]: SurveyEntry[] } = {}

    currentConfig: Config = new DefaultConfig()
}