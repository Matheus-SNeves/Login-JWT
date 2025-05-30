import api from './api.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password'); 
const loginForm = document.getElementById('loginForm'); 

const fazerLogin = async (userEmail, userPassword) => {
    try {
        const resposta = await api.post("/login", {
            user: userEmail,
            psw: userPassword
        });
        localStorage.setItem("token", resposta.data.token); 
        window.location.href = 'home.html'; 
    } catch (erro) {
        console.error("Erro no login:", erro);
        alert('Dados incorretos, tente novamente!');
    }
};

if (loginForm) {
    loginForm.addEventListener('submit', (evento) => {
        evento.preventDefault(); 
        const userEmail = emailInput.value;
        const userPassword = passwordInput.value;
        fazerLogin(userEmail, userPassword);
    });
}