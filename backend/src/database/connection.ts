import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source inicializado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro durante a inicialização do Data Source:', error);
  });

export const db = AppDataSource.manager; 