const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository id." });
  }

  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  request.index = index;

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { index } = request;
  const { title, url, techs } = request.body;

  const repository = {
    ...repositories[index],
    title,
    url,
    techs,
  };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { index } = request;

  const repository = repositories[index];

  repository.likes++;

  repositories[index] = repository;

  return response.json(repository);
});

module.exports = app;
