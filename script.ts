// Interfaces para tipagem dos dados
interface Animal {
    id: number;
    nome: string;
    especie: string;
    raca: string;
    idade: number;
    donoId: number; // Agora referencia o ID do cliente
}

interface Servico {
    id: number;
    tipo: string;
    animalId: number;
    data: string;
    horario: string;
    concluido: boolean;
}

interface Cliente {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
}

// Variáveis globais
let animais: Animal[] = [];
let servicos: Servico[] = [];
let clientes: Cliente[] = [];
let proximoIdAnimal = 1;
let proximoIdServico = 1;
let proximoIdCliente = 1;

// Elementos do DOM
const resultadoDiv = document.getElementById('resultado') as HTMLDivElement;
const totalAnimaisSpan = document.getElementById('total-animais') as HTMLSpanElement;
const totalServicosSpan = document.getElementById('total-servicos') as HTMLSpanElement;

// Funções de atualização da interface
function atualizarContadores(): void {
    totalAnimaisSpan.textContent = animais.length.toString();
    totalServicosSpan.textContent = servicos.filter(s => !s.concluido).length.toString();
}

function mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {
    resultadoDiv.innerHTML = `
        <div class="mensagem ${tipo}">
            ${mensagem}
        </div>
    `;
}

// Funções de Clientes
function mostrarTelaCadastroUsuario(): void {
    resultadoDiv.innerHTML = `
        <div class="form-cadastro">
            <h2>👩‍💼 Cadastrar Cliente</h2>
            <form id="formCliente">
                <input type="text" placeholder="Nome completo" required>
                <input type="tel" placeholder="Telefone" required>
                <input type="email" placeholder="E-mail" required>
                <input type="text" placeholder="Endereço" required>
                <button type="submit">Cadastrar Cliente</button>
            </form>
        </div>
    `;

    const form = document.getElementById('formCliente') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.getElementsByTagName('input');
        
        const novoCliente: Cliente = {
            id: proximoIdCliente++,
            nome: inputs[0].value,
            telefone: inputs[1].value,
            email: inputs[2].value,
            endereco: inputs[3].value
        };

        clientes.push(novoCliente);
        mostrarMensagem(`Cliente ${novoCliente.nome} cadastrado com sucesso!`);
    });
}

function mostrarClientes(): void {
    if (clientes.length === 0) {
        resultadoDiv.innerHTML = '<p>Não há clientes cadastrados</p>';
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="lista">
            <h2>👥 Clientes Cadastrados</h2>
            ${clientes.map(cliente => `
                <div class="item-cliente">
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                    <p><strong>E-mail:</strong> ${cliente.email}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco}</p>
                    <button onclick="editarCliente(${cliente.id})">✏️ Editar</button>
                    <button onclick="excluirCliente(${cliente.id})">🗑️ Excluir</button>
                </div>
            `).join('')}
        </div>
    `;
}

// Funções de Animal (atualizada para usar clientes)
function mostrarTelaCadastroAnimal(): void {
    if (clientes.length === 0) {
        mostrarMensagem('É necessário cadastrar clientes primeiro!', 'erro');
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="form-cadastro">
            <h2>🐕 Cadastrar Animal</h2>
            <form id="formAnimal">
                <input type="text" placeholder="Nome do animal" required>
                <input type="text" placeholder="Espécie" required>
                <input type="text" placeholder="Raça" required>
                <input type="number" placeholder="Idade" required>
                <select required>
                    <option value="">Selecione o dono</option>
                    ${clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                </select>
                <button type="submit">Cadastrar Animal</button>
            </form>
        </div>
    `;

    const form = document.getElementById('formAnimal') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.getElementsByTagName('input');
        const select = form.getElementsByTagName('select')[0];
        
        const novoAnimal: Animal = {
            id: proximoIdAnimal++,
            nome: inputs[0].value,
            especie: inputs[1].value,
            raca: inputs[2].value,
            idade: parseInt(inputs[3].value),
            donoId: parseInt(select.value)
        };

        animais.push(novoAnimal);
        atualizarContadores();
        mostrarMensagem(`Animal ${novoAnimal.nome} cadastrado com sucesso!`);
    });
}

// Funções de Serviço (atualizada para usar animais)
function mostrarTelaAgendarServico(): void {
    if (animais.length === 0) {
        mostrarMensagem('É necessário cadastrar animais primeiro!', 'erro');
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="form-cadastro">
            <h2>🗓️ Agendar Serviço</h2>
            <form id="formServico">
                <select required>
                    <option value="">Selecione o animal</option>
                    ${animais.map(a => {
                        const dono = clientes.find(c => c.id === a.donoId);
                        return `<option value="${a.id}">${a.nome} (Dono: ${dono?.nome || 'Não encontrado'})</option>`;
                    }).join('')}
                </select>
                <select required>
                    <option value="">Tipo de serviço</option>
                    <option value="Banho">Banho</option>
                    <option value="Tosa">Tosa</option>
                    <option value="Veterinário">Veterinário</option>
                    <option value="Adestramento">Adestramento</option>
                    <option value="Hospedagem">Hospedagem</option>
                </select>
                <input type="date" required>
                <input type="time" required>
                <button type="submit">Agendar Serviço</button>
            </form>
        </div>
    `;

    const form = document.getElementById('formServico') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selects = form.getElementsByTagName('select');
        const inputs = form.getElementsByTagName('input');

        const novoServico: Servico = {
            id: proximoIdServico++,
            animalId: parseInt(selects[0].value),
            tipo: selects[1].value,
            data: inputs[0].value,
            horario: inputs[1].value,
            concluido: false
        };

        servicos.push(novoServico);
        atualizarContadores();
        mostrarMensagem(`Serviço de ${novoServico.tipo} agendado com sucesso!`);
    });
}

function mostrarServicosAgendados(): void {
    const servicosPendentes = servicos.filter(s => !s.concluido);
    
    if (servicosPendentes.length === 0) {
        resultadoDiv.innerHTML = '<p>Não há serviços agendados no momento</p>';
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="lista">
            <h2>📋 Serviços Agendados</h2>
            ${servicosPendentes.map(servico => {
                const animal = animais.find(a => a.id === servico.animalId);
                const dono = clientes.find(c => c.id === animal?.donoId);
                return `
                <div class="item-servico">
                    <p><strong>Animal:</strong> ${animal?.nome || 'Não encontrado'}</p>
                    <p><strong>Dono:</strong> ${dono?.nome || 'Não encontrado'}</p>
                    <p><strong>Serviço:</strong> ${servico.tipo}</p>
                    <p><strong>Data:</strong> ${formatarData(servico.data)} às ${servico.horario}</p>
                    <button onclick="concluirServico(${servico.id})">✅ Concluir</button>
                </div>
            `}).join('')}
        </div>
    `;
}

function mostrarAnimaisCadastrados(): void {
    if (animais.length === 0) {
        resultadoDiv.innerHTML = '<p>Não há animais cadastrados</p>';
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="lista">
            <h2>🐾 Animais Cadastrados</h2>
            ${animais.map(animal => {
                const dono = clientes.find(c => c.id === animal.donoId);
                return `
                <div class="item-animal">
                    <p><strong>Nome:</strong> ${animal.nome}</p>
                    <p><strong>Espécie:</strong> ${animal.especie}</p>
                    <p><strong>Raça:</strong> ${animal.raca}</p>
                    <p><strong>Idade:</strong> ${animal.idade} anos</p>
                    <p><strong>Dono:</strong> ${dono?.nome || 'Não encontrado'} (${dono?.telefone || 'N/A'})</p>
                </div>
            `}).join('')}
        </div>
    `;
}

// Funções auxiliares
function formatarData(data: string): string {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

// Funções globais para os botões
(window as any).concluirServico = (id: number): void => {
    servicos = servicos.map(s => 
        s.id === id ? {...s, concluido: true} : s
    );
    atualizarContadores();
    mostrarServicosAgendados();
};

(window as any).editarCliente = (id: number): void => {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    resultadoDiv.innerHTML = `
        <div class="form-cadastro">
            <h2>✏️ Editar Cliente</h2>
            <form id="formEditarCliente">
                <input type="text" value="${cliente.nome}" placeholder="Nome completo" required>
                <input type="tel" value="${cliente.telefone}" placeholder="Telefone" required>
                <input type="email" value="${cliente.email}" placeholder="E-mail" required>
                <input type="text" value="${cliente.endereco}" placeholder="Endereço" required>
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    `;

    const form = document.getElementById('formEditarCliente') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.getElementsByTagName('input');
        
        cliente.nome = inputs[0].value;
        cliente.telefone = inputs[1].value;
        cliente.email = inputs[2].value;
        cliente.endereco = inputs[3].value;

        mostrarMensagem(`Cliente ${cliente.nome} atualizado com sucesso!`);
    });
};

(window as any).excluirCliente = (id: number): void => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        // Verificar se o cliente tem animais cadastrados
        const animaisDoCliente = animais.filter(a => a.donoId === id);
        if (animaisDoCliente.length > 0) {
            mostrarMensagem('Não é possível excluir cliente que possui animais cadastrados!', 'erro');
            return;
        }

        clientes = clientes.filter(c => c.id !== id);
        mostrarClientes();
        mostrarMensagem('Cliente excluído com sucesso!');
    }
};

// Inicialização
atualizarContadores();