import { Builder, builder_WatermelonDB_set_database } from "../index";
import {
  MockComment,
  mockDatabase,
  MockProject,
  MockProjectSection,
  MockTask
} from "./setup";

const database = mockDatabase;

it("Inicializa banco de dados", async () => {
  const project = mockDatabase.database.get(MockProject.table);
  const section = mockDatabase.database.get(MockProjectSection.table);
  const task = mockDatabase.database.get(MockTask.table);
  const comment = mockDatabase.database.get(MockComment.table);
  const projects = [];
  await mockDatabase.database.write(async () => {
    for (let ip in new Array(10).fill("")) {
      const p = await project.create((m) => {
        m.name = `Projeto ${ip}`;
      });

      for (let is in new Array(Math.ceil(Math.random() * 2)).fill("")) {
        const s = await section.create((m) => {
          m.project_id = p.id;
        });
        for (let it in new Array(Math.ceil(Math.random() * 3)).fill("")) {
          const t = await task.create((m) => {
            m.name = `Task ${p.name} ${it}`;
            m.position = 1;
            m.is_completed = false;
            m.description = `Task ${p.name} ${p.id} ${s.id} ${it}`;
            m.project_id = p.id;
            m.project_section_id = s.id;
          });
          for (let ic in new Array(Math.ceil(Math.random() * 4)).fill("")) {
            await comment.create((m) => {
              m.task.set(t);
              m.body = `Comment ${is} ${ic} ${t.id} ${p.name} ${p.id} ${s.id} ${it}`;
            });
          }
        }
      }
      projects.push(p);
    }
  });

  expect(projects.length).toBe(10);
});

it("Teste com erro 'sem vincular database'", () => {
  const callClass = () => {
    return new Builder(MockProject);
  };
  expect(callClass).toThrow(
    "ERRO: Vincular database função builder_WatermelonDB_set_database(db)"
  );
});

it("Teste sem erro 'sem vincular database'", () => {
  builder_WatermelonDB_set_database(database.database);
  const classBuilder = new Builder(MockProject);

  expect(typeof classBuilder).toBe("object");
});

it("Teste selecionar todos projetos", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject).all();
  expect(projects.length).toBe(10);
});

it("Teste selecionar todos projetos e tasks com erro", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject).with([]).all();
  expect(projects[0][MockTask.table]).toBeUndefined();
  expect(projects[4][MockTask.table]).toBeUndefined();
  expect(projects[9][MockTask.table]).toBeUndefined();
});

it("Teste selecionar todos projetos e tasks", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject)
    .with([
      {
        model: MockTask,
      },
    ])
    .all();
  expect(projects[0][MockTask.table]).toBeDefined();
  expect(projects[4][MockTask.table]).toBeDefined();
  expect(projects[9][MockTask.table]).toBeDefined();
});

it("Teste selecionar todos projetos e tasks com comentários com erro", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject)
    .with([
      {
        model: MockTask,
      },
    ])
    .all();
  expect(projects[0][MockTask.table][0][MockComment.table]).toBeUndefined();
  expect(projects[4][MockTask.table][0][MockComment.table]).toBeUndefined();
  expect(projects[9][MockTask.table][0][MockComment.table]).toBeUndefined();
});

it("Teste selecionar todos projetos e tasks com comentários", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject)
    .with([
      {
        model: MockTask,
        with: [
          {
            model: MockComment,
          },
        ],
      },
    ])
    .all();
  expect(projects[0][MockTask.table][0][MockComment.table]).toBeDefined();
  expect(projects[4][MockTask.table][0][MockComment.table]).toBeDefined();
  expect(projects[9][MockTask.table][0][MockComment.table]).toBeDefined();
});

it("Teste selecionar primeiro projeto e tasks com comentários", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject).with([]).all();
  const project = await new Builder(MockProject)
    .with([
      {
        model: MockTask,
        with: [
          {
            model: MockComment,
          },
        ],
      },
    ])
    .get(projects[0].id);
  expect(project[MockTask.table][0][MockComment.table]).toBeDefined();
});

it("Teste selecionar primeiro projeto e tasks com comentários com propriedade alias", async () => {
  builder_WatermelonDB_set_database(database.database);
  const projects = await new Builder(MockProject).with([]).all();
  const project = await new Builder(MockProject)
    .with([
      {
        model: MockTask,
        as: 'tasks',
        with: [
          {
            model: MockComment,
            as: 'comments'
          },
        ],
      },
    ])
    .get(projects[0].id);
  expect(project['tasks'][0]['comments']).toBeDefined();
});
