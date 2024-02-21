import express from "express";
import {
  getNote,
  getNotes,
  createNote,
  updateNote,
  deleteRowById,
} from "./index.js";

const app = express();

app.use(express.json());

app.get("/notes", async (req, res) => {
  const notes = await getNotes();
  res.send(notes);
});

app.get("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const note = await getNote(id);
  res.send(note);
});

app.post("/notes-create", async (req, res) => {
  const { countryName, population } = req.body;
  const note = await createNote(countryName, population);
  res.status(201).send(note);
});

app.patch("/update-note", async (req, res) => {
  const { id, countryName, population } = req.body;
  const notes = await updateNote(id, countryName, population);
  res.status(201).send(notes);
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const success = await deleteRowById(id);
    if (success) {
        res.status(200).send(success);
    } else {
        res.status(404).send("Row with the specified ID does not exist.");
    }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
