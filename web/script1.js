import api from './api.js';

const elementoNome = document.getElementById('nome');
const elementoAvatar = document.getElementById('avatar');
const containerPosts = document.getElementById('postsContainer');
const botaoSair = document.getElementById('botaoSair'); 

const decodificarJwt = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = 'index.html';
        return null;
    }
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const usuario = JSON.parse(atob(base64));
        console.log(usuario);
        return usuario;
    } catch {
        localStorage.removeItem("token");
        window.location.href = 'index.html';
        return null;
    }
};

const renderizarPosts = (posts) => {
    if (!containerPosts) return;

    containerPosts.innerHTML = '';

    if (posts.length === 0) {
        containerPosts.innerHTML = '<p>Nenhum post encontrado.</p>';
        return;
    }

    posts.forEach(post => {
        const cardPost = document.createElement('div');
        cardPost.classList.add('post-card');
        cardPost.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.summary}</p>
            <div class="post-meta">
                <span>Data: ${new Date(post.date).toLocaleDateString('pt-BR')}</span>
                <span>Visualizações: ${post.views}</span>
                <span>Likes: ${post.likes}</span>
            </div>
        `;
        containerPosts.appendChild(cardPost);
    });
};

const obterPosts = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            localStorage.removeItem("token");
            window.location.href = 'index.html';
            return;
        }

        const resposta = await api.get("posts", {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        renderizarPosts(resposta.data);
    } catch (erro) {
        console.error("Erro ao buscar posts:", erro);
        containerPosts.innerHTML = '<p>Erro ao carregar os posts.</p>';
        if (erro.response && erro.response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            localStorage.removeItem("token");
            window.location.href = 'index.html';
        } else {
            alert('Erro de conexão ou ao processar a requisição.');
            window.location.href = 'index.html';
        }
    }
};

const deslogar = () => {
    localStorage.removeItem("token"); 
    window.location.href = 'index.html'; 
};

document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = decodificarJwt();
    if (usuarioLogado) {
        if (elementoNome) elementoNome.textContent = usuarioLogado.name;
        if (elementoAvatar) {
            elementoAvatar.src = usuarioLogado.avatar;
            elementoAvatar.alt = `Avatar de ${usuarioLogado.name}`;
        }
        obterPosts();
    }
    if (botaoSair) {
        botaoSair.addEventListener('click', deslogar);
    }
});