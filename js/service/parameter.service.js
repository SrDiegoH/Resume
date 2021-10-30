class ParameterService {
    #PARAMETER_NAME

    #parameters;

    constructor(){
        this.#PARAMETER_NAME = {
            "COLOR": "color",
            "SHOULD_TRANSLATE": "shouldTranslate",
            "TAGS": "tags"
        }

        this.#fillParametersWithUrlQuery();
    }

    #getParameter = (key) => this.#parameters[key];
    #setParameter = (key, value) => this.#parameters[key] = value;
    #hasParameterFilled = (key) => this.#parameters[key]? true : false;

    getColor = () => "#" + this.#getParameter(this.#PARAMETER_NAME.COLOR);
    setColor = (value) => this.#setParameter(this.#PARAMETER_NAME.COLOR, value.replace("#", ""));
    #hasColorFilled = () => this.#hasParameterFilled(this.#PARAMETER_NAME.COLOR);

    getShouldTranslate = () => convertToBoolean(this.#getParameter(this.#PARAMETER_NAME.SHOULD_TRANSLATE));
    setShouldTranslate = (value) => this.#setParameter(this.#PARAMETER_NAME.SHOULD_TRANSLATE, value);
    #hasShouldTranslateFilled = () => this.#hasParameterFilled(this.#PARAMETER_NAME.SHOULD_TRANSLATE);

    getTags = () => convertToArray(this.#getParameter(this.#PARAMETER_NAME.TAGS)).map(tag => tag.replace("%20", " ").toUpperCase());
    setTags = (value) => this.#setParameter(this.#PARAMETER_NAME.TAGS, value);
    #hasTagsFilled = () => this.#hasParameterFilled(this.#PARAMETER_NAME.TAGS);
    areAllTagsCached = () => this.getTags(this.#PARAMETER_NAME.TAGS).includes(ALL_TAGS);
    isTagInCache = (tagTarget) => this.getTags(this.#PARAMETER_NAME.TAGS).some(tag => tag === tagTarget.toUpperCase());
    arrayHasAnyTagOnCache = (array) => this.getTags(this.#PARAMETER_NAME.TAGS).some(tag => array.includes(tag))

    #fillParametersWithUrlQuery(){
        const urlQuery = window.location.search;

        this.#parameters = urlQuery? convertQueryToJson(urlQuery) : {};

        if(!this.#hasColorFilled())
            this.setColor("#329223");

        if(!this.#hasShouldTranslateFilled())
            this.setShouldTranslate(false);

        if(!this.#hasTagsFilled())
            this.setTags(ALL_TAGS);
    }
}