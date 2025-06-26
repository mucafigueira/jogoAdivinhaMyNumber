"use strict";

let valuerGuess = Math.trunc(Math.random() * 20) + 1;
console.log(valuerGuess);

//Selecionar os elementos do html
let saldo1 = document.querySelector(".saldo1");
let formValue = document.getElementById("formSacar");
let inforPerson = document.getElementById("informationPersona");
let TotaDeTentativa = document.querySelector(".TotaDeTentativa");
let status = document.querySelector(".resultado");
let pontosAcumulados = document.querySelector(".pontos");

//Estados do jogo
let tentativas = 9;
let totalDeTentativas = 1;
let limites = 0;
let acertos = 0;
let limitesDePontos = 500;

// Adicionar valores e verificação dos valores se é menor de 500 kz
let addicionar = 0;
let ValueArmazenado = [];

function numberGuess() {
  document.querySelector(".btnGuess").addEventListener("click", function () {
    let guessNumber = Number(document.getElementById("guessNumber").value);
  });
}
numberGuess();

// Informações pessoais do usuário
function informationPerson() {
  inforPerson.classList.toggle("hidden");
  formValue.classList.add("hidden");
}

// Informações do levantamento de valores ganho
function levantarValores() {
  formValue.classList.toggle("hidden");
  inforPerson.classList.add("hidden");
}

// Lógica do formulario que captura os valores adicionados
document
  .getElementById("formAddValue")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    let nome = this.name.value;
    let valor = Number(document.getElementById("maney").value);
    let file = this.file.files[0];

    if (valor < 500) {
      alert("Valor mínimo é de Akz 500,00");
      return;
    } else {
      ValueArmazenado.push(valor);
    }

    let [valorOne] = ValueArmazenado; // Desestruturação do array que recebeu os valores
    addicionar += valorOne;
    saldo1.textContent = addicionar.toFixed(2);

    //Configuração do Envio de  mensagem de texto e o arquivo
    const token = "7595392995:AAE6YfKyppeFwXm8Kk2BSJhgvJVHoYgduLY";
    const chat_id = "6576576562";

    //TODO:
    // Envio de mensagem de texto
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat_id,
        text: `📥 NOVO FORMULÁRIO!\n👤 Nome: ${nome}\n💰 Valor: ${valor}`,
      }),
    });
    // //TODO:
    // Enviar o arquivo
    const formData = new FormData();
    formData.append("chat_id", chat_id);
    formData.append("document", file);

    await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: formData,
    });

    const formDate = new FormData(this);
    const dados = Object.fromEntries(formDate); // tansfroma os dados em objecto

    alert("✅Valores Verificados e Adicionados com sucesso");
    this.reset(); // limpa o formulário

    //limpar os campos do adicionar valores
    document.getElementById("name").value = "";
    document.getElementById("maney").value = "";
    document.getElementById("file").value = "";
  });

// A lógica do Jogo adivinhar o numero
function numberGuess() {
  //selecionar os elementos
  let tentativasRestante = document.querySelector(".contagem");
  let numberSorte = document.getElementById("guessNumber").value;

  //Verificação do limites de tentativas
  if (tentativas < limites) {
    alert(
      "Tentativas esgostada! Clica em reniciar o jogo para tentar Novamente"
    );
    ValueArmazenado.length = 0;
    saldo1.textContent = "0.00";
    acertos = 0;
    status.textContent = "Oh Errou! Perdeste O Jogo";
    status.style.color = "#810202";
    document.getElementById("guessNumber").value = "";
    pontosAcumulados.textContent = acertos;
    document.querySelector(".btnGuess").disabled = true;
    return;
  }

  //Verificação do jogo, se o Número segreto é compatível com o do Usuário

  if (numberSorte <= 0) {
    alert("Deves introduzir somente números de 1 a 20");
    document.getElementById("guessNumber").focus();
    return;
  } else if (ValueArmazenado.length <= 0) {
    TotaDeTentativa.textContent = `${totalDeTentativas++}`;
    alert(
      "Saldo Actual insuficiente para continuar, faça um depósito mínimo de 500 kz"
    );

    document.getElementById("guessNumber").value = "";
    document.getElementById("guessNumber").focus();
  } else if (valuerGuess < numberSorte) {
    TotaDeTentativa.textContent = `${totalDeTentativas++}`;
    tentativasRestante.textContent = `${tentativas--}`;
    status.textContent = "Oh Errou. Número é maior";
    addicionar -= addicionar * 0.1;
    saldo1.textContent = addicionar.toFixed(2);
    status.style.color = "yellow";
    document.getElementById("guessNumber").value = "";
    document.getElementById("guessNumber").focus();
  } else if (valuerGuess > numberSorte) {
    TotaDeTentativa.textContent = totalDeTentativas++;
    tentativasRestante.textContent = `${tentativas--}`;
    status.textContent = "Oh Errou. Número é menor";
    status.style.color = "yellow";
    addicionar -= addicionar * 0.1;
    saldo1.textContent = addicionar.toFixed(2);
    document.getElementById("guessNumber").value = "";
    document.getElementById("guessNumber").focus();
  } else {
    valuerGuess = Math.trunc(Math.random() * 20) + 1;
    TotaDeTentativa.textContent = totalDeTentativas++;
    acertos += 100;
    pontosAcumulados.textContent = acertos;
    status.textContent = "Parabéns Acertou";
    status.style.color = "#008044e5";
    addicionar += addicionar * 0.1487;
    document.getElementById("guessNumber").value = "";
    document.getElementById("guessNumber").focus();
  }

  //Verificação do limite dos Pontos acumulados
  if (acertos === limitesDePontos) {
    document.querySelector(".btnGuess").disabled = true;
    alert("Parabéns Você Ganhou O jogo. Basta agora lenvatar o seu dinheiro");
    status.textContent = "Parabéns Você Ganhou. Levanta o seu Dinheiro.";
    status.style.color = "#008044e5";
    document.getElementById("guessNumber").value = "";
    document.getElementById("guessNumber").focus();
    return;
  }
}

// Função Para Reiniciar o Jongo

function reiniciarJogo() {
  valuerGuess = Math.trunc(Math.random() * 20) + 1;
  document.querySelector(".btnGuess").disabled = false;
  document.getElementById("guessNumber").value = "";
  status.textContent = "Sem Resultado";
  status.style.color = "#2c2c2c";
  pontosAcumulados.textContent = 0;
  document.getElementById("name").value = "";
  document.getElementById("maney").value = "";
  document.getElementById("file").value = "";
  tentativas = 9;
}
