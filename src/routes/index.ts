import express from 'express'
import authMd from 'middleware/authenticationMiddleware'
import roleMd from 'middleware/roleMiddleware'
import authenticationRoutes from 'routes/authenticationRoutes'
import adminRoutes from './adminRoutes'
import { UserRole } from '../mongo/schema/users'
import lethalApiRoutes from './lethalApiRoutes'

const router = express.Router()

router.use('/', authenticationRoutes)

router.use(
    '/admin',
    authMd.isUserAuthenticated,
    roleMd.checkUserIs(UserRole.ADMIN),
    adminRoutes
)

router.get('/healthCheck', async (req, res) => res.json({ status: 'ok' }))

router.use('/lethalreportapi', lethalApiRoutes)

export default router
