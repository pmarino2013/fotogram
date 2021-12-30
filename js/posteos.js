class Publicacion {
  constructor(id, usuario, detalle, imagen, like = 0, userLike = []) {
    this.id = id;
    this.usuario = usuario;
    this.detalle = detalle;
    this.img = imagen;
    this.like = like;
    this.userLike = userLike;
  }
}

// let datos = [
//   {
//     id: 1,
//     usuario: "suzukigame",
//     detalle: "Imagen de paisaje bonito",
//     img: "https://www.nationalgeographic.com.es/medio/2021/05/05/lago-wanakanueva-zelanda_3bca218b_800x800.jpg",
//     like: 0,
//     userLike: [],
//   },
//   {
//     id: 2,
//     usuario: "miraflores",
//     detalle: "Paisaje exótico",
//     img: "http://2.bp.blogspot.com/-8KuSaGEYEMs/UPSuL75AdoI/AAAAAAAAOLI/8Bb7HfkOQXU/s1600/nuevos+paisajes+floridos+con+carretera.jpg",
//     like: 0,
//     userLike: [],
//   },
//   {
//     id: 3,
//     usuario: "pmarino",
//     detalle: "Paisaje vistoso",
//     img: "https://www.jardineriaon.com/wp-content/uploads/2020/11/paisajes-naturales.jpg",
//     like: 0,
//     userLike: [],
//   },
// ];

// const inicializarDatos = function (datos) {
//   localStorage.setItem("posteos", JSON.stringify(datos));
// };

let datos = JSON.parse(localStorage.getItem("posteos")) || [];

let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
// console.log(usuario);

//--------Si el usuario no está logueado
let menuPrincipal = document.querySelector("#menuPrincipal");

if (!usuario) {
  menuPrincipal.innerHTML = "";
}
//---------------------------------------

let contenedor_avatar = document.querySelector("#card_avatar");
let contenedor_cards = document.querySelector("#contenedor_cards");

let imgRota = false;

let myModal = new bootstrap.Modal(document.getElementById("nuevaPublic"), {
  keyboard: false,
});

// let div = document.createElement("div");
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
</div>
`;

// div.innerHTML = estructura_avatar;
// contenedor_avatar.appendChild(div);
contenedor_avatar.innerHTML = estructura_avatar;

//Crear Tarjetas--------------------------------------
const crearCards = function () {
  //limpiamos contenedor
  contenedor_cards.innerHTML = "";

  datos.map(function (item) {
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
             </div> 
        `;

    card.innerHTML = contenido_card;
    contenedor_cards.appendChild(card);
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

  console.log(validarUsuario);
  //Si el usuario no le dio Like
  console.log(datos[indice].userLike.indexOf(validarUsuario));
  if (!validarUsuario) {
    datos[indice].like += 1;
    datos[indice].userLike.push(usuario.username);
  } else {
    datos[indice].like -= 1;
    let indiceUsuario = datos[indice].userLike.indexOf(validarUsuario);
    datos[indice].userLike.splice(indiceUsuario, 1);
  }

  localStorage.setItem("posteos", JSON.stringify(datos));
  crearCards();
};

//funcion parea agregar imagen en el modal
const agregarImagen = function (e) {
  //capturo el campo texto del modal
  let campo = document.querySelector("#text_modal");

  //pregunto si la tecla que se presionó es el enter
  // y si el campo de texto tiene algo escrito
  if (e.keyCode === 13 && campo.value.length > 0) {
    //actualizo la imagen con la url que escribí en el campo de texto
    document.querySelector("#img_modal").src = campo.value;
  }
};

//Guardar publicacion
const guardarPublicacion = function () {
  let id = new Date().getTime();
  let user = usuario.username;
  let detalle = document.querySelector("#modal_textarea").value;
  let imagen = document.querySelector("#img_modal").src;

  //si la imagen es la por defecto o imgRota está en true
  if (imagen === "http://127.0.0.1:5500/img/error_img.png" || imgRota) {
    return alert("Imagen no válida");
  }

  //Si el detalle o descripcion de la imagen tiene menos de 10 caracteres
  if (detalle.length < 10) {
    return alert("La descripción debe tener un mínimo de 10 caracteres");
  }

  //agregamos la publicacion al principio
  datos.unshift(new Publicacion(id, user, detalle, imagen));
  //Guardamos en localStorage
  localStorage.setItem("posteos", JSON.stringify(datos));
  //Cargamos las tarjetas actualizadas
  crearCards();
  //limpiamos el modal
  limpiarModal();
};

//limpiamos el modal y lo dejamos listo para otra carga
const limpiarModal = function () {
  document.querySelector("#text_modal").value = "";
  document.querySelector("#img_modal").src = "../img/error_img.png";
  document.querySelector("#modal_textarea").value = "";
  imgRota = false;
  myModal.hide();
};

//-----------Sección de eventListeners----------------------------

//Mostrar modal cuando hacemos click en la opción del navbar
document.querySelector("#addPublic").addEventListener("click", function () {
  myModal.show();
});

//Cuando damos enter en el input para cargar la imagen del modal
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

//deslogueo de la app---------------------------------
document.querySelector("#logout").addEventListener("click", function () {
  localStorage.removeItem("usuario");
  location.replace("../index.html");
});

crearCards();
// inicializarDatos(datos);
