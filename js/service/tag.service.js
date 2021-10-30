class TagService {
    #parameterService;

    #areAllTagsCached;
    #tags;

    constructor(parameterService){
        this.#parameterService = parameterService;

        this.#areAllTagsCached = this.#parameterService.areAllTagsCached();
        this.#tags = {};
    }

    #translate = (text) => translate(this.#parameterService.getShouldTranslate(), text);

    getAllCheckedTags() {
        const tagNames = Object.keys(this.#tags);

        const allCheckedTags = tagNames.filter(tagName => this.#tags[tagName] === true).join();

        if(!allCheckedTags)
            return ALL_TAGS;

        return tagNames.length === allCheckedTags.length? ALL_TAGS : allCheckedTags;
    }

    closeTags = () => document.getElementById("tags").style.visibility = "hidden";

    openTags(courses){
        document.getElementById("tags").style.visibility = "visible";

        this.#fillAllTags(courses);

        this.loadTagsText();
        const text = this.#loadTagsOnModal();

        document.getElementById("tags_table").innerHTML = text;

        this.#addEventsOnTags();
    }

    #fillAllTags(courses){
        const areTagsEmpty = Object.keys(this.#tags).length === 0;

        if(areTagsEmpty) {
            this.#tags = courses.reduce((tagDictionary, course) => {

                course.tags.map(tagTarget => tagDictionary[tagTarget.toUpperCase()] = this.#isTagChecked(tagTarget));

                return tagDictionary;
            }, {});
        }
    }

    #isTagChecked = (tagTarget) => this.#areAllTagsCached || 
                                   this.#parameterService.isTagInCache(tagTarget);

    #loadTagsOnModal(){
        const sortedTags = Object.keys(this.#tags).sort((frist, second) => sortTexts(frist, second));

        let text = "<table><tr>";
        let counter = 0;

        for(var tag of sortedTags){
            if(counter == 4){
                text += "</tr><tr>";
                counter = 0;
            }

            const isChecked = this.#tags[tag]? "checked" : "unchecked";

            text += `<td><label><input class='tag' type='checkbox' ${isChecked} name='${tag}'>${tag}</label><td>`;

            counter++;
        }

        text += "</tr></table>";

        return text;
    }

    #addEventsOnTags = () => document.querySelectorAll(".tag").forEach(element => this.#addEventOnElement(element));

    #addEventOnElement = (element) => element.addEventListener("change", (event) => this.#showByTag(event.target), false);

    #selectAllTagsText = (isChecked) => this.#translate(isChecked? "Desmarcar todos" : "Marcar todos");

    #renameSelectAllTagsToggle = (areAllTagsCached) => document.getElementById("select_all_tags").value = this.#selectAllTagsText(areAllTagsCached);

    loadTagsText(){
        document.getElementById("tags_title").innerHTML = `<h2>${this.#translate("Selecione os cursos pela tag")}</h2>`;

        this.#renameSelectAllTagsToggle(this.#areAllTagsCached);
    }

    selectAndUnselectTags() {
        document.querySelectorAll(".tag")
                .forEach(tagToggle => {
                    tagToggle.checked = !this.#areAllTagsCached;
                    this.#showByTag(tagToggle);
                });

        this.#renameSelectAllTagsToggle(this.#areAllTagsCached);

        this.#areAllTagsCached = !this.#areAllTagsCached;
    }

    #showByTag(tagToggle){
        const elements = document.querySelectorAll(`#education [data-tags*="${tagToggle.name}"]`);
        const displayValue = tagToggle.checked? "block" : "none";

        this.#tags[tagToggle.name] = tagToggle.checked;

        elements.forEach(element => element.style.display = displayValue);
    }
}