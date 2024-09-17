
function validar() {
    let des = false;
    if (form.actividad.value === "" || form.calorias.value === "") {
        des = true;
    }
    btnguardar.disabled = des;
}
form.addEventListener("keyup", validar);


btnguardar.onclick = async () => {
    let categoria = document.getElementById("categoria").value;
    let descripcion = document.getElementById("descripcion").value;
    let calorias = document.getElementById("costo").value;

    if (descripcion === "" || isNaN(calorias) || calorias <= 0) {
        Swal.fire({ title: "ERROR!", text: "DATOS INCORRECTOS", icon: "error" });
        return;
    }

    let datos = new FormData();
    datos.append("cate", categoria);
    datos.append("descr", descripcion);
    datos.append("calori", calorias);

    if (indiceCa) {
        datos.append("idc", indiceCa);  
        datos.append("action", "actua"); 
    } else {
        datos.append("action", "agregar");
    }

    let respuesta = await fetch("php.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    if (json.success) {
        Swal.fire({ title: "¡REGISTRO ÉXITOSO!", text: json.mensaje, icon: "success" });
        btnguardar.disabled = true;
        mostrarCalorias();
        indiceCa = null;
    } else {
        Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        console.error('Fetch error:', json.error);
    }
    mostrarCal();
};


const mostrarCalorias = async () => {
    const datos2 = new FormData();
    datos2.append("action", "escribir");
    let respuesta = await fetch("php.php", { method: 'POST', body: datos2 });
    let json = await respuesta.json();
    let k = "";
    let index = 0;
    json.data.forEach(o => {
        k += `
          <div class="card text-center w-60 m-auto mt-3 shadow p-2">
              <div class="row">
                  <div class="col text-start">
                      <p><b>Categoria:</b><small> ${o.cate}</small></p>
                      <p><b>Descripcion:</b><small> ${o.descr}</small></p>
                      <p><b>Calorias:</b><small>$ ${parseFloat(o.calori)}</small></p>
                  </div>
                  <div class="col">
                      <button class="btn btn-outline-danger" onclick="eliminarC(${o.idc})"><i class="bi bi-trash3-fill"></i></button>
                      <button class="btn btn-outline-primary" onclick='mostrarCat(${JSON.stringify(o)})'><i class="bi bi-pencil-square"></i></button>
                  </div>
              </div>  
          </div>
        `;
        index++;
    });
    document.getElementById("listaGastos").innerHTML = k;
    mostrarCal();
};


const eliminarC = async (idc) => {
    Swal.fire({
        title: "¿Estás seguro de eliminar?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No"
    }).then(async (result) => {
        if (result.isConfirmed) {
            let datos = new FormData();
            datos.append("idc", idc);
            datos.append("action", "eliminar");
            let respuesta = await fetch("php.php", { method: 'POST', body: datos });
            let result = await respuesta.json();
            if (result.success) {
                Swal.fire({
                    title: "¡Se Elimino Correctamente!", text: "success"
                });
                mostrarCalorias();
            } else {
                console.error("Error al eliminar la Caloria:", result.error);
            }
        }
    });
    mostrarCal();
}
const actualizarContacto = async () => {
    var id = document.querySelector("#id").value;
    var cate = document.getElementById("ecategoria").value;
    var des = document.getElementById("edescripcion").value;
    var cos = document.getElementById("ecosto").value;

    if (des.trim() == "" || cos.trim() == "") {
        Swal.fire({ title: "ERROR", text: "Tienes campos vacíos", icon: "error" });
        return;

    }

    let datos = new FormData();
    datos.append("idc", id);
    datos.append("cate", cate);
    datos.append("descr", des);
    datos.append("calori", cos);

    datos.append("action", 'actua')


    let respuesta = await fetch("php.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    if (json.success) {
        Swal.fire({ title: "¡REGISTRO ÉXITOSO!", text: json.mensaje, icon: "success" });
        btnguardar.disabled = true;
        mostrarCalorias();
        indiceCa = null;
    } else {
        Swal.fire({ title: "ERROR", text: json.mensaje, icon: "error" });
        console.error('Fetch error:', json.error);
    }
    mostrarCal();
}

const mostrarCat = (cate) => {
    document.querySelector("#categoria").value = cate.cate;
    document.querySelector("#descripcion").value = cate.descr;
    document.querySelector("#costo").value = cate.calori;
    indiceCa = cate.idc;
    mostrarCal();
};
/*
function ActuCategorias(index) {
    mostrarCat(index); 
    mostrarCal();
}
*/
const mostrarCal = async () => {
    const datos = new FormData();
    datos.append("action", "calorias");

    let respuesta = await fetch("php.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    let tce = 0;
    let tcc = 0;

    json.data.forEach((m) => {
        if (m.categoria.toLowerCase() === 'ejercicio') {
            tce += parseInt(m.calorias);
        } else if (m.categoria.toLowerCase() === 'comida') {
            tcc += parseInt(m.calorias);
        }
    });

    let dc = tcc - tce;

    document.getElementById("Tcomida").innerHTML = ` ${tcc}`;
    document.getElementById("TEje").innerHTML = ` ${tce}`;
    document.getElementById("Consumidas").innerHTML = ` ${dc}`;
};

