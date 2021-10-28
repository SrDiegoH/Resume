const translations = {
    "SOBRE MIM" : "ABOUT ME",
    "INTERESSES" : "INTERESTS",
    "LÍNGUAS" : "LANGUAGES",
    "COMPETÊNCIAS" : "SKILLS",
    "HABILIDADES TÉCNICAS" : "TECHNICAL PROFICIENCIES",
    "OBJETIVO DE CARREIRA" : "CAREER  OBJECTIVE",
    "EXPERIÊNCIAS PROFISSIONAIS" : "PROFESSIONAL EXPERIENCES",
    "EDUCAÇÃO" : "EDUCATION",
    "CURSOS E CERTIFICADOS" : "COURSES AND CERTIFICATES",
    "Selecione os cursos pela tag": "Select courses by tags",
    "atualmente" : "currently",
    "Currículo" : "Resume",
    "Marcar todos" : "Select All",
    "Desmarcar todos" : "Unselect All",
    "Copiado!" : "Copied!",
    "Erro!" : "Error!"
}

function httpGetRequest(url){
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, false);
    httpRequest.send();
    return httpRequest.responseText;
}

function convertToMonthAndYear(date) {
    const splittedDate = date.split("/");

    const haveDay = splittedDate.length == 3;

    const month = splittedDate[haveDay? 1 : 0];
    const year = splittedDate[haveDay? 2 : 1];
    return month + "/" + year;
}

function translate(text){
    return shouldTranslate? translations[text] : text;
}

function selectAllTagsText(isChecked){
    return translate(isChecked? "Desmarcar todos" : "Marcar todos");
}

function buildUrlWithParameters(baseUrl){
    const language = `language=${shouldTranslate? "EN" : "PT" }`;
    const color = `color=${colorPallet? colorPallet : "329223"}`;

    return baseUrl.origin + baseUrl.pathname + "?" + language + "&" + color.replace("#", "");
}