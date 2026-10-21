# DnD Hub - Frontend (React + Bootstrap + D&D Theme)

Este é o frontend do ecossistema DnD Hub / Dndmanager, projetado para oferecer uma interface rica, responsiva e imersiva para jogadores e mestres de D&D 5e e 5.5e.

## 🛠️ Tecnologias Utilizadas
- **React 19** com **Vite**
- **Bootstrap 5** (Grid e componentes de formulários, cards e utilitários)
- **Bootstrap Icons** (Ícones de proteção, dados, pergaminhos e chaves)
- **CSS Puro (`dnd-theme.css`)** com paleta medieval/fantasia, tipografia Cinzel e efeitos de glassmorphism
- **Axios** com interceptores para injeção automática de tokens JWT
- **Context API** para gerenciamento de autenticação e sessão

## 🔌 Integração com o Backend

O frontend se comunica com os dois microsserviços do backend:

1. **`dndmanager` (Porta padrão: `8080`)**:
   - `POST /auth/login`: Autentica o aventureiro e retorna o token JWT `{ token }`.
   - `POST /usuarios`: Cadastra um novo aventureiro `{ nome, email, senha }`.
   - `GET /usuarios/me`: Endpoint protegido que valida a autenticação (`Authorization: Bearer <token>`).
   - `POST /personagens`: Criação e gerenciamento de fichas de personagens.
   - `GET /personagens/rolagens`: Rolagens de atributos através do backend.

2. **`APIdados` (Porta padrão: `8081`)**:
   - `GET /api/rolagens/atributos`: Microsserviço de rolagem de dados (4d6 drop lowest).

## 🚀 Como Executar

### 1. Pré-requisitos
Certifique-se de que o Node.js está instalado.

### 2. Instalação de Dependências
Dentro do diretório `frontend`:
```bash
npm install
```

### 3. Variáveis de Ambiente
O arquivo `.env` já vem pré-configurado com:
```env
VITE_DNDMANAGER_API_URL=http://localhost:8080
VITE_APIDADOS_URL=http://localhost:8081
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O frontend estará acessível na URL indicada pelo Vite (geralmente `http://localhost:5173`).

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── api/
│   │   ├── apiClient.js      # Instâncias Axios e interceptores para JWT
│   │   ├── authService.js    # Login, cadastro, verificação e logout
│   │   └── dndService.js     # Integração com personagens e APIdados
│   ├── components/
│   │   └── Navbar.jsx        # Barra de navegação tematica
│   ├── context/
│   │   └── AuthContext.jsx   # Estado global de autenticação
│   ├── pages/
│   │   ├── Login.jsx         # Tela de Login com Bootstrap
│   │   ├── Register.jsx      # Tela de Cadastro com validação
│   │   └── Dashboard.jsx     # Taverna / Teste de conexão e token
│   ├── styles/
│   │   └── dnd-theme.css     # CSS puro customizado para tema D&D
│   ├── App.jsx               # Gerenciador de telas
│   ├── index.css             # Base reset
│   └── main.jsx              # Ponto de entrada
├── .env                      # Variáveis de ambiente
├── .env.example              # Modelo das variáveis
└── package.json
```
