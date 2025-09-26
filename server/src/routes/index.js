import express from 'express'
import { eduNotesRoute } from './eduNotes.route.js'
const Router = express.Router()

Router.use('/notes', eduNotesRoute)

export const APIs_V1 = Router

