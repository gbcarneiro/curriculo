//Há uma função para cada área do currículo, e foi utilizado `let` ao invés de var, para que o nome fosse mantido durante todo o projeto sem nenhum problema
function showStudies() {
    let divId = $("#studiesContent") //Aqui entra a parte do JQuery para coletar o item com a id studiesContent
  
    // Algoritmo para mudar a classe da div no html, fazendo com que seu display esteja como none, ou normal
    if (divId.attr("class") == "normal") {
        divId.attr("class", "hiddenStContent")

    } else {
        divId.attr("class", "normal")
    }
}


function showExperience() {
    let divId = $("#expContent")

    if (divId.attr("class") == "normal") {
        divId.attr("class", "hiddenExpContent")

    } else {
        divId.attr("class", "normal")

    }
}


function showLanguages() {
    let divId = $("#langContent")

    if (divId.attr("class") == "normal") {
        divId.attr("class", "hiddenLangContent")

    } else {
        divId.attr("class", "normal")

    }
}


// rotas 
function loadData() {
    var xhttp = new XMLHttpRequest() 
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(xhttp.responseText)

            $('#nome').html(res.Nome)
            $('#titulo').html(res.Titulo)
            $('#nacionalidade').html(res.Nacionalidade)
            $('#contato').html(res.Email)   
        }
    }
    
    xhttp.open('GET', 'http://localhost:3001/dados', false)
    xhttp.send()
}

function sendMessage() {
    let nome = document.querySelector("#nomeForms").value
    let fone = document.querySelector("#fone").value
    let email = document.querySelector("#email").value
    let txt = document.querySelector("#texto").value

    console.log(nome)
    $.ajax({
        url: 'http://localhost:3001/contato', 
        method: 'POST',
        data: {
            name: nome,
            phone: fone,
            email: email, 
            text: txt
        },
        success: function() {
            alert('Mensagem enviada com sucesso!')
        },
        contentType: "application/json; charset=utf-8" 
    })
}


const div = document.querySelector("#langContent")
const input = document.createElement('input')

function addLangInput() {
    input.setAttribute('id', 'novoIdioma')
    input.setAttribute('placeholder', 'digite um novo idioma e seu nível: Ingles Avançado')
    div.appendChild(input)
    div.innerHTML += ' <button id="addLang" onclick="addLanguage()">+</button>'
}  

function addLanguage() {
    const newLangInput = document.querySelector('#novoIdioma')
    const addBtn = document.querySelector("#addLang")

    const newLang = newLangInput.value

    addBtn.remove();
    newLangInput.remove();


    $.ajax({
        url: 'http://localhost:3001/editLang',
        method: 'PUT',
        data: {
            language: newLang
        }, 
        success: function(res) {
            div.innerHTML = ''
            atualizarIdiomas(res)
        } 
    })
}

function atualizarIdiomas(idiomas) {
    div.innerHTML += '<button style="margin: 10px 0px;" onclick="addLangInput()">Adicionar Idioma</button>'

    for (let i = 0; i < idiomas.length; i++) {
        div.innerHTML += `<p>${idiomas[i].idioma} (${idiomas[i].nivel}) <i onclick="removeLang(${idiomas[i].id})"> X </i></p>`
    }
}

function removeLang(id) {
    $.ajax({
        url: 'http://localhost:3001/deleteLang',
        method: 'DELETE',
        data: {
            id: id
        }, 
        success: function(res) {
            div.innerHTML = ''
            atualizarIdiomas(res)
        }
    })
}