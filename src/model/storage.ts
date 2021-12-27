import Config from "./config";
import DefaultConfig from "./defaultConfig";
import SurveyEntry from "./surveyEntry";

export default class Storage {
    
    parsedData: SurveyEntry[] = []

    currentConfig: Config = new DefaultConfig()
}