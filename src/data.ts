import { ReceiptEntry } from "./types";

export const initialReceipts: ReceiptEntry[] = [
  {
    id: "rec_1",
    timestamp: "09:42:15_am",
    date: "24_outubro_2023",
    type: "verified",
    promises: [
      "concluir a auditoria de engenharia para o módulo starlight.",
      "zerar a fila de notificações antes do almoço."
    ],
    realities: [
      { text: "auditoria enviada às 09:15.", status: "success" },
      { text: "a fila contém 4 itens no momento.", status: "pending", sub: "não zerado antes do almoço" }
    ],
    alignmentDerivation: "0.0 hrs"
  },
  {
    id: "rec_2",
    timestamp: "12:05:44_pm",
    date: "24_outubro_2023",
    type: "ambient_log",
    promises: [
      "abster-se de tarefas secundárias durante o foco em trabalho profundo."
    ],
    realities: [
      { text: "detectados 3 redirecionamentos de navegador para domínios sociais.", status: "warning" }
    ],
    alignmentDerivation: "+1.5 hrs"
  },
  {
    id: "rec_3",
    timestamp: "04:30:00_pm",
    date: "24_outubro_2023",
    type: "daily_close",
    promises: [
      "arquivar todos os arquivos transitórios no diretório de trabalho.",
      "iniciar o protocolo de backup para o projeto pyxis."
    ],
    realities: [
      { text: "limpeza de diretório confirmada.", status: "success" },
      { text: "backup concluído: 4,2 gb transferidos para o cofre seguro.", status: "success" }
    ],
    alignmentDerivation: "0.0 hrs"
  },
  {
    id: "rec_4",
    timestamp: "02:15:30_pm",
    date: "21_maio_2024",
    type: "ambient_log",
    promises: [
      "finalizar o sistema de design e os tokens globais."
    ],
    realities: [
      { text: "12 abas do chrome de pesquisa sobre teclado mecânico.", status: "warning" }
    ],
    alignmentDerivation: "+3.5 hrs"
  }
];

export interface DesignerProfile {
  id: string;
  name: string;
  specialty: string;
  typicalDistractions: string[];
  typicalTasks: string[];
}

export const designerProfiles: DesignerProfile[] = [
  {
    id: "ux_ui",
    name: "design de produto e ui",
    specialty: "UX/UI Designer",
    typicalDistractions: [
      "ajustando o kerning do logo do projeto por 40 minutos",
      "pesquisando referências de bento grid no dribbble",
      "organizando grupos de camadas no figma com nomes perfeitos",
      "comparando 8 pesos diferentes da fonte geist"
    ],
    typicalTasks: [
      "mapear o fluxo de checkout e tratamento de erros do usuário.",
      "criar o wireframe de alta fidelidade para as configurações da conta.",
      "aprovar os tokens de acessibilidade de cor com o time técnico."
    ]
  },
  {
    id: "frontend",
    name: "desenvolvimento criativo client-side",
    specialty: "Frontend Engineer",
    typicalDistractions: [
      "lendo fóruns de setups de teclados mecânicos split-ortho",
      "reescrevendo a build do vite pela terceira vez na semana",
      "otimizando animações spring do motion no botão invisível",
      "customizando os aliases de comandos git no terminal"
    ],
    typicalTasks: [
      "conectar a integração do firestore com o hook de autenticação.",
      "resolver a lentidão no re-renderizador do canvas interativo.",
      "escrever os testes unitários da rota crítica de pagamentos."
    ]
  },
  {
    id: "brand",
    name: "identidade visual e direção criativa",
    specialty: "Brand Designer",
    typicalDistractions: [
      "scrollando threads sobre o renascimento da tipografia de revista suíça",
      "arquivando referências de design brutalista de pôsteres poloneses",
      "desenhando variações infinitesimais de estrelas geométricas de compasso",
      "organizando pastas do drive com ícones svgs coloridos"
    ],
    typicalTasks: [
      "desenhar o manual de marca definitivo de 24 páginas.",
      "entregar a nova família de ícones vetoriais de precisão.",
      "aprovar o layout das embalagens de alumínio jateado com a gráfica."
    ]
  }
];
