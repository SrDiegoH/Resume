class TagService {
    #parameterService;

    #isAllTagsChecked;
    #tags;

    constructor(parameterService){
        this.#parameterService = parameterService;

        this.#isAllTagsChecked = false;
        this.#tags = {};
    }

    #translate = (text) => translate(this.#parameterService.getShouldTranslate(), text);

    closeTags = () => document.getElementById("tags").style.visibility = "hidden";

    openTags(courses){
        this.loadTagsText();

        document.getElementById("tags").style.visibility = "visible";

        this.#fillAllTags(courses);

        const text = this.#loadTagsOnModal();

        document.getElementById("tags_table").innerHTML = text;

        this.#addEventsOnTags();
    }

    #fillAllTags(courses){
        const isTagsEmpty = Object.keys(this.#tags).length === 0;

        if(isTagsEmpty) {
            this.#tags = courses.reduce((tagDictionary, course) => {
                course.tags.map(tag => tagDictionary[tag] = true);
                return tagDictionary;
            }, {});
        }
    }

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

    #addEventsOnTags(){
        const tagsByClass = document.getElementsByClassName("tag");

        Object.values(tagsByClass).forEach(element => this.#addEventOnElement(element));
    }

    #addEventOnElement = (element) => element.addEventListener("change", (event) => this.#showByTag(event.target), false);

    #selectAllTagsText = (isChecked) => this.#translate(isChecked? "Desmarcar todos" : "Marcar todos");

    #renameSelectAllTagsToggle = (isAllTagsChecked) => document.getElementById("select_all_tags").value = this.#selectAllTagsText(isAllTagsChecked);

    loadTagsText(){
        document.getElementById("tags_title").innerHTML = `<h2>${this.#translate("Selecione os cursos pela tag")}</h2>`;

        this.#renameSelectAllTagsToggle(!this.#isAllTagsChecked);
    }

    selectAndUnselectTags() {
        document.querySelectorAll(".tag")
                .forEach(tagToggle => {
                    tagToggle.checked = this.#isAllTagsChecked;
                    this.#showByTag(tagToggle);
                });

        this.#renameSelectAllTagsToggle(this.#isAllTagsChecked);

        this.#isAllTagsChecked = !this.#isAllTagsChecked;
    }

    #showByTag(tagToggle){
        const elements = document.querySelectorAll(`#education [data-tags*="${tagToggle.name}"]`);
        const displayValue = tagToggle.checked? "block" : "none";

        this.#tags[tagToggle.name] = tagToggle.checked;

        elements.forEach(element => element.style.display = displayValue);
    }
}