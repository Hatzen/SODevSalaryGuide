import Config from "./config";
import FreeCurrency from "./currencyValues";
import DefaultConfig from "./defaultConfig";
import SurveyEntry from "./surveyEntry";

// TODO: Replace with Redux: https://redux.js.org/introduction/getting-started
export class Store {
    
    parsedData: SurveyEntry[] = []
    parsedDataByYear: { [year: number]: SurveyEntry[] } = {}

    currentConfig: Config = new DefaultConfig()
    currencyValues!: FreeCurrency

    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }
    
    private static _instance: Store;
    private constructor()
    {
        //...
    }
}

export default Store.Instance;