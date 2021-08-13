var colorPallet;

window.onload = function () {
    loadDataAndWriteOnPage();

    document.getElementById("menu_icon")
            .addEventListener("click", openAndCloseMenu);

    document.getElementById("translate_button")
            .addEventListener("click", changeTranslation);

    document.getElementById("download_icon")
            .addEventListener("click", downloadResume);

    document.getElementById("tags_icon")
            .addEventListener("click", openTags);

    document.getElementById("close_tags_icon")
            .addEventListener("click", closeTags);

    document.getElementById("select_all_tags")
            .addEventListener("click", selectAndUnselectTags);

    document.getElementById("color_picker")
            .addEventListener("change", colorPick, false);
}

function openAndCloseMenu(event) {
    const menuIcon = event.target;
    const menu = document.getElementById("menu");

    if(isMenuOpen) {
        menuIcon.src = `${baseGithubURL}assets/%2B_icon.png`;
        menu.style.visibility="hidden";

        closeTags();
    } else {
        menuIcon.src = `${baseGithubURL}assets/x_icon.png`;
        menu.style.visibility="visible";
    }

    isMenuOpen = !isMenuOpen;
}

function changeTranslation(event){
    const translateIcon = document.getElementById("translate_icon");
    const translateToggle = event.target;

    shouldTranslate = translateToggle.checked;
    
    const iconName = shouldTranslate? "BRL_icon" : "USA_icon";
    translateIcon.src = `${baseGithubURL}assets/${iconName}.png`;

    loadDataAndWriteOnPage();
    loadTagsText();
}

function downloadResume(){
    const resumeHTML = document.getElementById("resume");
    const fileName = `${resumeData.name} - ${translate("Currículo")}.pdf`;

    console.log(html2pdf().from(resumeHTML));
    html2pdf().from(resumeHTML).set({ filename: fileName }).save();
}

function openTags(){
    loadTagsText();

    document.getElementById("tags").style.visibility = "visible";

    if(Object.keys(tags).length == 0) {
        tags = resumeData.courses.reduce((tagDictionary, course) => {
            course.tags.map(tag => tagDictionary[tag] = true);
            return tagDictionary;
        }, {});
    }

    let sortedTags = Object.keys(tags).sort((fristTag, secondTag) => fristTag.localeCompare(secondTag));
    let text = "<table><tr>";
    let counter = 0;

    for(tag of sortedTags){
        if(counter == 4){
            text += "</tr><tr>";
            counter = 0;
        }

        const isChecked = tags[tag]? "checked" : "unchecked";

        text += `<td><label><input class='tag' type='checkbox' ${isChecked} name='${tag}' onclick='showByTag(this)'>${tag}</label><td>`;

        counter++;
    }

    text += "</tr></table>";

    document.getElementById("tags_table").innerHTML = text;
}

function loadTagsText(){
    document.getElementById("tags_title").innerHTML = `<h2>${translate("Selecione os cursos pela tag")}</h2>`;
    document.getElementById("select_all_tags").value = selectAllTagsText(!isAllTagsChecked);
}

function closeTags() {
    document.getElementById("tags").style.visibility = "hidden";
}

function selectAndUnselectTags() {
    document.querySelectorAll(".tag").forEach(item => {
        item.checked = isAllTagsChecked;
        showByTag(item);
    });

    document.getElementById("select_all_tags").value = selectAllTagsText(isAllTagsChecked);

    isAllTagsChecked = !isAllTagsChecked;
}

function showByTag(tagToggle){
    const elements = document.querySelectorAll(`#education [data-tags*="${tagToggle.name}"]`);
    const displayValue = tagToggle.checked? "block" : "none";

    tags[tagToggle.name] = tagToggle.checked;

    elements.forEach(element => element.style.display = displayValue);
}

function colorPick(event){
    colorPallet = event.target.value;

    document.querySelectorAll(".dynamic-color-background")
            .forEach((item) => item.style.background = colorPallet);

    document.querySelectorAll(".dynamic-color-line")
            .forEach((item) => item.style.backgroundImage = 
            `linear-gradient(to right, transparent, ${colorPallet}, transparent)`);

    document.querySelectorAll(".dynamic-color-text")
            .forEach((item) => item.style.color = colorPallet);
}