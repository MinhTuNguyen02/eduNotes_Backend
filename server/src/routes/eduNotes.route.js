import { Router } from "express";
import { createNote, listNotes, getNote, updateNote, deleteNote, statsNotes, statsNotesByDay } from "../controllers/eduNotes.controller.js";

const router = Router();

router.post("/", createNote);
router.get("/", listNotes);
router.get("/stats", statsNotes);
router.get("/stats/by-day", statsNotesByDay);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export const eduNotesRoute = router;

