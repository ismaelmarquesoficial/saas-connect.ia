import { Router } from 'express'
import { DocumentController } from './document.controller'
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'

const documentRouter = Router()
const documentController = new DocumentController()

documentRouter.use(ensureAuthenticated)

documentRouter.post('/', documentController.create)
documentRouter.get('/', documentController.list)
documentRouter.put('/:id', documentController.update)
documentRouter.delete('/:id', documentController.delete)

export { documentRouter }