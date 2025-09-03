// src/data/projects.js

export const projects = [
  {
    id: 'portfolio-react',
    title: 'Portfolio Pessoal com React',
    description: 'Meu portfólio pessoal desenvolvido com React para exibir meus projetos e habilidades de forma moderna e interativa.',
    imageUrl: '/assets/captura_tela_1.png', // Sugestão: troque pela imagem do seu projeto
    projectUrl: '/projeto/portfolio-react',
    codeUrl: 'https://github.com/joaopssouza/portfolio-react',
    details: {
      fullDescription: 'Este é o projeto do meu portfólio pessoal, construído utilizando <strong>React</strong>. O objetivo é criar uma vitrine para meus trabalhos, detalhando as tecnologias que utilizo e minha trajetória como desenvolvedor.',
      images: [
        '/assets/captura_tela_1.png',
      ],
      videos: []
    }
  },
  {
    id: 'api-rest-com-node',
    title: 'API REST com Node.js',
    description: 'Uma API RESTful completa construída com Node.js, Express e TypeScript, seguindo as melhores práticas do mercado.',
    imageUrl: '/assets/captura_tela_2.png', // Sugestão: troque pela imagem do seu projeto
    projectUrl: '/projeto/api-rest-com-node',
    codeUrl: 'https://github.com/joaopssouza/api-rest-com-node',
    details: {
      fullDescription: 'Desenvolvimento de uma <strong>API RESTful</strong> robusta utilizando Node.js, Express e TypeScript. O projeto inclui funcionalidades como autenticação, CRUD de usuários e gerenciamento de tarefas, com foco em código limpo e escalável.',
      images: [
        '/assets/captura_tela_2.png',
      ],
      videos: []
    }
  },
  {
    id: 'nlw-journey-nodejs',
    title: 'NLW Journey - Node.js',
    description: 'Projeto desenvolvido durante a Next Level Week (NLW) da Rocketseat, focado em criar uma aplicação de planejamento de viagens.',
    imageUrl: '/assets/captura_tela_3.png', // Sugestão: troque pela imagem do seu projeto
    projectUrl: '/projeto/nlw-journey-nodejs',
    codeUrl: 'https://github.com/joaopssouza/nlw-journey-nodejs',
    details: {
      fullDescription: 'Participação na trilha de <strong>Node.js</strong> da NLW Journey. O projeto consiste em uma API para gerenciar viagens, convidar participantes e registrar atividades, utilizando tecnologias como Fastify e Prisma.',
      images: [
        '/assets/captura_tela_3.png',
      ],
      videos: []
    }
  },
];