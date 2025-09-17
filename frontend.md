# Documentação Frontend - Sistema de Análise de Rede

## Visão Geral

Este projeto é uma aplicação React moderna para análise de dados de rede, construída com TypeScript, Vite e uma arquitetura orientada a componentes. O frontend consome uma API REST baseada em Flask/SQLAlchemy para exibir relatórios e análises interativas.

## Estrutura de Diretórios

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes de interface (shadcn/ui)
│   ├── ChartCard.tsx    # Componente de gráfico interativo
│   ├── CyberBackground.tsx # Fundo com tema cyber
│   ├── DataTable.tsx    # Tabela de dados
│   └── Navigation.tsx   # Navegação principal
├── hooks/               # Hooks customizados
│   ├── use-mobile.tsx   # Hook para detecção mobile
│   └── use-toast.ts     # Hook para notificações
├── lib/                 # Utilitários
│   └── utils.ts         # Funções auxiliares
├── pages/               # Páginas da aplicação
│   ├── Analytics.tsx    # Página de análise com gráficos
│   ├── Index.tsx        # Página inicial
│   ├── NotFound.tsx     # Página 404
│   └── Reports.tsx      # Página de relatórios
├── services/            # Serviços de API
│   └── api.ts           # Serviço de comunicação com backend
├── App.tsx              # Componente raiz
├── index.css            # Estilos globais e design system
└── main.tsx             # Ponto de entrada da aplicação
```

## Tecnologias e Bibliotecas Utilizadas

### Core Framework
- **React 18.3.1**: Biblioteca principal para construção da interface
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Vite**: Build tool moderna e rápida para desenvolvimento

### UI e Estilo
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **shadcn/ui**: Sistema de componentes baseado em Radix UI
- **Lucide React**: Biblioteca de ícones
- **next-themes**: Gerenciamento de temas (dark/light mode)

### Visualização de Dados
- **Recharts**: Biblioteca para criação de gráficos interativos
- **ChartCard**: Componente customizado para exibição de dados

### Roteamento e Estado
- **React Router DOM**: Roteamento client-side
- **React Hook Form**: Gerenciamento de formulários
- **@tanstack/react-query**: Cache e gerenciamento de estado server

### Notificações e UI Avançada
- **Sonner**: Sistema de notificações toast
- **Radix UI**: Componentes acessíveis de baixo nível
- **Class Variance Authority**: Utilitário para variantes de componentes

## Arquitetura da Aplicação

### Comunicação Frontend-Backend

O frontend se comunica com o backend através do serviço `apiService` localizado em `src/services/api.ts`:

```typescript
// Estrutura da API
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Endpoints principais:
// GET /api/v1/jobs - Lista de jobs disponíveis
// GET /api/v1/jobs/{job_id}/reports - Relatórios de um job
// GET /api/v1/jobs/{job_id}/reports/{report_id} - Dados de um relatório
// POST /upload - Upload de arquivos
```

### Fluxo de Dados

1. **Carregamento Inicial**: As páginas fazem requisições para listar jobs disponíveis
2. **Seleção de Job**: Usuário seleciona um job, carregando relatórios disponíveis
3. **Visualização**: Dados são processados e exibidos em componentes especializados

## Componentes Principais

### 1. Analytics.tsx
**Localização**: `src/pages/Analytics.tsx`

**Propósito**: Página principal de análise com visualizações interativas

**Funcionalidades**:
- Seletor de jobs de análise
- Layout vertical com acordeão para organização
- Gráficos "Top 10" configuráveis
- Filtros interativos por categoria e itens específicos

**Configuração de Gráficos**:
```typescript
const CHART_CONFIGS: ChartConfig[] = [
  { id: "T10_E1", title: "Top 10 Firewall Rules", hasCategory: false },
  { id: "T10_E2", title: "Top 10 Rules by Application", hasCategory: true, categoryKey: "Application" },
  // ... mais configurações
];
```

### 2. Reports.tsx
**Localização**: `src/pages/Reports.tsx`

**Propósito**: Visualizador de relatórios estruturados

**Funcionalidades**:
- Painel de seleção de jobs
- Lista de relatórios disponíveis
- Visualizador de dados tabular
- Estados de carregamento e vazio

### 3. ChartCard.tsx
**Localização**: `src/components/ChartCard.tsx`

**Propósito**: Componente reutilizável para exibição de gráficos com filtros

**Características**:
- Auto-detecção de estrutura de dados
- Filtros por categoria (dropdown)
- Seleção múltipla de itens (checkboxes)
- Gráficos de barras responsivos com Recharts

**Lógica de Filtros**:
```typescript
// Filtro por categoria
const categoryFilteredData = selectedCategory === "all" 
  ? data 
  : data.filter(item => item[categoryKey] === selectedCategory);

// Filtro por itens selecionados
const filteredData = selectedItems.size > 0 
  ? categoryFilteredData.filter(item => selectedItems.has(item[nameKey]))
  : categoryFilteredData;
```

### 4. Navigation.tsx
**Localização**: `src/components/Navigation.tsx`

**Propósito**: Barra de navegação principal

**Características**:
- Design responsivo
- Tema cyber com efeitos visuais
- Links para todas as páginas principais

### 5. DataTable.tsx
**Localização**: `src/components/DataTable.tsx`

**Propósito**: Tabela dinâmica para exibição de dados estruturados

**Funcionalidades**:
- Renderização automática baseada na estrutura dos dados
- Responsiva e estilizada com tema do sistema

## Sistema de Design

### Tokens de Design
O sistema utiliza tokens CSS customizados definidos em `index.css`:

```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 167 84% 52%;
  --cyber-glow: 167 84% 52%;
  --gradient-cyber: linear-gradient(135deg, hsl(167 84% 52%), hsl(190 95% 60%));
}
```

### Componentes UI (shadcn/ui)
Localização: `src/components/ui/`

Componentes disponíveis:
- **Button**: Botões com variantes (default, destructive, outline, etc.)
- **Card**: Containers para conteúdo
- **Select**: Dropdowns seletores
- **Accordion**: Painéis expansíveis
- **Checkbox**: Caixas de seleção
- **Toast**: Notificações temporárias
- **Table**: Tabelas estruturadas
- E muitos outros...

## Fluxos de Interação

### 1. Fluxo de Análise (Analytics)
1. Usuário acessa `/analytics`
2. Componente carrega lista de jobs via `apiService.getJobs()`
3. Usuário seleciona um job
4. Para cada gráfico configurado, chama `apiService.getReportData(jobId, reportId)`
5. Dados são passados para `ChartCard` com filtros interativos
6. Usuário pode filtrar por categoria e itens específicos

### 2. Fluxo de Relatórios (Reports)
1. Usuário acessa `/reports`
2. Lista jobs disponíveis
3. Ao selecionar job, carrega relatórios via `apiService.getAvailableReports(jobId)`
4. Usuário seleciona relatório específico
5. Dados são exibidos em `DataTable`

## Padrões de Desenvolvimento

### Gerenciamento de Estado
- Estados locais com `useState` para dados de componente
- `useEffect` para efeitos colaterais e carregamento de dados
- Context API não utilizado (complexidade desnecessária para o escopo atual)

### Tratamento de Erros
- Try-catch em operações assíncronas
- Toast notifications para feedback ao usuário
- Estados de loading para UX melhorada

### Responsividade
- Design mobile-first com Tailwind CSS
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Componentes adaptáveis automaticamente

## Performance e Otimizações

### Carregamento de Dados
- Dados são carregados sob demanda
- Cache básico através de React Query (quando configurado)
- Evita re-renderizações desnecessárias com `useCallback` e `useMemo`

### Bundle Splitting
- Vite automaticamente otimiza o bundle
- Componentes são importados de forma tree-shakeable
- Ícones Lucide importados individualmente

## Extensibilidade

### Adicionando Novos Gráficos
1. Adicionar configuração em `CHART_CONFIGS` no Analytics.tsx
2. O componente `ChartCard` automaticamente se adapta à nova estrutura
3. Backend deve fornecer endpoint correspondente

### Novos Componentes UI
1. Adicionar em `src/components/ui/` seguindo padrão shadcn
2. Utilizar tokens de design do sistema
3. Manter consistência com tema cyber

### Novas Páginas
1. Criar componente em `src/pages/`
2. Adicionar rota em `App.tsx`
3. Atualizar navegação se necessário

## Considerações de Segurança

- Sanitização de dados do backend (confiança na API)
- CORS configurado adequadamente
- Validação de tipos com TypeScript
- Tratamento de erros para evitar exposição de informações sensíveis

## Deploy e Build

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

O Vite otimiza automaticamente para produção com:
- Minificação de CSS e JavaScript
- Tree-shaking de código não utilizado
- Otimização de imagens e assets
- Code splitting automático