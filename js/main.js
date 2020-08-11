let temp = "";
const ghgPerCapita = 5.58;
let huellaFaltante = ghgPerCapita;
let huellaReducida = 0;
let huellaEnDuda = 0;
let huellaPromedio = 0;

$('[data-toggle="tooltip"]').tooltip();

formas.forEach((item, i) => {
  temp = temp + `<h3 class="ml-2 mt-3">${item.categoria}</h3>`;
  item.cards.forEach((card, j) => {
    temp = temp + getCard(card, `${i}-${j}`);
  });
});
document.getElementById("aquiVanCards").innerHTML = temp;

const barrasRoja = document.getElementById("barraRoja");
const barraAmarilla = document.getElementById("barraAmarilla");
const barraVerde = document.getElementById("barraVerde");
const barraPromedio = document.getElementById("barraPromedio");

barraRoja.innerHTML = ghgPerCapita;

function getCard(card, index) {
  let reduccion = "";

  let restoTexto = "";
  if (card.min == null && card.max == null) {
    reduccion = `
    <div class="d-flex w-100">
      <ul class="mb-0">
        <li style="font-size: 1.2rem;">
          Reduce en promedio 
          <span class="badge badge-success">${card.med}</span>.
        </li>
      </ul>
    </div>`;
  } else {
    reduccion = `
    <div class="d-flex w-100">
      <ul class="mb-0">
        <li style="font-size: 1.2rem;">
          Reduce ${card.min >= 0 ? "entre " : "hasta "}
          <span class="badge badge-success">${card.max}</span>${card.min >= 0 ? " y " : ", pero puede perjudicar hasta "}
          <span class="badge badge-${card.min >= 0 ? "success" : "danger"}">${card.min}</span>. Promedio de <span class="badge badge-success">${
      card.med
    }</span>.
        </li>
      </ul>
    </div>`;
  }

  if (card.resto != "") {
    restoTexto = `
      <b class="collapse" id="unique_${index}" style="font-weight: normal;">
        ${card.resto}
      </b>
      <button
        type="button"
        class="badge badge-info"
        data-toggle="collapse"
        data-target="#unique_${index}"
        id="button_${index}"
        style="border-style: none;"
        onclick="expandir('button_${index}')"
      >
        Expandir
      </button>`;
  }

  return `
    <div class="list-group-item">
      <div class="media">
        <img
          src="./src/${card.img}"
          class="mr-3"
          alt="..."
          style="height: 90px; width: 90px; border-radius: 20px;"
        />
        <div class="media-body">
          <h3 class="mb-1">${card.titulo}</h3>
          <p class="mb-1" style="font-size: 1.2rem;">
            ${card.resumen}
            ${restoTexto}
          </p>
          ${reduccion}
        </div>
        <div class="btn-group ml-3" role="group" style="height: 100%;">
          <button
            type="button"
            class="btn btn-secondary btn-outline-dark"
            style="height: 90px; width: 90px; color: white;"
            id="${index}-0"
            onclick="loHareYaLoHago('${index}-0', ${card.min == null ? card.med : card.min}, ${card.max == null ? 0 : card.max}, ${card.med})"
          >
            Haré esto
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-outline-dark"
            style="height: 90px; width: 90px; color: white;"
            id="${index}-1"
            onclick="loHareYaLoHago('${index}-1', ${card.min == null ? card.med : card.min}, ${card.max == null ? 0 : card.max}, ${card.med})"
          >
            Ya hago esto
          </button>
        </div>
      </div>
    </div>
`;
}

// Esta función hace que el botón expandir cambie o no de tamaño
function expandir(id) {
  let btn = document.getElementById(id);
  console.log(btn.innerHTML.trim());
  if (btn.innerHTML.trim() == "Expandir") {
    btn.innerHTML = "Mostrar menos";
  } else {
    btn.innerHTML = "Expandir";
  }
}

function loHareYaLoHago(id, min, max, promedio) {
  const element = document.getElementById(id);
  const resumen = document.getElementById("resumen");

  // Actualizar el botón presionado
  const splitted = id.split("-");
  const otroBtn = document.getElementById(`${splitted[0]}-${splitted[1]}-${splitted[2] == 0 ? 1 : 0}`);

  if (element.classList.contains("btn-secondary")) {
    element.classList.replace("btn-secondary", "btn-success");
    element.classList.replace("btn-outline-dark", "btn-outline-white");

    // otroBtn.setAttribute("disabled", "");
    // otroBtn.classList.remove("btn-outline-dark");
  } else {
    element.classList.replace("btn-success", "btn-secondary");
    element.classList.replace("btn-outline-white", "btn-outline-dark");

    // otroBtn.removeAttribute("disabled");
    // otroBtn.classList.add("btn-outline-dark");
  }

  // Si el otro botón está verde, no sumar ni nada
  if (otroBtn.classList.contains("btn-success")) {
    otroBtn.classList.replace("btn-success", "btn-secondary");
  } else {
    if (element.classList.contains("btn-success")) {
      huellaReducida += min;
      huellaEnDuda += max;
      huellaFaltante -= max;
      huellaPromedio += promedio;
    } else {
      huellaReducida -= min;
      huellaEnDuda -= max;
      huellaFaltante += max;
      huellaPromedio -= promedio;
    }
  }

  // Si la huella faltante es menor a 0, entonces cambiar el título
  if (huellaFaltante <= 0) {
    document.getElementById("navbar-title").innerHTML =
      "¡Has arrazado con tu huella de carbono! Aún así, toma en cuenta el margen de error posible.";
  } else {
    document.getElementById("navbar-title").innerHTML = "Toneladas de CO2 que emites al año:";
  }

  // Actualizar el texto de resumen
  resumen.innerHTML = `Promedio de reducción: <span class="badge badge-success">${huellaPromedio.toFixed(
    2
  )}</span> tCO2.<br>Reducción teórica máxima: <span class="badge badge-success">${huellaEnDuda.toFixed(
    2
  )}</span> tCO2 y mínima: <span class="badge badge-${huellaReducida < 0 ? "danger" : "success"}">${huellaReducida.toFixed(2)}</span> tCO2`;

  // Actualizar las barras
  let nuevoPorcentaje = (huellaReducida * 100) / ghgPerCapita;
  barraVerde.style["width"] = `${nuevoPorcentaje < 0 ? 0 : nuevoPorcentaje}%`;
  barraVerde.innerHTML = ` ${huellaReducida.toFixed(2)}`;

  nuevoPorcentaje = ((huellaEnDuda - huellaPromedio) * 100) / ghgPerCapita;
  barraAmarilla.style["width"] = `${nuevoPorcentaje < 0 ? 0 : nuevoPorcentaje}%`;
  barraAmarilla.innerHTML = ` ${huellaEnDuda.toFixed(2)}`;

  nuevoPorcentaje = ((huellaPromedio - huellaReducida) * 100) / ghgPerCapita;
  barraPromedio.style["width"] = `${nuevoPorcentaje < 0 ? 0 : nuevoPorcentaje}%`;
  barraPromedio.innerHTML = ` ${huellaPromedio.toFixed(2)}`;

  nuevoPorcentaje = (huellaFaltante * 100) / ghgPerCapita;
  barrasRoja.style["width"] = `${nuevoPorcentaje < 0 ? 0 : nuevoPorcentaje}%`;
  barrasRoja.innerHTML = `${huellaFaltante.toFixed(2)}`;
}
