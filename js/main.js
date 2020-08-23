let temp = "";
const ghgPerCapita = 5.58; // Esto es un dato para México únicamente. Cada país tiene un valor diferente, lo cual implementaré en el futuro
let huellaFaltante = ghgPerCapita;
let huellaReducida = 0;
let huellaEnDuda = 0;
let huellaPromedio = 0;

$.get(
  "https://ipinfo.io?token=b6b18971a12194",
  function (response) {
    console.log(response.country);
  },
  "jsonp"
);

$('[data-toggle="tooltip"]').tooltip();

formas.forEach((item, i) => {
  temp = temp + `<h3 class="ml-2 mt-3">${item.categoria}</h3>`;
  item.cards.forEach((card, j) => {
    temp = temp + getCard(card, `${i}-${j}`);
  });
});
document.getElementById("aquiVanCards").innerHTML = temp;

// Esto igual el espacio del navbar flotante con el espacio de arriba
document.getElementById("espacioNavbar").style.height = `${document.getElementById("navbar").clientHeight}px`;

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
      <div class="media flex-md-row flex-column align-items-center align-items-md-start">
        <img
          src="./src/${card.img}"
          class="mr-3"
          alt="..."
          style="height: 90px; width: 90px; border-radius: 20px;"
        />
        <div class="media-body">
          <h3 class="mb-1 text-center text-md-left">${card.titulo}</h3>
          <p class="mb-1 text-center text-md-left" style="font-size: 1.2rem;">
            ${card.resumen}
            ${restoTexto}
          </p>
          ${reduccion}
        </div>
        <div class="btn-group ml-0 ml-sm-0 ml-md-3 ml-lg-3 ml-xl-3 mt-3 mt-sm-3 mt-md-0 mt-lg-0 mt-xl-0" role="group" style="height: 100%;">
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
  } else {
    element.classList.replace("btn-success", "btn-secondary");
    element.classList.replace("btn-outline-white", "btn-outline-dark");
  }

  // Si el otro botón está verde, no sumar ni nada, solo deshabilitar el otro
  if (otroBtn.classList.contains("btn-success")) {
    otroBtn.classList.replace("btn-success", "btn-secondary");
    otroBtn.classList.replace("btn-outline-white", "btn-outline-dark");
  } else {
    // Si el otro estaba apagado, entonces sumar o restar a las variables
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
    // Esto es porque a veeces las restas y sumas dan decimales muy pequeños y toFixed entrega -0.00
    if (parseFloat(huellaPromedio.toFixed(2)) == 0) huellaPromedio = 0;
    if (parseFloat(huellaReducida.toFixed(2)) == 0) huellaReducida = 0;
    if (parseFloat(huellaEnDuda.toFixed(2)) == 0) huellaEnDuda = 0;
    if (parseFloat(huellaFaltante.toFixed(2)) == 0) huellaFaltante = 0;
  }

  // Si la huella faltante es menor a 0, entonces cambiar el título
  if (huellaFaltante <= 0) {
    document.getElementById("navbar-title").innerHTML =
      "¡Excelente! ¡Ya has eliminado tu huella de carbono! Aun así, toma en cuenta el margen de error posible.";
    setTimeout(() => {
      $("#barraAmarilla").tooltip("show");
      setTimeout(() => $("#barraAmarilla").tooltip("hide"), 3500);
    }, 700);
  } else {
    document.getElementById("navbar-title").innerHTML = "Toneladas de CO2 que emites al año:";
  }

  // Actualizar el texto de resumen
  resumen.innerHTML =
    huellaFaltante != ghgPerCapita
      ? `Reducción en promedio: <span class="badge badge-success" data-toggle="tooltip" data-placement="bottom" title="">${huellaPromedio.toFixed(
          2
        )}</span> tCO2.<br>Reducción teórica máxima: <span class="badge badge-success" data-toggle="tooltip" data-placement="bottom" title="">${huellaEnDuda.toFixed(
          2
        )}</span> tCO2 y mínima: <span class="badge badge-${
          huellaReducida < 0 ? "danger" : "success"
        }" data-toggle="tooltip" data-placement="bottom" title="">${huellaReducida.toFixed(2)}</span> tCO2`
      : "";
  $('[data-toggle="tooltip"]').tooltip();

  // Añade un padding cuando las barras no son 0
  if (huellaFaltante == ghgPerCapita) {
    barraVerde.classList.remove("pl-2");
    barraAmarilla.classList.remove("pl-2");
    barraPromedio.classList.remove("pl-2");
  } else {
    if (huellaReducida > 0.1) {
      barraVerde.classList.add("pl-2");
    } else {
      barraVerde.classList.remove("pl-2");
    }
    barraAmarilla.classList.add("pl-2");
    barraPromedio.classList.add("pl-2");
  }

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

  // Actualizo el alto de la barra de espacio, esa que hace que el navbar no tape ningún elemento de hasta arriba
  document.getElementById("espacioNavbar").style.height = `${document.getElementById("navbar").clientHeight}px`;
}

(function ($) {
  // size = flag size + spacing
  var default_size = {
    w: 20,
    h: 15,
  };

  function calcPos(letter, size) {
    return -(letter.toLowerCase().charCodeAt(0) - 97) * size;
  }

  $.fn.setFlagPosition = function (iso, size) {
    size || (size = default_size);

    var x = calcPos(iso[1], size.w),
      y = calcPos(iso[0], size.h);

    return $(this).css("background-position", [x, "px ", y, "px"].join(""));
  };
})(jQuery);

// USAGE:

(function ($) {
  $(function () {
    var $target = $(".country");

    // on load:
    // $target.find("i").setFlagPosition("es");

    $("select").change(function () {
      $target.find("i").setFlagPosition(this.value);
      // $target.find("b").text($(this).find(":selected").text());
    });
  });
})(jQuery);
