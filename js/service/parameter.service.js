class ParameterService {
    #PARAMETER_TYPE

    #parameters;

    constructor(){
        this.#PARAMETER_TYPE = {
            "COLOR": "color",
            "SHOULD_TRANSLATE": "shouldTranslate"
        }

        this.#fillParametersWithUrl();
    }

    #getParameter = (key) => this.#parameters[key];
    #setParameter = (key, value) => this.#parameters[key] = value;
    #hasParameterFilled = (key) => this.#parameters[key]? true : false;

    getColor = () => "#" + this.#getParameter(this.#PARAMETER_TYPE.COLOR);
    setColor = (value) => this.#setParameter(this.#PARAMETER_TYPE.COLOR, value.replace("#", ""));   
    #hasColorFilled = () => this.#hasParameterFilled(this.#PARAMETER_TYPE.COLOR);

    getShouldTranslate = () => convertToBoolean(this.#getParameter(this.#PARAMETER_TYPE.SHOULD_TRANSLATE));
    setShouldTranslate = (value) => this.#setParameter(this.#PARAMETER_TYPE.SHOULD_TRANSLATE, value);
    #hasShouldTranslateFilled = () => this.#hasParameterFilled(this.#PARAMETER_TYPE.SHOULD_TRANSLATE);

    #fillParametersWithUrl(){
        const urlParameters = window.location.search;

        this.#parameters = urlParameters? this.#convertParametersToJson(urlParameters) : {};

        if(!this.#hasColorFilled())
            this.setColor("#329223");

        if(!this.#hasShouldTranslateFilled())
            this.setShouldTranslate(false);
    }

    #convertParametersToJson(urlParameters){
        return urlParameters.substring(1)
                            .split("&")
                            .map(parameters => parameters.split("="))
                            .reduce((json, parameterCouple) => {
                                json[parameterCouple[0]] = parameterCouple[1];
                                return json;
                            }, {});
    }
}