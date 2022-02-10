
function recarregar(){
    createScene()
    document.getElementById("opcoes").style.display = "none"
    end = false 
    document.getElementById("vida").value = 50
}

function jogar(){
    document.location.href = "index.html"
}

function sair(){
    document.location.href = "ui.html"
}

function salvaNome(){
    const nome = document.getElementById("txtNome")

    localStorage.setItem("nome", nome.value)
}

function jogar(){
    const splash = document.getElementById("welcome")
    salvaNome()
    splash.style.display = "none"
    document.getElementById("lblNome").value = localStorage.getItem("nome")

    const guid = document.getElementById("guid")
    guid.style.display = "block"
    
}

function MenuPausa(){
    if(paused)
       document.getElementById("pausa").style.display = "flex"
    else
       document.getElementById("pausa").style.display = "none"
 }
 

var tela = document.getElementById("opcoes")

