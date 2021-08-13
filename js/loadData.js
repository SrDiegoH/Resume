var resumeData;

var isMenuOpen = false;
var shouldTranslate = false;
var isAllTagsChecked = false;

var baseGithubURL = "https://raw.githubusercontent.com/SrDiegoH/Resume/master/resources/";

var tags = {};

window.onload = function () {
    loadDataAndWriteOnPage();
}

function loadDataAndWriteOnPage(){
    const jsonDataURL = `${baseGithubURL}data/${shouldTranslate? "resume_data_en" : "resume_data_pt"}.json`;
    const jsonDataRequest = httpGetRequest(jsonDataURL);

    resumeData = JSON.parse(jsonDataRequest);

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
    text += `<label><img src='${baseGithubURL}assets/birth_date.png'/>${data.birth_date}</label></br>`;
    text += `<label><img src='${baseGithubURL}assets/zap.png'/>${data.phones}</label></br>`;
    text += `<label class='about-me-small-text'><img src='${baseGithubURL}assets/email.png'/>${data.emails}</label></br>`;
    text += `<label class='about-me-small-text'><img class='about-me-small-icon' src='${baseGithubURL}assets/local.png'/>${data.address}</label></br>`;
    text += `<label><img src='${baseGithubURL}assets/github.png'/><a href='${data.github}' target='_blank'>GitHub</a></label></br>`;
    text += `<label><img src='${baseGithubURL}assets/linkedin.png'/><a href='${data.linkedin}' target='_blank'>LinkedIn</a></label>`;

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
            text += `<img src='${baseGithubURL}assets/${iconName}.png'/>`;
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