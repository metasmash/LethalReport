import express from 'express'
import s from '../service/lethalApiService'

const router = express.Router()

router.post('/report', s.reportPlayer)

router.get('/report/:reportedSteamId', s.getNumberOfReport)

export default router
