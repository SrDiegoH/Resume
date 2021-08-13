var resumeData;

var isMenuOpen = false;
var shouldTranslate = false;
var isAllTagsChecked = false;
var iconBaseURL = "https://raw.githubusercontent.com/SrDiegoH/Resume/master/resources/assets/";
var tags = {};

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

function loadDataAndWriteOnPage(){
    const requestJsonData = httpGetRequest("https://raw.githubusercontent.com/SrDiegoH/Resume/master/resources/data/resume_data.json");

    resumeData = JSON.parse(requestJsonData);

    changePageName(resumeData.name);

    loadTitle(resumeData);
    loadAboutMe(resumeData.about_me);
    loadInterests(resumeData.interesses);
    loadLanguages(resumeData.languages);
    loadSkills(resumeData.skills);
    loadTechnicalProficiencies(resumeData.technical_proficiencies);
    loadObjective(resumeData);
    loadExperiences(resumeData.professional_experiences);
    loadEducation(resumeData);
}

function changePageName(data){
    document.title = data;
}

function loadTitle(data){
    let text = `<h2 class='dynamic-color-text'>${data.name}</h2>`;
    text += `</br><h3 class='dynamic-color-text'>${data.office}</h3>`;

    document.getElementById("title").innerHTML = text;
}

function loadAboutMe(data){
    let text = `<h3>${translate("SOBRE MIM")}</h3>`;
    text += `<label><img src='${iconBaseURL}birth_date.png'/>${data.birth_date}</label></br>`;
    text += `<label><img src='${iconBaseURL}zap.png'/>${data.phones}</label></br>`;
    text += `<label class='about-me-small-text'><img src='${iconBaseURL}email.png'/>${data.emails}</label></br>`;
    text += `<label class='about-me-small-text'><img class='about-me-small-icon' src='${iconBaseURL}local.png'/>${data.address}</label></br>`;
    text += `<label><img src='${iconBaseURL}github.png'/><a href='${data.github}' target='_blank'>GitHub</a></label></br>`;
    text += `<label><img src='${iconBaseURL}linkedin.png'/><a href='${data.linkedin}' target='_blank'>LinkedIn</a></label>`;

    document.getElementById("about_me").innerHTML = text;
}

function loadInterests(data){
    let text = `<h3>${translate("INTERESSES")}</h3><table><tr>`;

    let columns = 0;

    for(item of data){
        if(columns == 2){
            text += "</tr><tr>";
            columns = 0;
        }

        text += `<td>${item}</td>`;

        columns++;
    }

    text += "</tr></table>";

    document.getElementById("interests").innerHTML = text;
}

function loadLanguages(data){
    let text = `<h3>${translate("LÍNGUAS")}</h3><table>`;

    for(item of data){
        text += `<tr><td>${item.language}</td><td>`;

        for(var i = 0; i < 3; i++){
            const iconName = i <= item.level - 1? "star_yellow" : "star_white";
            text += `<img src='${iconBaseURL + iconName}.png'/>`;
        }

        text += `</td></tr>`;
    }

    text += "</table>";

    document.getElementById("languages").innerHTML = text;
}

function loadSkills(data){
    let text = `<h3>${translate("COMPETÊNCIAS")}</h3><table>`;

    for(item of data)
        text += `<tr><td>${item}</td></tr>`;

    text += "</table>";

    document.getElementById("skills").innerHTML = text;
    
}

function loadTechnicalProficiencies(data){
    let text = `<h3>${translate("HABILIDADES TÉCNICAS")}</h3><table>`;

    for(item of data){
        text += `<tr><td align='right' valign='top'><div class='technical-proficiencies-description'>${item.description}</div></td><td><table>`;

        for(subitem of item.skills)
            text += `<tr><td align='left' valign='top'><div class='technical-proficiencies-skills'>${subitem}</div></td></tr>`;

        text += "</table></td></tr>";
    }

    text += "</table>";

    document.getElementById("technical_proficiencies").innerHTML = text;
}

function loadObjective(data){
    let text = `<h3>${translate("OBJETIVO DE CARREIRA")}</h3>`;
    text += `<p>${data.career_goal}</p>`;

    document.getElementById("objective").innerHTML = text;
}

function loadExperiences(data){
    let text = `<h3>${translate("EXPERIÊNCIAS PROFISSIONAIS")}</h3>`;

    for(item of data){

        text += "</br>";

        text += `<h4>${item.company}</h4>`;

        for (subitem of item.activities){
            const start_date = convertToMonthAndYear(subitem.start_date);
            const end_date = subitem.end_date? convertToMonthAndYear(subitem.end_date) : translate("atualmente");

            text += `<h5>${subitem.office}  (${start_date} - ${end_date})</h5>`;
            text += `<p>${subitem.description}</p>`;
        }
    }

    document.getElementById("experiences").innerHTML = text;
}

function loadEducation(data){
    let text = `<h3>${translate("EDUCAÇÃO")}</h3>`;

    const education = data.educations.sort((first, second) => convertToMonthAndYear(first.start_date) - convertToMonthAndYear(second.start_date));

    for(item of education){
        const start_date = convertToMonthAndYear(item.start_date);
        const end_date = item.end_date? convertToMonthAndYear(item.end_date) : translate("atualmente");

        text += `<h4>${item.type.toString().toUpperCase()}</h4>`;
        text += `<h5>${item.educational_institution + (item.course? " - " + item.course : "")}`;
        text += ` (${start_date} - ${end_date})</h5></br>`;
    }

    text += `<h4>${translate("CURSOS E CERTIFICADOS")}</h4>`;

    const courses = data.courses.sort((first, second) => first.course.localeCompare(second.course));

    for(item of courses){
        const start_date = item.start_date? convertToMonthAndYear(item.start_date) : null;
        const end_date = convertToMonthAndYear(item.end_date);

        text += `<p data-tags='${item.tags}'>`;
        text += `${item.educational_institution} - ${item.course}`;
        text += ` (${(start_date? start_date + " - " : "") + end_date})</p>`;
    }

    document.getElementById("education").innerHTML = text;
}


function openAndCloseMenu(event) {
    const menuIcon = event.target;
    const menu = document.getElementById("menu");

    if(isMenuOpen) {
        menuIcon.src = `${iconBaseURL}%2B_icon.png`;
        menu.style.visibility="hidden";

        closeTags();
    } else {
        menuIcon.src = `${iconBaseURL}x_icon.png`;
        menu.style.visibility="visible";
    }

    isMenuOpen = !isMenuOpen;
}

function changeTranslation(event){
    const translateIcon = document.getElementById("translate_icon");
    const translateToggle = event.target;

    shouldTranslate = translateToggle.checked;
    
    const iconName = shouldTranslate? "BRL_icon" : "USA_icon";
    translateIcon.src = `${iconBaseURL + iconName}.png`;

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
    document.querySelectorAll(".dynamic-color-background")
            .forEach((item) => item.style.background = event.target.value);

    document.querySelectorAll(".dynamic-color-line")
            .forEach((item) => item.style.backgroundImage = 
            `linear-gradient(to right, transparent, ${event.target.value}, transparent)`);

    document.querySelectorAll(".dynamic-color-text")
            .forEach((item) => item.style.color = event.target.value);
}