import { Router } from 'express';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { authMiddleware } from '../../shared/middlewares/auth';
import { upload } from '../../shared/middlewares/upload';

const knowledgeBaseRouter = Router();
const knowledgeBaseController = new KnowledgeBaseController();

// Rotas de documentos
knowledgeBaseRouter.post(
  '/',
  authMiddleware,
  knowledgeBaseController.createDocument
);

knowledgeBaseRouter.get(
  '/',
  authMiddleware,
  knowledgeBaseController.getDocuments
);

knowledgeBaseRouter.get(
  '/search',
  authMiddleware,
  knowledgeBaseController.searchDocuments
);

knowledgeBaseRouter.get(
  '/:id',
  authMiddleware,
  knowledgeBaseController.getDocumentById
);

knowledgeBaseRouter.put(
  '/:id',
  authMiddleware,
  knowledgeBaseController.updateDocument
);

knowledgeBaseRouter.delete(
  '/:id',
  authMiddleware,
  knowledgeBaseController.deleteDocument
);

// Rotas de upload
knowledgeBaseRouter.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  knowledgeBaseController.uploadDocument
);

// Rotas de tags
knowledgeBaseRouter.get(
  '/tags',
  authMiddleware,
  knowledgeBaseController.getTags
);

knowledgeBaseRouter.get(
  '/tags/:tag',
  authMiddleware,
  knowledgeBaseController.getDocumentsByTag
);

knowledgeBaseRouter.post(
  '/:id/tags',
  authMiddleware,
  knowledgeBaseController.addTag
);

knowledgeBaseRouter.delete(
  '/:id/tags/:tag',
  authMiddleware,
  knowledgeBaseController.removeTag
);

export default knowledgeBaseRouter; 