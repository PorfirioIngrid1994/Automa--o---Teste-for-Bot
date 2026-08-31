/**
 * AutoData Test Lab - Application Logic & Automation Features
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements Reference
  const screenLogin = document.getElementById('screen-login');
  const screenDashboard = document.getElementById('screen-dashboard');
  
  // Login Elements
  const formLogin = document.getElementById('form-login');
  const inputLoginUsuario = document.getElementById('login-usuario');
  const inputLoginSenha = document.getElementById('login-senha');
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const iconTogglePass = document.getElementById('icon-toggle-pass');
  const btnAutofillLogin = document.getElementById('btn-autofill-login');
  const userDisplayName = document.getElementById('user-display-name');
  const btnLogout = document.getElementById('btn-logout');

  // Form Elements
  const formCadastro = document.getElementById('form-cadastro');
  const inputNomeCompleto = document.getElementById('nome_completo');
  const inputCpf = document.getElementById('cpf');
  const inputRg = document.getElementById('rg');
  const inputDataNascimento = document.getElementById('data_nascimento');
  const inputGenero = document.getElementById('genero');
  const inputNomeMae = document.getElementById('nome_mae');
  const inputEmail = document.getElementById('email');
  const inputTelefone = document.getElementById('telefone');
  const inputCanalPreferencial = document.getElementById('canal_preferencial');
  const inputCep = document.getElementById('cep');
  const btnBuscarCep = document.getElementById('btn-buscar-cep');
  const inputLogradouro = document.getElementById('logradouro');
  const inputNumero = document.getElementById('numero');
  const inputComplemento = document.getElementById('complemento');
  const inputBairro = document.getElementById('bairro');
  const inputCidade = document.getElementById('cidade');
  const inputEstado = document.getElementById('estado');
  const inputCargo = document.getElementById('cargo');
  const inputEmpresa = document.getElementById('empresa');
  const inputEscolaridade = document.getElementById('escolaridade');
  const inputRendaMensal = document.getElementById('renda_mensal');
  const rendaDisplay = document.getElementById('renda_display');
  const inputUploadDocumento = document.getElementById('upload_documento');
  const fileNameSelected = document.getElementById('file-name-selected');
  const inputObservacoes = document.getElementById('observacoes');
  const inputAceitaTermos = document.getElementById('aceita_termos');
  const btnCadastrar = document.getElementById('btn-cadastrar');

  // Action Buttons
  const btnFillFakeData = document.getElementById('btn-fill-fake-data');
  const btnClearForm = document.getElementById('btn-clear-form');
  const btnResetFormBottom = document.getElementById('btn-reset-form-bottom');

  // Records Table & Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const recordsCountBadge = document.getElementById('records-count');
  const recordsTbody = document.getElementById('records-tbody');
  const emptyRecordsMsg = document.getElementById('empty-records-msg');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportJson = document.getElementById('btn-export-json');
  const btnClearRecords = document.getElementById('btn-clear-records');

  // Theme & Modal
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const btnCheatSheet = document.getElementById('btn-cheat-sheet');
  const modalCheatSheet = document.getElementById('modal-cheat-sheet');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalOk = document.getElementById('btn-modal-ok');
  const toastContainer = document.getElementById('toast-container');

  // State Management
  let records = JSON.parse(localStorage.getItem('autodata_records') || '[]');

  // =========================================================================
  // 1. TELA DE LOGIN & NAVEGAÇÃO
  // =========================================================================
  
  // Toggle password visibility
  btnTogglePassword.addEventListener('click', () => {
    const isPassword = inputLoginSenha.type === 'password';
    inputLoginSenha.type = isPassword ? 'text' : 'password';
    iconTogglePass.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
  });

  // Preencher login de teste rapidamente
  btnAutofillLogin.addEventListener('click', () => {
    inputLoginUsuario.value = 'admin';
    inputLoginSenha.value = '123456';
    showToast('Credenciais de teste preenchidas!', 'info');
  });

  // Autenticação (Qualquer usuário/senha é aceito para automação)
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = inputLoginUsuario.value.trim() || 'Operador Teste';

    // Salvar sessão simulada
    sessionStorage.setItem('autodata_user', usuario);
    userDisplayName.textContent = usuario;

    // Transição de tela
    screenLogin.classList.remove('active');
    setTimeout(() => {
      screenDashboard.classList.add('active');
      showToast(`Bem-vindo, ${usuario}! Ficha cadastral liberada.`, 'success');
      renderRecordsTable();
    }, 150);
  });

  // Logout
  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('autodata_user');
    screenDashboard.classList.remove('active');
    setTimeout(() => {
      screenLogin.classList.add('active');
      showToast('Sessão encerrada com sucesso.', 'info');
    }, 150);
  });

  // Restaurar sessão se já estiver logado
  const savedUser = sessionStorage.getItem('autodata_user');
  if (savedUser) {
    userDisplayName.textContent = savedUser;
    screenLogin.classList.remove('active');
    screenDashboard.classList.add('active');
    renderRecordsTable();
  }

  // =========================================================================
  // 2. MÁSCARAS & FORMATADORES DE ENTRADA
  // =========================================================================

  // Máscara CPF: 000.000.000-00
  inputCpf.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
  });

  // Máscara Telefone: (00) 00000-0000
  inputTelefone.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    e.target.value = value;
  });

  // Máscara CEP: 00000-000
  inputCep.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
  });

  // Renda Range Display Sync
  inputRendaMensal.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    rendaDisplay.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  });

  // File Upload Name Display
  inputUploadDocumento.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileNameSelected.textContent = `Arquivo selecionado: ${e.target.files[0].name}`;
    } else {
      fileNameSelected.textContent = '';
    }
  });

  // Simular busca de CEP
  btnBuscarCep.addEventListener('click', () => {
    const cepVal = inputCep.value.replace(/\D/g, '');
    if (cepVal.length < 8) {
      showToast('Digite um CEP válido com 8 dígitos.', 'danger');
      return;
    }
    inputLogradouro.value = 'Avenida Paulista';
    inputBairro.value = 'Bela Vista';
    inputCidade.value = 'São Paulo';
    inputEstado.value = 'SP';
    if (!inputNumero.value) inputNumero.value = '1500';
    showToast('Endereço localizado via CEP (Simulação)!', 'success');
  });

  // =========================================================================
  // 3. GERADOR DE DADOS FAKES (AUTO-FILL) PARA AUTOMAÇÃO
  // =========================================================================

  const mockNames = [
    { nome: 'Carlos Eduardo da Silva', genero: 'Masculino', mae: 'Maria Aparecida da Silva' },
    { nome: 'Mariana Oliveira Costa', genero: 'Feminino', mae: 'Ana Rosa Costa' },
    { nome: 'Lucas Gabriel Martins', genero: 'Masculino', mae: 'Patricia Martins' },
    { nome: 'Fernanda Beatriz Souza', genero: 'Feminino', mae: 'Claudia Beatriz Souza' },
    { nome: 'Roberto Alves de Lima', genero: 'Masculino', mae: 'Tereza Alves de Lima' }
  ];

  const mockCargos = [
    'Desenvolvedor Fullstack Python',
    'Engenheiro de Qualidade QA',
    'Analista de Automação RPA',
    'Arquiteto de Software',
    'Gerente de Projetos de TI'
  ];

  const mockEmpresas = ['Tech Innovations', 'SoftData Brasil', 'CyberLab Solutions', 'Nexus Systems'];

  function getRandomCPF() {
    const randomDigits = () => Math.floor(Math.random() * 9);
    let n = Array.from({ length: 9 }, randomDigits);
    let d1 = n.reduce((acc, curr, idx) => acc + curr * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    n.push(d1);
    let d2 = n.reduce((acc, curr, idx) => acc + curr * (11 - idx), 0);
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;
    n.push(d2);
    return `${n.slice(0,3).join('')}.${n.slice(3,6).join('')}.${n.slice(6,9).join('')}-${n.slice(9).join('')}`;
  }

  function fillFakeData() {
    const person = mockNames[Math.floor(Math.random() * mockNames.length)];
    const cargo = mockCargos[Math.floor(Math.random() * mockCargos.length)];
    const empresa = mockEmpresas[Math.floor(Math.random() * mockEmpresas.length)];
    const randNum = Math.floor(1000 + Math.random() * 9000);

    inputNomeCompleto.value = person.nome;
    inputCpf.value = getRandomCPF();
    inputRg.value = `${Math.floor(10 + Math.random() * 89)}.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-X`;
    inputDataNascimento.value = '1992-06-15';
    inputGenero.value = person.genero;
    inputNomeMae.value = person.mae;
    
    // Estado civil radio
    document.getElementById('estado_civil_solteiro').checked = true;

    // Contato
    const firstName = person.nome.split(' ')[0].toLowerCase();
    inputEmail.value = `${firstName}.${randNum}@exemplo.com`;
    inputTelefone.value = `(11) 9${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`;
    inputCanalPreferencial.value = 'WhatsApp';
    document.getElementById('has_whatsapp').checked = true;
    document.getElementById('notificacoes_email').checked = true;

    // Endereço
    inputCep.value = '01310-100';
    inputLogradouro.value = 'Avenida Paulista';
    inputNumero.value = randNum.toString();
    inputComplemento.value = 'Conjunto 402';
    inputBairro.value = 'Bela Vista';
    inputCidade.value = 'São Paulo';
    inputEstado.value = 'SP';

    // Profissional
    inputCargo.value = cargo;
    inputEmpresa.value = empresa;
    inputEscolaridade.value = 'Ensino Superior Completo';
    inputRendaMensal.value = 8500;
    rendaDisplay.textContent = 'R$ 8.500,00';
    document.getElementById('possui_veiculo').checked = true;

    // Plano & Termos
    document.getElementById('plano_pro').checked = true;
    inputObservacoes.value = 'Cadastro inserido via gerador de dados de teste automatizados.';
    inputAceitaTermos.checked = true;

    showToast('Dados de teste preenchidos com sucesso!', 'success');
  }

  btnFillFakeData.addEventListener('click', fillFakeData);

  function resetForm() {
    formCadastro.reset();
    rendaDisplay.textContent = 'R$ 5.500,00';
    fileNameSelected.textContent = '';
    showToast('Formulário limpo.', 'info');
  }

  btnClearForm.addEventListener('click', resetForm);
  btnResetFormBottom.addEventListener('click', resetForm);

  // =========================================================================
  // 4. SUBMISSÃO DO FORMULÁRIO & PERSISTÊNCIA
  // =========================================================================

  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação básica de campos obrigatórios
    if (!inputNomeCompleto.value.trim()) {
      showToast('Por favor, informe o Nome Completo.', 'danger');
      inputNomeCompleto.focus();
      return;
    }
    if (!inputCpf.value.trim()) {
      showToast('Por favor, informe o CPF.', 'danger');
      inputCpf.focus();
      return;
    }
    if (!inputEmail.value.trim()) {
      showToast('Por favor, informe o E-mail.', 'danger');
      inputEmail.focus();
      return;
    }
    if (!inputAceitaTermos.checked) {
      showToast('Você precisa aceitar os Termos de Uso.', 'danger');
      return;
    }

    // Obter radio selecionado do plano
    const planoSelected = document.querySelector('input[name="plano_categoria"]:checked')?.value || 'Básico';

    // Criar Registro Object
    const newRecord = {
      id: 'REG-' + Math.floor(100000 + Math.random() * 900000),
      nome: inputNomeCompleto.value.trim(),
      cpf: inputCpf.value.trim(),
      email: inputEmail.value.trim(),
      telefone: inputTelefone.value.trim(),
      cidade: inputCidade.value.trim() || 'N/A',
      uf: inputEstado.value || 'N/A',
      cargo: inputCargo.value.trim() || 'N/A',
      plano: planoSelected,
      dataHora: new Date().toLocaleString('pt-BR')
    };

    // Salvar no array & localStorage
    records.unshift(newRecord);
    localStorage.setItem('autodata_records', JSON.stringify(records));

    // Feedback
    showToast(`Cadastro salvo com sucesso! ID: #${newRecord.id}`, 'success');
    renderRecordsTable();

    // Ir para a tab de registros para o usuário ver o resultado
    switchTab('tab-registros');
  });

  // =========================================================================
  // 5. RENDERIZAÇÃO DA TABELA DE REGISTROS
  // =========================================================================

  function renderRecordsTable() {
    recordsCountBadge.textContent = records.length;

    if (records.length === 0) {
      recordsTbody.innerHTML = '';
      emptyRecordsMsg.style.display = 'block';
      return;
    }

    emptyRecordsMsg.style.display = 'none';
    recordsTbody.innerHTML = records.map(rec => `
      <tr>
        <td><code>${rec.id}</code></td>
        <td><strong>${escapeHtml(rec.nome)}</strong></td>
        <td>${escapeHtml(rec.cpf)}</td>
        <td>${escapeHtml(rec.email)}</td>
        <td>${escapeHtml(rec.telefone)}</td>
        <td>${escapeHtml(rec.cidade)} / ${escapeHtml(rec.uf)}</td>
        <td><span class="badge">${escapeHtml(rec.plano)}</span></td>
        <td><small>${rec.dataHora}</small></td>
        <td>
          <button class="btn btn-ghost btn-sm btn-delete-rec" data-id="${rec.id}" title="Excluir">
            <i class="ph ph-trash text-danger"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Event listeners para botões de exclusão
    document.querySelectorAll('.btn-delete-rec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteRecord(id);
      });
    });
  }

  function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    localStorage.setItem('autodata_records', JSON.stringify(records));
    renderRecordsTable();
    showToast('Registro excluído.', 'info');
  }

  btnClearRecords.addEventListener('click', () => {
    if (records.length === 0) return;
    if (confirm('Tem certeza que deseja apagar todos os registros de teste?')) {
      records = [];
      localStorage.removeItem('autodata_records');
      renderRecordsTable();
      showToast('Todos os registros foram apagados.', 'info');
    }
  });

  // Exportar CSV
  btnExportCsv.addEventListener('click', () => {
    if (records.length === 0) {
      showToast('Nenhum registro para exportar.', 'danger');
      return;
    }
    const headers = ['ID', 'Nome', 'CPF', 'Email', 'Telefone', 'Cidade', 'UF', 'Cargo', 'Plano', 'DataHora'];
    const rows = records.map(r => [
      r.id, `"${r.nome}"`, `"${r.cpf}"`, `"${r.email}"`, `"${r.telefone}"`, `"${r.cidade}"`, r.uf, `"${r.cargo}"`, r.plano, `"${r.dataHora}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `autodata_registros_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download do arquivo CSV iniciado!', 'success');
  });

  // Exportar JSON
  btnExportJson.addEventListener('click', () => {
    if (records.length === 0) {
      showToast('Nenhum registro para exportar.', 'danger');
      return;
    }
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autodata_registros_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Download do arquivo JSON iniciado!', 'success');
  });

  // =========================================================================
  // 6. NAVEGAÇÃO DE TABS & MODAIS
  // =========================================================================

  function switchTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Modal Cheat Sheet
  btnCheatSheet.addEventListener('click', () => {
    modalCheatSheet.classList.add('active');
  });
  btnCloseModal.addEventListener('click', () => {
    modalCheatSheet.classList.remove('active');
  });
  btnModalOk.addEventListener('click', () => {
    modalCheatSheet.classList.remove('active');
  });
  modalCheatSheet.addEventListener('click', (e) => {
    if (e.target === modalCheatSheet) modalCheatSheet.classList.remove('active');
  });

  // Theme Toggle (Dark / Light)
  btnThemeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'light' ? 'ph ph-sun' : 'ph ph-moon';
    showToast(`Tema ${newTheme === 'light' ? 'Claro' : 'Escuro'} ativado.`, 'info');
  });

  // Helper Toast Notifications
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconClass = type === 'success' ? 'ph-check-circle' : type === 'danger' ? 'ph-warning-circle' : 'ph-info';
    toast.innerHTML = `<i class="ph ${iconClass}"></i> <span>${escapeHtml(message)}</span>`;
    
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
