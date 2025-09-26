import eduNotesModel from "../models/eduNotes.model.js";

export const createNote = async (req, res) => {
  const { title, content, subject, tags, pinned, archived } = req.body;
  if (!title || !content || !subject) {
    return res.status(400).json({ message: "title, content, subject are required" });
  }
  const note = await eduNotesModel.create({ title, content, subject, tags, pinned, archived });
  return res.status(201).json(note);
};

export const listNotes = async (req, res) => {
  const { subject, tag, pinned, archived, from, to, page = 1, limit = 10, q } = req.query;
  const filter = {};

  if (subject) filter.subject = { $in: subject.split(",") };
  if (tag) filter.tags = { $in: tag.split(",") };
  if (pinned !== undefined) filter.pinned = pinned === "true";
  if (archived !== undefined) filter.archived = archived === "true";
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to)   filter.createdAt.$lte = new Date(to);
  }
  if (q) {
    filter.$or = [
      { title:   { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    eduNotesModel.find(filter).sort({ pinned: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    eduNotesModel.countDocuments(filter),
  ]);

  return res.json({ items, page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) });
};

export const getNote = async (req, res) => {
  const note = await eduNotesModel.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Not found" });
  return res.json(note);
};

export const updateNote = async (req, res) => {
  const note = await eduNotesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!note) return res.status(404).json({ message: "Not found" });
  return res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await eduNotesModel.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ message: "Not found" });
  return res.json({ ok: true });
};

export const statsNotes = async (req, res) => {
  const [bySubject, totalLast7, totalAll] = await Promise.all([
    eduNotesModel.aggregate([{ $group: { _id: "$subject", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    eduNotesModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 864e5) } }),
    eduNotesModel.estimatedDocumentCount(),
  ]);
  res.json({ bySubject, last7Days: totalLast7, total: totalAll });
};

export const statsNotesByDay = async (req, res) => {
  const { from, to, subject, tag } = req.query;

  const match = {};
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to)   match.createdAt.$lte = new Date(to);
  }
  if (subject) match.subject = { $in: subject.split(",") };
  if (tag)     match.tags = { $in: tag.split(",") };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, name: "$_id", count: 1 } },
  ];

  const byDay = await eduNotesModel.aggregate(pipeline);
  res.json({ byDay });
};