import db from '../../mongo'
import { RequestHandler } from 'express'

const lethalReportDb = db.lethalReport
const getNumberOfReport: RequestHandler = async (req, res) => {
    try {
        const reportedSteamId = req.params.reportedSteamId

        if (!reportedSteamId) {
            return res.status(400).json({ message: 'Missing reportedSteamId' })
        }

        // Count all reports by Steam ID and get the breakdown by reason
        const reportCounts = await lethalReportDb.countNumberOfReportBySteamId(
            reportedSteamId
        )

        res.status(200).json({
            reportedSteamId,
            totalReports: reportCounts.total,
            toxicReports: reportCounts.toxic,
            cheatingReports: reportCounts.cheating,
            undefinedReports: reportCounts.undefined,
        })
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            error: error.message,
        })
    }
}

export default getNumberOfReport
