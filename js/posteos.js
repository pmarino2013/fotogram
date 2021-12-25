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

//traemos las fotos desde localstorage
let datos = JSON.parse(localStorage.getItem("posteos")) || [];
//Obtenemos los datos del usuario logueado
let usuario = JSON.parse(localStorage.getItem("usuario"));

//Capturamos el contenedor para los datos de usuario
let contenedor_avatar = document.querySelector("#card_avatar");

//Capturamos contenedor para las cards
let contenedor_cards = document.querySelector("#contenedor_cards");

//---variable si la imagen que se agrega está rota-----------
let imgRota = true;

//capturamos el modal que usamos para agregar publivaciones
let myModal = new bootstrap.Modal(document.getElementById("nuevaPublic"), {
  keyboard: false,
});

//creamos estructura con la info del usuario
let estructura_avatar = `
<div>
<img
class="avatar"
src=${usuario.avatar}
/>
</div>
<div>
<span class="fw-bold">${usuario.username}</span>
<p class="text-muted">${usuario.email}</p>
</div>
`;

//agregamos la estructura de la card con datos del usuario a su contenedor
contenedor_avatar.innerHTML = estructura_avatar;

//Crear Tarjetas--------------------------------------
const crearCards = function (array) {
  //limpiamos contenedor
  contenedor_cards.innerHTML = "";

  if (array.length === 0) {
    return (contenedor_cards.innerHTML = `<h4>No se encontraron resultados para la búsqueda</h4>`);
  }
  array.map(function (item) {
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

  //Código anterior---------------------------------------

  // let foto = datos.find(function (item) {
  //   return item.id === id;
  // });

  // let validarUsuario = foto.userLike.find(function (item) {
  //   return item === usuario.username;
  // });

  // if (!validarUsuario) {
  //   foto.like += 1;
  //   foto.userLike.push(usuario.username);

  //   let indice = datos.findIndex(function (item) {
  //     return item.id === id;
  //   });

  //   datos[indice].like = foto.like;
  //   datos[indice].userLike = foto.userLike;
  //   localStorage.setItem("posteos", JSON.stringify(datos));
  //   crearCards();
  // }
};

//Función agregar imagen------------------------
const agregarImagen = function (e) {
  let campo = document.querySelector("#text_modal");
  // imgRota = false;
  if (e.keyCode === 13) {
    console.log(e);
    console.log(campo.value);
    document.querySelector("#img_modal").src = campo.value;

    if (imgRota) {
      alert("La imagen es inválida");
      document.querySelector("#text_modal").value = "";
      document.querySelector("#img_modal").src =
        "https://www.reservacostanera.com.ar/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png";
      imgRota = false;
    }
  }
};
//--------------------------------------------------

//Funcion Guardar publicacion----------------------------
const guardarPublicacion = function () {
  let id = new Date().getTime();
  let user = usuario.username;
  let detalle = document.querySelector("#modal_textarea").value;
  let imagen = document.querySelector("#img_modal").src;
  console.log(imagen);
  if (imagen === "http://127.0.0.1:5500/img/error_img.png") {
    return alert("La imagen no es válida");
  }
  if (detalle.length < 10) {
    return alert("La descripción debe tener más de 10 caracteres");
  }
  console.log("exito");

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

//----buscar usuario-------

const buscarUsuario = function (e) {
  e.preventDefault();
  let buscado = document.querySelector("#inputBuscar").value;

  let resultado = datos.filter(function (foto) {
    return foto.usuario.toUpperCase().includes(buscado.toUpperCase());
  });

  console.log(resultado);
  crearCards(resultado);
};

//Si hacemos click en el boton para agregar publicación
document.querySelector("#addPublic").addEventListener("click", function () {
  myModal.show();
});

//Si presionamos una tecla en el input del modal donde va la imagen
document
  .querySelector("#text_modal")
  .addEventListener("keydown", agregarImagen);

//Obtenemos el error cuando la imagen no es correcta y cambiamos el valor de imgRota
document.querySelector("#img_modal").addEventListener("onerror", function () {
  imgRota = true;
});

document.querySelector("#refrescar").addEventListener("click", function () {
  crearCards(datos);
  document.querySelector("#inputBuscar").value = "";
});

//Carga inicial de fotos
crearCards(datos);
// inicializarDatos(datos);
