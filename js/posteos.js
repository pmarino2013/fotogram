//clase para crear publicaciones
class Publicacion {
  constructor(id, usuario, detalle, img, like = 0, userLike = []) {
    this.id = id;
    this.usuario = usuario;
    this.detalle = detalle;
    this.img = img;
    this.like = like;
    this.userLike = userLike;
  }
}

//Clase para crear comentarios
class Comentario {
  constructor(id, id_foto, usuario, comentario) {
    this.id = id;
    this.id_foto = id_foto;
    this.usuario = usuario;
    this.comentario = comentario;
  }
}

//traemos las fotos desde localstorage
let datos = JSON.parse(localStorage.getItem("posteos")) || [];
//traemos todos los usuarios desde localStorage
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//Obtenemos los datos del usuario logueado
let usuario = JSON.parse(localStorage.getItem("usuario") || null);

//----------------Menu-------------------
let menuPrincipal = document.querySelector("#menu");
if (!usuario) {
  menuPrincipal.innerHTML = "";
}

//Obtener comentarios
let coment = JSON.parse(localStorage.getItem("comentarios")) || [];

//Capturamos el contenedor para los datos de usuario
let contenedor_avatar = document.querySelector("#card_avatar");

//Capturamos contenedor para las cards
let contenedor_cards = document.querySelector("#contenedor_cards");

//---variable si la imagen que se agrega está rota-----------
let imgRota = false;

//capturamos el modal que usamos para agregar publicaciones
let myModal = new bootstrap.Modal(document.getElementById("nuevaPublic"), {
  keyboard: false,
});

//creamos estructura con la info del usuario
let estructura_avatar = `
<div>
<img
class="avatar"
src="../img/${usuario.avatar}.png"
/>
</div>
<div>
<span class="fw-bold">${usuario.username}</span>
<p class="text-muted">${usuario.email}</p>
${
  usuario.username === "admin"
    ? '<a href="../pages/admin.html">Administración</a>'
    : ""
}

</div>
`;

//agregamos la estructura de la card con datos del usuario a su contenedor
contenedor_avatar.innerHTML = estructura_avatar;

//Crear Tarjetas--------------------------------------
const crearCards = function (array) {
  //limpiamos contenedor
  contenedor_cards.innerHTML = "";

  //--------------Mostrar solo usuarios activos---------------------
  let usuariosActivos = usuarios.filter(function (user) {
    return user.activo === true;
  });

  let arregloNuevo = array.map(function (user) {
    for (const item of usuariosActivos) {
      if (item.username === user.usuario) {
        return user;
      }
    }
  });
  let posteosActivos = arregloNuevo.filter(function (post) {
    return post !== undefined;
  });

  //----------------------------------------------------------------

  //si no se encontraron resultados de posteos activos
  if (posteosActivos.length === 0) {
    return (contenedor_cards.innerHTML = `<h4>No se encontraron resultados para la búsqueda</h4>`);
  }
  //----------------------------------------------------
  // array.map(function (item) {
  posteosActivos.map(function (item) {
    let card = document.createElement("div");
    card.classList = "card mb-3";
    let contenido_card = `
        <div class="card-header">${item.usuario}</div>
              <img
                src=${item.img}
                class="card-img-top"
                alt=${item.detalle}
              />
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div>
                   <span class="like" onclick="meGusta(${item.id})">
                 ${
                   corazonRojo(item)
                     ? '<i class="fa fa-heart text-danger" aria-hidden="true"></i>'
                     : '<i class="fa fa-heart-o" aria-hidden="true"></i>'
                 }
                  </span>

                </div>
                <div>
                  ${item.detalle}
                </div>
            </div>
              <p>${item.like} Me gusta</p>

              <div id="contenedor_parrafo${item.id}">
              </div>
             


            </div>
        <div class="card-footer d-flex align-items-center">
          <div class="col-10">
            <textarea class="form-control" id="textarea${
              item.id
            }" rows="1" placeholder="Agregar un comentario"></textarea>
          </div>
          <div class="col-2 ms-2">
              <span class="text-primary" role="button"  onclick="crearComentario(${
                item.id
              })">Publicar</span>
          
          </div>
        </div>   
        `;

    card.innerHTML = contenido_card;
    contenedor_cards.appendChild(card);
    mostrarComentario(item.id);
  });
};

//funcion corazon rojo----------------
const corazonRojo = function (item) {
  let encontrarUsuario = item.userLike.find(function (user) {
    return user === usuario.username;
  });
  return encontrarUsuario;
};

//-----------------------------------

//Funcion me gusta cuando hacemos clic en el corazon
const meGusta = function (id) {
  //obtengo posicion de la foto en el arreglo de datos
  let indice = datos.findIndex(function (item) {
    return item.id === id;
  });

  //chequeo que el usuario logueado no exista en el arreglo de usuarios que dieron me gusta
  let validarUsuario = datos[indice].userLike.find(function (item) {
    return item === usuario.username;
  });

  //Si el usuario no le dio Like
  if (!validarUsuario) {
    datos[indice].like += 1;
    datos[indice].userLike.push(usuario.username);
  } else {
    datos[indice].like -= 1;

    //----borrar usuario del arreglo userLike-----

    //buscar el indice del usuaario en el arreglo
    let indiceUser = datos[indice].userLike.findIndex(function (user) {
      return user === usuario.username;
    });
    //borrar el usuario con su indice
    datos[indice].userLike.splice(indiceUser, 1);
  }

  //guardar cambios en localstorage y recargar tarjetas
  localStorage.setItem("posteos", JSON.stringify(datos));
  crearCards(datos);
};

//Función agregar imagen------------------------
const agregarImagen = function (e) {
  let campo = document.querySelector("#text_modal");

  if (e.keyCode === 13) {
    document.querySelector("#img_modal").src = campo.value;
  }
};
//--------------------------------------------------

//Funcion Guardar publicacion----------------------------
const guardarPublicacion = function () {
  let id = new Date().getTime();
  let user = usuario.username;
  let detalle = document.querySelector("#modal_textarea").value;
  let imagen = document.querySelector("#img_modal").src;

  if (imagen === "http://127.0.0.1:5500/img/error_img.png" || imgRota) {
    return alert("La imagen no es válida");
  }
  if (detalle.length < 10) {
    return alert("La descripción debe tener más de 10 caracteres");
  }

  datos.unshift(new Publicacion(id, user, detalle, imagen));
  localStorage.setItem("posteos", JSON.stringify(datos));
  crearCards(datos);

  limpiarModal();
};

//-------------------------------------------------------

//-------Limpiar Modal---------------------
const limpiarModal = function () {
  document.querySelector("#text_modal").value = "";
  document.querySelector("#img_modal").src = "../img/error_img.png";

  document.querySelector("#modal_textarea").value = "";
  imgRota = false;
  myModal.hide();
};
//----------------------------------------------------

//----buscar usuario---------------------------

const buscarUsuario = function (e) {
  e.preventDefault();
  let buscado = document.querySelector("#inputBuscar").value;

  let resultado = datos.filter(function (foto) {
    return foto.usuario.toUpperCase().includes(buscado.toUpperCase());
  });

  console.log(resultado);
  crearCards(resultado);
};
//---------------------------------

//------Crear comentario------------------

const crearComentario = function (id) {
  let id_comentario = new Date().getTime();
  let id_foto = id;
  let user = usuario.username;
  let comentario = document.querySelector(`#textarea${id}`).value;

  if (comentario.length > 4) {
    coment.push(new Comentario(id_comentario, id_foto, user, comentario));
    localStorage.setItem("comentarios", JSON.stringify(coment));

    crearCards(datos);
  }
};

//Mostrar comentario-------------------------------
const mostrarComentario = function (id) {
  let comentarios = coment.filter(function (comentario) {
    return comentario.id_foto === id;
  });
  document.querySelector(`#contenedor_parrafo${id}`).innerHTML = "";

  comentarios.map(function (item) {
    let parrafo = document.createElement("p");
    parrafo.innerHTML = `<b>${item.usuario}</b> ${item.comentario}`;
    document.querySelector(`#contenedor_parrafo${id}`).append(parrafo);
  });
};

//Si hacemos click en el boton para agregar publicación
document.querySelector("#addPublic").addEventListener("click", function () {
  myModal.show();
});

//Si presionamos una tecla en el input del modal donde va la imagen
document
  .querySelector("#text_modal")
  .addEventListener("keydown", agregarImagen);

//Cuando hacemos click en el input del modal para cargar la imagen se limpia el campo
//Tambien coloca la imagen por defecto y cambia el valor de imgRota a falso
document.querySelector("#text_modal").addEventListener("click", function () {
  document.querySelector("#text_modal").value = "";
  document.querySelector("#img_modal").src = "../img/error_img.png";
  imgRota = false;
});

//Obtenemos el error cuando la imagen no es correcta y cambiamos el valor de imgRota
document.querySelector("#img_modal").addEventListener("error", function () {
  imgRota = true;
});

//refrescar datos----------------------------------------------------
document.querySelector("#refrescar").addEventListener("click", function () {
  crearCards(datos);
  document.querySelector("#inputBuscar").value = "";
});

//Deslogueo de aplicación----------------------------------------
document.querySelector("#logout").addEventListener("click", function () {
  localStorage.removeItem("usuario");
  location.href = "../index.html";
});

//Carga inicial de fotos
crearCards(datos);
