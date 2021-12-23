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

let usuario = JSON.parse(localStorage.getItem("usuario"));
// console.log(usuario);

let contenedor_avatar = document.querySelector("#card_avatar");
let contenedor_cards = document.querySelector("#contenedor_cards");

// let div = document.createElement("div");
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

  //Si el usuario no le dio Like
  if (!validarUsuario) {
    datos[indice].like += 1;
    datos[indice].userLike.push(usuario.username);
    localStorage.setItem("posteos", JSON.stringify(datos));
    crearCards();
  }

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

crearCards();
// inicializarDatos(datos);
