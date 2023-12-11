import LethalReport, { ReportReason } from './schema/lethalReport'

export default {
    countNumberOfReportBySteamId: async (
        reportedSteamId: string
    ): Promise<{
        total: number
        toxic: number
        cheating: number
        undefined: number
    }> => {
        const result = await LethalReport.aggregate([
            { $match: { _id: reportedSteamId } },
            { $unwind: '$reports' },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    toxic: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$reports.reportReason',
                                        ReportReason.TOXIC,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    cheating: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$reports.reportReason',
                                        ReportReason.CHEATING,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    undefined: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$reports.reportReason',
                                        ReportReason.UNDEFINED,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ])

        if (result.length === 0) {
            return { total: 0, toxic: 0, cheating: 0, undefined: 0 }
        }

        const [data] = result

        return {
            total: data.total,
            toxic: data.toxic,
            cheating: data.cheating,
            undefined: data.undefined,
        }
    },

    reportPlayer: async (
        reportedSteamId: string,
        reporterSteamId: string,
        reportReason: ReportReason
    ): Promise<void> => {
        const report = await LethalReport.findById(reportedSteamId).exec()
        if (report) {
            // Check if the reporterSteamId already exists in the reports array
            const alreadyReported = report.reports.some(
                (report) => report.reporterSteamId === reporterSteamId
            )
            if (!alreadyReported) {
                report.reports.push({ reporterSteamId, reportReason })
                await report.save()
            }
        } else {
            const newReport = new LethalReport({
                _id: reportedSteamId,
                reports: [{ reporterSteamId, reportReason }],
            })
            await newReport.save()
        }
    },

    deleteReportPlayer: async (
        reportedSteamId: string,
        reporterSteamId: string
    ): Promise<void> => {
        await LethalReport.updateOne(
            { _id: reportedSteamId },
            { $pull: { reports: { reporterSteamId: reporterSteamId } } }
        )
    },

    findHasBeenReported: async (
        reportedSteamId: string,
        reporterSteamId: string
    ): Promise<boolean> => {
        const report = await LethalReport.findById(reportedSteamId).exec()
        return report
            ? report.reports.some((r) => r.reporterSteamId === reporterSteamId)
            : false
    },
}
