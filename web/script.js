import api from './api.js';

const usuario = document.getElementById('login');
const senha = document.getElementById('senha');

const jwtDecode = () => {
    const token = localStorage.getItem("token").split(".")[1];
    const user = JSON.parse(atob(token)); //ele deixa o token mais simples
    console.log(user);
}
const login = () => {
    api //puxa do axios
    .post("/login", {
        user:"usuario@gmail.com",
        psw:"a1b2@b3c4"
    }) //ele redireciona para o login
    .then(res =>{ //vai esperar o post
        localStorage.setItem("token", res.data.token); //guarda o token no local storage
        jwtDecode();
        getPosts();
    })
    .catch(err => { 
        console.log(err); //se der erro, ele vai mostrar o erro
    });
}

function validar(){
    const token = localStorage.getItem('jwtToken');

    if(login.user != usuario || login.psw != senha){
        alert('Dados incorretos, tenta novamente')
    }
}

const getPosts = () =>{
    api
    .get("posts")
    .then(res => {
        console.log(res);
        
    })
    .catch(err => {
        console
    })
}



login();