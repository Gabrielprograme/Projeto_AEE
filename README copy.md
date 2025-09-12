# Sistema AEE - Atendimento Educacional Especializado

Um sistema completo e profissional para gestão de Atendimento Educacional Especializado, desenvolvido com React, Next.js e TypeScript.

## 🎯 Funcionalidades Principais

### 👨‍💼 Administrador
- **Controle Total**: Gerencia todos os usuários do sistema
- **Criação de Usuários**: Cria contas para professores
- **Edição e Exclusão**: Pode editar ou excluir qualquer usuário (exceto outros admins)
- **Relatórios**: Acesso a estatísticas e relatórios do sistema
- **Backup em Excel**: Exporta e importa dados em planilhas Excel
- **Configurações**: Gerencia configurações gerais do sistema

### 👩‍🏫 Professor
- **Gestão de Pais**: Cria contas para pais/responsáveis
- **Cadastro de Alunos**: Registra alunos e suas necessidades especiais
- **Planejamento de Atividades**: Cria e gerencia atividades educacionais
- **Comunicação**: Troca mensagens com pais/responsáveis
- **Acompanhamento**: Monitora progresso dos alunos
- **Relatórios**: Gera relatórios de atividades e progresso

### 👨‍👩‍👧‍👦 Pais/Responsáveis
- **Acompanhamento do Filho**: Visualiza informações do aluno
- **Progresso**: Acompanha atividades e desenvolvimento
- **Comunicação**: Troca mensagens com professores
- **Feedback**: Recebe avaliações e comentários das atividades
- **Histórico**: Acessa histórico completo de atividades

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, Next.js 14, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Componentes**: Radix UI primitives
- **Temas**: next-themes (modo claro/escuro)
- **Ícones**: Lucide React
- **Armazenamento**: LocalStorage + Excel (XLSX)
- **Fontes**: Geist Sans & Mono

## 🎨 Design System

### Paleta de Cores
- **Primária**: Verde educacional (#059669)
- **Secundária**: Verde claro (#10b981)
- **Neutros**: Branco, cinzas e preto
- **Modo Escuro**: Suporte completo com preferência do sistema

### Tipografia
- **Headings**: Geist Sans (múltiplos pesos)
- **Corpo**: Geist Sans (legibilidade otimizada)
- **Código**: Geist Mono

## 📱 Responsividade

O sistema é 100% responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🔐 Sistema de Autenticação

### Tipos de Usuário
1. **Admin** (máximo 5): Controle total do sistema
2. **Professor** (ilimitado): Gerencia alunos e pais
3. **Pai/Responsável** (ilimitado): Acompanha filho(s)

### Credenciais de Demonstração
\`\`\`
Admin:
- Email: admin@aee.edu.br
- Senha: admin123

Professor:
- Email: prof1@aee.edu.br
- Senha: prof123

Pai/Responsável:
- Email: pai1@email.com
- Senha: pai123
\`\`\`

## 💾 Armazenamento de Dados

### Sistema Excel
- **Backup Automático**: Gera arquivos Excel periodicamente
- **Exportação Manual**: Download de todos os dados
- **Importação**: Restaura dados de arquivos Excel
- **Estrutura Organizada**: 4 planilhas (Usuários, Alunos, Atividades, Mensagens)

### Planilhas Incluídas
1. **Usuários**: Dados de login e perfis
2. **Alunos**: Informações acadêmicas e necessidades especiais
3. **Atividades**: Planejamento e acompanhamento pedagógico
4. **Mensagens**: Comunicação entre usuários

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
\`\`\`bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Acesse http://localhost:3000
\`\`\`

### Build para Produção
\`\`\`bash
# Gere build otimizado
npm run build

# Execute em produção
npm start
\`\`\`

## 🔧 Configuração

### Variáveis de Ambiente
Não são necessárias variáveis de ambiente para funcionamento básico. O sistema usa localStorage para persistência de dados.

### Personalização
- **Cores**: Edite `app/globals.css` para alterar o tema
- **Componentes**: Modifique componentes em `components/ui/`
- **Lógica**: Ajuste serviços em `lib/`

## 📊 Funcionalidades Detalhadas

### Dashboard Administrativo
- Estatísticas em tempo real
- Gráficos de usuários por tipo
- Log de atividades recentes
- Ferramentas de backup/restore
- Configurações do sistema

### Dashboard do Professor
- Visão geral dos alunos
- Criação de atividades personalizadas
- Sistema de mensagens integrado
- Relatórios de progresso
- Gestão de pais/responsáveis

### Dashboard dos Pais
- Informações detalhadas do filho
- Acompanhamento de atividades
- Histórico de progresso
- Comunicação direta com professores
- Feedback das atividades

## 🔒 Segurança

### Controle de Acesso
- Autenticação obrigatória
- Níveis de permissão por tipo de usuário
- Sessões seguras com localStorage
- Validação de dados em todas as operações

### Proteção de Dados
- Backup automático em Excel
- Validação de integridade dos dados
- Criptografia de senhas (simulada)
- Logs de atividades do sistema

## 🎯 Casos de Uso

### Cenário 1: Novo Aluno
1. Admin cria conta do professor
2. Professor cria conta dos pais
3. Professor cadastra o aluno
4. Professor planeja atividades
5. Pais acompanham progresso

### Cenário 2: Atividade Educacional
1. Professor cria atividade personalizada
2. Define objetivos e descrição
3. Executa com o aluno
4. Registra feedback e avaliação
5. Pais recebem relatório

### Cenário 3: Comunicação
1. Pai envia mensagem ao professor
2. Professor responde com orientações
3. Histórico fica registrado
4. Ambos podem acessar conversa completa

## 📈 Relatórios e Analytics

### Métricas Disponíveis
- Total de usuários por tipo
- Atividades concluídas vs planejadas
- Taxa de engajamento dos pais
- Progresso individual dos alunos
- Estatísticas de comunicação

### Exportação de Dados
- Relatórios em Excel
- Dados estruturados por planilha
- Histórico completo preservado
- Backup automático configurável

## 🤝 Suporte e Manutenção

### Recursos de Ajuda
- Interface intuitiva e autoexplicativa
- Tooltips e descrições contextuais
- Mensagens de erro claras
- Validação em tempo real

### Manutenção
- Código bem documentado
- Arquitetura modular
- Componentes reutilizáveis
- Fácil extensibilidade

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais e de demonstração. Todos os direitos reservados.

## 🚀 Próximas Funcionalidades

- [ ] Integração com banco de dados real
- [ ] Sistema de notificações push
- [ ] Relatórios avançados com gráficos
- [ ] Upload de arquivos e documentos
- [ ] Calendário de atividades
- [ ] Sistema de avaliações mais detalhado
- [ ] Integração com APIs educacionais
- [ ] Modo offline com sincronização

---

**Desenvolvido com ❤️ para a educação especial brasileira**
