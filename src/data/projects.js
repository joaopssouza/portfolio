// src/data/projects.js

export const projects = [
  {
    id: 'automacao-qualidade-ar',
    title: 'Monitor de Qualidade do Ar com Arduino',
    description: 'Protótipo de automação para monitoramento da qualidade do ar, desenvolvido no curso Técnico em Automação Industrial (SENAI).',
    imageUrl: '/assets/projects/automacao-qualidade-ar/automacao-arduino-capa.webp',
    projectUrl: '/projeto/automacao-qualidade-ar',
    codeUrl: '',
    details: {
      fullDescription: `
      Este projeto prático, desenvolvido durante o curso <strong>Técnico em Automação Industrial no SENAI</strong>, consiste em um sistema de monitoramento da qualidade do ar. O protótipo foi montado e simulado na plataforma <strong>Tinkercad</strong> e programado em <strong>C/C++</strong> para a placa <strong>Arduino</strong>.
      <br/><br/>
      O objetivo era transformar dados brutos de um sensor em informações úteis e criar um sistema de alerta autônomo, unindo hardware e lógica de programação para resolver um problema prático.
      <br/><br/>
      <strong>Principais funcionalidades implementadas:</strong>
      <ul>
        <li>Leitura e interpretação dos dados do sensor de gás <strong>MQ-135</strong>.</li>
        <li>Exibição do status do ambiente ("Ar Limpo" ou "Contaminado") em um display <strong>LCD 16x2</strong>.</li>
        <li>Ativação automática de um alarme sonoro (<strong>Buzzer</strong>) e visual (<strong>LED</strong>) quando níveis perigosos de contaminação são detectados.</li>
      </ul>
      <p>
        Este projeto foi uma base essencial para compreender a união entre software e hardware, um conceito fundamental para o futuro da <strong>Indústria 4.0 e IoT</strong>.
      </p>
    `,
      images: [
        '/assets/projects/automacao-qualidade-ar/automacao-arduino-2.webp',
        '/assets/projects/automacao-qualidade-ar/automacao-arduino-3.webp',
        '/assets/projects/automacao-qualidade-ar/codigo-em-c++.webp',
      ],
      videos: [
        '/assets/projects/automacao-qualidade-ar/gravacao_tela_2.webm'
      ],
      pdfUrl: null
    }
  },
  {
    id: 'fundamentos-ia',
    title: 'Relatório de Fundamentos da Inteligência Artificial',
    description: 'Projeto acadêmico que explora a Lógica Fuzzy para cálculo de gorjetas e a implementação de uma Rede Neural para classificação.',
    imageUrl: '/assets/projects/fundamentos-ia/fundamentos-ia-capa.webp',
    projectUrl: '/projeto/fundamentos-ia',
    codeUrl: '',
    details: {
      fullDescription: `
      Este relatório prático da disciplina de <strong>Fundamentos da Inteligência Artificial</strong> explora dois conceitos centrais da IA através de implementações práticas.
      <br/><br/>
      A primeira parte do projeto compara duas abordagens para um sistema de cálculo de gorjetas: uma baseada em lógica procedural clássica, implementada em <strong>Octave</strong>, e outra utilizando <strong>Lógica Nebulosa</strong> (Fuzzy Logic) com a biblioteca <strong>scikit-fuzzy</strong> em Python, demonstrando como a lógica fuzzy lida melhor com a subjetividade.
      <br/><br/>
      A segunda parte detalha a construção de uma <strong>Rede Neural Artificial</strong> de camada única em Python com <strong>NumPy</strong>. O projeto implementa um Perceptron com função de ativação sigmoide, que é treinado para realizar uma tarefa de classificação binária, mostrando o processo de aprendizado e ajuste de pesos ao longo de 10.000 iterações.
    `,
      images: [
        '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL_Pagina_01.webp',
        '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL_Pagina_04.webp',
        '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL_Pagina_06.webp',
        '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL_Pagina_10.webp',
        '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL_Pagina_11.webp',
        '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL_Pagina_15.webp',
      ],
      videos: [],
      pdfUrl: '/assets/projects/fundamentos-ia/PORTIFOLIO-FUNDAMENTOS-DA-INTELIGENCIA-ARTIFICIAL.pdf'
    }
  },
  {
    id: 'analise-oo-uml',
    title: 'Relatório de Análise Orientada a Objetos',
    description: 'Relatório acadêmico sobre a modelagem de um sistema de locação de veículos utilizando Diagrama de Classes UML.',
    imageUrl: '/assets/projects/analise-oo-uml/analise-oo-uml-capa.webp',
    projectUrl: '/projeto/analise-oo-uml',
    codeUrl: '',
    details: {
      fullDescription: `
      Este projeto acadêmico da disciplina de <strong>Análise Orientada a Objetos</strong> foca na modelagem de um sistema de locação de veículos utilizando a Unified Modeling Language (UML).
      <br/><br/>
      Com o auxílio da ferramenta <strong>Visual Paradigm Online</strong>, foi construído um Diagrama de Classes para definir as entidades principais do sistema, seus atributos, métodos e os relacionamentos entre elas. O modelo inclui classes como Automóvel, Cliente, Fabricante e Locação, servindo como um blueprint essencial para o desenvolvimento do software.
    `,
      images: [
        '/assets/projects/analise-oo-uml/analise-oo-uml-diagrama-2.webp',
        '/assets/projects/analise-oo-uml/analise-oo-uml-diagrama-3.webp',
        '/assets/projects/analise-oo-uml/analise-oo-uml-diagrama-1.webp'
      ],
      videos: [],
      pdfUrl: '/assets/projects/analise-oo-uml/PORTIFOLIO-Analise-Orientada-a-Objetos.pdf'
    }
  },
  {
    id: 'slowlibrary',
    title: 'Slow Library',
    description: 'Um protótipo de painel administrativo para um sistema de gerenciamento de biblioteca, com foco na interface e experiência do usuário.',
    imageUrl: '/assets/projects/slowlibrary/captura_tela_3.webp',
    projectUrl: '/projeto/slowlibrary',
    codeUrl: 'https://github.com/joaopssouza/SlowLibrary',
    linkPreview: 'https://joaopssouza.github.io/SlowLibrary/',
    details: {
      fullDescription: `
      <p>
        O <strong>Slow Library</strong> é um protótipo de frontend que simula um painel de controle completo para a administração de uma biblioteca. O projeto foi desenvolvido como uma demonstração visual, focando em um design limpo, funcional e na experiência do usuário.
      </p>
      <p>
        Construído com <strong>HTML5, CSS3, e JavaScript</strong>, e estilizado com o framework <strong>Bootstrap</strong>, o painel apresenta de forma estática as funcionalidades essenciais para a gestão de uma biblioteca.
      </p>
      <strong>Funcionalidades simuladas na interface:</strong>
      <ul>
        <li>Um <strong>Dashboard</strong> principal com cartões de estatísticas rápidas (total de livros, empréstimos, usuários ativos, etc.) e seções para recomendações e notícias.</li>
        <li>Telas de gerenciamento para <strong>Acervo</strong>, com busca de livros e listagem.</li>
        <li>Módulos para controle de <strong>Empréstimos e Devoluções</strong>, gestão de <strong>Usuários</strong>, e acompanhamento de <strong>Reservas e Multas</strong>.</li>
        <li>Seções para emissão de <strong>Relatórios</strong> e <strong>Configurações</strong> do sistema.</li>
      </ul>
      <p>
        Este projeto é uma versão de apresentação e não possui integração com banco de dados ou funcionalidades dinâmicas, servindo como uma demonstração das minhas habilidades em desenvolvimento frontend e design de interfaces.
      </p>
    `,
      images: [
        '/assets/projects/slowlibrary/captura_tela_3.webp',
        '/assets/projects/slowlibrary/captura_tela_5.webp',
        '/assets/projects/slowlibrary/captura_tela_6.webp',
      ],
      videos: []
    }
  },
  {
    id: 'petlocaliza',
    title: 'PetLocaliza',
    description: 'Aplicação web para divulgação de animais perdidos e encontrados, com cadastro, filtros e estrutura de PWA.',
    imageUrl: '/assets/projects/petlocaliza/captura_tela_1.webp',
    projectUrl: '/projeto/petlocaliza',
    codeUrl: 'https://github.com/joaopssouza/PetLocaliza',
    linkPreview: 'https://petlocaliza.onrender.com/',
    details: {
      fullDescription: `
      <p>
        O <strong>PetLocaliza</strong> é uma aplicação web completa desenvolvida para ajudar a comunidade a divulgar e encontrar animais perdidos ou achados. Com uma interface simples e responsiva, o projeto permite que os usuários cadastrem informações e fotos dos pets, que ficam disponíveis para consulta pública.
      </p>
      <p>
        O backend foi construído em <strong>PHP</strong>, responsável por gerenciar o upload de imagens e a persistência dos dados, que são armazenados em um arquivo <strong>JSON</strong>. Essa abordagem torna o sistema leve e facilmente migrável para bancos de dados NoSQL como Firebase ou MongoDB. O frontend utiliza <strong>HTML5, CSS3 e JavaScript</strong> para criar uma experiência de usuário dinâmica.
      </p>
      <strong>Principais funcionalidades e características técnicas:</strong>
      <ul>
        <li><strong>Cadastro de Pets:</strong> Formulário para registrar animais perdidos ou encontrados, com upload de fotos e informações de contato.</li>
        <li><strong>Consulta por CEP:</strong> Integração com a API <strong>ViaCEP</strong> para preenchimento automático do bairro e cidade a partir do CEP informado.</li>
        <li><strong>Listagem e Filtragem:</strong> Exibição dos animais cadastrados em formato de cards, com filtros dinâmicos por status, bairro e espécie.</li>
        <li><strong>Exclusão Segura:</strong> Ao cadastrar um pet, um código único de exclusão é gerado, permitindo que apenas o autor do post possa removê-lo.</li>
        <li><strong>Progressive Web App (PWA):</strong> Estruturado com um \`manifest.json\`, o site pode ser "instalado" em dispositivos móveis para uma experiência similar à de um aplicativo nativo.</li>
        <li><strong>Pronto para Deploy:</strong> O projeto inclui um \`Dockerfile\`, o que facilita o deploy em plataformas de hospedagem como o Render.com.</li>
      </ul>
    `,
      images: [
        '/assets/projects/petlocaliza/captura_tela_1.webp',
        '/assets/projects/petlocaliza/captura_tela_4.webp'
      ],
      videos: ['/assets/projects/petlocaliza/gravacao_tela_1.webm']
    }
  },
  {
    id: 'redes-sistemas-distribuidos',
    title: 'Relatório de Redes e Sistemas Distribuídos',
    description: 'Relatório prático sobre a implementação de uma rede corporativa simulada no Cisco Packet Tracer, incluindo topologia, sub-redes, VLANs e configuração de DHCP.',
    imageUrl: '/assets/projects/redes-sistemas-distribuidos/relatorio-redes-capa.webp',
    projectUrl: '/projeto/redes-sistemas-distribuidos',
    codeUrl: '',
    details: {
      fullDescription: `
        Este projeto acadêmico da disciplina de <strong>Redes e Sistemas Distribuídos</strong> detalha a criação de uma rede simulada para a empresa fictícia "Super Tech".
        <br/><br/>
        Utilizando o <strong>Cisco Packet Tracer</strong>, foi implementada uma topologia em estrela com quatro sub-redes departamentais (Engenharia, Compras, TI e Infraestrutura). O trabalho aborda a configuração de endereçamento IP estático e dinâmico (DHCP), a segmentação da rede com VLANs para segurança e a realização de testes de conectividade para validar a solução.
      `,
      images: [
        '/assets/projects/redes-sistemas-distribuidos/redes-topologia-estrela.webp',
        '/assets/projects/redes-sistemas-distribuidos/redes-dhcp-config_1.webp',
        '/assets/projects/redes-sistemas-distribuidos/redes-dhcp-config_2.webp'
      ],
      videos: [],
      pdfUrl: '/assets/projects/redes-sistemas-distribuidos/PORTIFOLIO-Redes_e_Sistemas_Distribuídos.pdf'
    }
  },
];