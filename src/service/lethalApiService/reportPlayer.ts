import db from '../../mongo'
import { RequestHandler } from 'express'

const lethalReportDb = db.lethalReport

const reportPlayer: RequestHandler = async (req, res) => {
    try {
        const { reportedSteamId, reporterSteamId, reportReason } = req.body

        // Validate the inputs
        if (!reportedSteamId || !reporterSteamId || !reportReason) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        // Call the method to add a report
        await lethalReportDb.reportPlayer(
            reportedSteamId,
            reporterSteamId,
            reportReason
        )

        // Send a success response
        res.status(200).json({ message: 'Report successfully added' })
    } catch (error) {
        // Handle any errors
        res.status(500).json({
            message: 'An error occurred',
            error: error.message,
        })
    }
}

export default reportPlayer
