
//traer usuario logueado
let usuario = JSON.parse(localStorage.getItem("usuario")) || null;

//traer los usuarios de la base
let usuarios = JSON.parse(localStorage.getItem("usuarios") || []);

//container
let contenedor = document.querySelector("#contenedor");
//Tbody de la tabla
let contenidoTabla = document.querySelector("#cuerpoTabla");
//Traigo la etiqueta form
let form = document.querySelector("#formulario");

//habilito las funciones del modal
let myModal = new bootstrap.Modal(document.getElementById("updateModal"));

//creo variable que guarda el id del usuario
let indiceUser = null;

//Crear cuerpo de la tabla
const cargarTabla = function () {
  contenidoTabla.innerHTML = "";
  let usuariosActivos = usuarios.filter(function (user) {
    return user.activo === true;
  });
  usuariosActivos.map(function (user, index) {

    let fila = document.createElement("tr");

    let estructura = `
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>
            <img class="avatar" src="../img/${user.imagen}.png" alt=${user.nombre} />
            </td>
            <td>
            <i class="fa fa-pencil-square-o fa-2x text-info" aria-hidden="true" role="button" onclick="abrirModal(${index})"></i>
            <i class="fa fa-trash-o fa-2x text-danger" aria-hidden="true" role="button" onclick="borrarUsuario(${index})"></i>
            </td>
        `;

    fila.innerHTML = estructura;
    contenidoTabla.appendChild(fila);
  });
};


//Función que abre el modal y crea los datos del usuario
const abrirModal = function (indice) {
  myModal.show();
  cargarDatosUser(indice);
};

//Funcion que crea la estructura de los datos en el modal
const cargarDatosUser = function (indice) {
  indiceUser = indice;
  let datos = `
                <div class="mb-2 img_modal_avatar text-center">
                <img  src="../img/${usuarios[indice].imagen}.png" alt=${usuarios[indice].nombre} />
                                
                </div>
                <div class="mb-2">
                <label><b>Correo electrónico</b></label>
                  <input type="email" class="form-control" id="email"  value=${usuarios[indice].email} required>
                  
                </div>
                <div class="mb-2">
                <label><b>Nombre</b></label>
                  <input type="text" class="form-control" id="nombre"  value=${usuarios[indice].nombre} required>
                  
                </div>
                <div class="mb-2">
                <label><b>Username</b></label>
                  <input type="text" class="form-control" id="username"  value=${usuarios[indice].username} required>
                 
                </div>
                
               
                <div class="mb-2">
                <label><b>Cambiar avatar</b></label>
                  <select class="form-select" id="avatar">
                    <option selected disabled value=${usuarios[indice].imagen}>Avatar actual</option>
                    <option value="avatar1">Mujer normal</option>
                    <option value="avatar2">Mujer office</option>
                    <option value="avatar4">Mujer rubia</option>
                    <option value="avatar6">Mujer Geek</option>
                    <option value="avatar3">Hombre profesional</option>
                    <option value="avatar5">Hombre Geek </option>
                  </select>
                  <div class="invalid-feedback">
                    Seleccione su avatar
                  </div>
                </div>
                <div class="d-grid mt-3">
                  <button class="btn btn-primary" type="submit">Actualizar</button>
                  
                </div>
                            
    `;


  form.innerHTML = datos;
};

//Funcion que actualiza los datos del usuario cargado en el modal
const updateUsuario = function (e) {
  e.preventDefault();


  usuarios[indiceUser].nombre = document.querySelector("#nombre").value;
  usuarios[indiceUser].email = document.querySelector("#email").value;
  usuarios[indiceUser].username = document.querySelector("#username").value;
  usuarios[indiceUser].imagen = document.querySelector("#avatar").value;

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  cargarTabla();
  myModal.hide();
};

//Funcion que borra un usuario---------------------------------------------
const borrarUsuario = function (indice) {
  let validar = confirm(
    `Está seguro que quiere eliminar al usuario ${usuarios[indice].nombre}?`
  );

  if (validar) {
    usuarios[indice].activo = false;

    // usuarios.splice(indice, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    cargarTabla();
    alert("Usuario eliminado");
  }
};

//Deslogueo de aplicación----------------------------------------
document.querySelector("#logout").addEventListener("click", function () {
  localStorage.removeItem("usuario");
  location.href = "../index.html";
});

if (!usuario || usuario.username !== "admin") {
  let respuesta = `
  <div class="row mt-5">
  <div class="col text-center">
   <h3>No tiene los permisos para acceder a este contenido</h3>
  </div>
</div>
  `;

  contenedor.innerHTML = respuesta;
} else {
  cargarTabla();
}

