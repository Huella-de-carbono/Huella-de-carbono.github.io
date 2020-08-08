var temp = "";

$('[data-toggle="tooltip"]').tooltip();

formas.forEach((item, i) => {
  temp = temp + `<h3 class="ml-2 mt-3">${item.categoria}</h3>`;
  item.cards.forEach((card, j) => {
    temp = temp + getCard(card, `${i}-${j}`);
  });
});
document.getElementById("aquiVanCards").innerHTML = temp;

function getCard(card, index) {
  var reduccion = "";

  var restoTexto = "";
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
          Reduce ${card.min > 0 ? "entre " : "hasta "}
          <span class="badge badge-success">${card.max}</span>${card.min > 0 ? " y " : ", pero puede perjudicar hasta "}
          <span class="badge badge-${card.min > 0 ? "success" : "danger"}">${card.min}</span>. Promedio de <span class="badge badge-success">${
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
          src="./src/carros-contaminando.jpg"
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
          >
            Haré esto
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-outline-dark"
            style="height: 90px; width: 90px; color: white;"
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
  var btn = document.getElementById(id);
  console.log(btn.innerHTML.trim());
  if (btn.innerHTML.trim() == "Expandir") {
    btn.innerHTML = "Mostrar menos";
  } else {
    btn.innerHTML = "Expandir";
  }
}
