import mongoose from 'mongoose'

const Schema = mongoose.Schema

export enum ReportReason {
    UNDEFINED = 'UNDEFINED',
    TOXIC = 'TOXIC',
    CHEATING = 'CHEATING',
}

// Subdocument schema for individual reports
const ReportSchema = new Schema({
    reporterSteamId: {
        type: String,
        required: true,
    },
    reportReason: {
        type: String,
        default: ReportReason.UNDEFINED,
        enum: [
            ReportReason.UNDEFINED,
            ReportReason.TOXIC,
            ReportReason.CHEATING,
        ],
        required: true,
    },
})

// Main document schema
const LethalReportSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    reports: [ReportSchema],
})

export default mongoose.model('LethalReport', LethalReportSchema)
