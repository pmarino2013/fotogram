class Usuario {
  constructor(nombre, username, email, password, imagen) {
    this.nombre = nombre;
    this.username = username;
    this.email = email;
    this.password = password;
    this.imagen = imagen;
  }
}

let usuarios = [];

let user1 = new Usuario(
  "Pedro",
  "pgonzalez",
  "pedritobueno@gmail.com",
  "pp123456",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI3b7G544olENi0w5Nxr95EW3K3AB5a3t-mbaVh644XQIRNaRXJ2WqHAAHcJPQajU_jmo&usqp=CAU"
);

let user2 = new Usuario(
  "Pablo",
  "Marino",
  "pmarino@gmail.com",
  "pm123456",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfbgCrlhIjWnyLKz3L_XPLblDNG9GqiAn4Ujf5f_6pNx-NwPzURiBtZNItCq3Sgmzj2T0&usqp=CAU"
);
const agregarUsuario = function (user) {
  usuarios.push(user);
};

agregarUsuario(user1);
agregarUsuario(user2);

//form registro-------------------------------------------
let forms = document.querySelectorAll('.needs-validation')
console.log(forms)
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }else{
          event.preventDefault()
            console.log('todo bien')
        }


        form.classList.add('was-validated')
      }, false)
    })

//---------------------------------------------




const validarDatos = function () {
  let inputEmail = document.querySelector("#input_email").value;
  let inputPassword = document.querySelector("#input_password").value;

  let validar_email = usuarios.find(function (usuario) {
    return usuario.email === inputEmail;
  });

  //   console.log(validar_email);
  if (validar_email) {
    if (validar_email.password === inputPassword) {
      console.log("Usuario encontrado");
      let datos = {
        email: validar_email.email,
        username: validar_email.username,
        avatar: validar_email.imagen,
      };
      localStorage.setItem("usuario", JSON.stringify(datos));

      location.replace("./pages/home.html");
    } else {
      alert("Email o contraseña incorrecto");
    }
  } else {
    alert("Email o contraseña incorrecto");
  }
};

document.querySelector("#formulario").addEventListener("submit", function (e) {
  e.preventDefault();
  validarDatos();
});
