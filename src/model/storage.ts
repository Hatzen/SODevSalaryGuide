import Config from "./config";
import FreeCurrency from "./currencyValues";
import DefaultConfig from "./defaultConfig";
import SurveyEntry from "./surveyEntry";

export default class Storage {
    
    parsedData: SurveyEntry[] = []
    parsedDataByYear: { [year: number]: SurveyEntry[] } = {}

    currentConfig: Config = new DefaultConfig()
    currencyValues!: FreeCurrency
}