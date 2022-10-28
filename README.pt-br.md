# Query Builder WDB - (WatermelonDB)

## Carregar tabelas relacionadas com WatermelonDB

Classe utilitária permite selecionar tabelas relacionadas (has_many, belongs_to).

Para utilizar voce deve instanciar a Classe Builder passando o Model WatermelonDB alvo no construtor. Para adicionar as tabelas relacionadas utilize o método *.with([])*.

Classe permite selecionar um registro com os registro relacionados (*.get(id)*) ou uma lista com os registros relacionados (*.all()*).

# Exemplo

index.js applications

```js
import { builder_WatermelonDB_set_database } from "../";
...
const database = new Database({
    adapter,
    schema,
    modelClasses,
  });
  
builder_WatermelonDB_set_database(database);
...

```
Carregar tabela *project* com *tasks* e *comments*

```js
import { Builder } from "../";
...
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
    .get('jfcpkcmo7p42vi8p');

console.log(project);
>>
// {
//     "id": "jfcpkcmo7p42vi8p",
//     "_status": "created",
//     "_changed": "",
//     "name": "Projeto 0",
//     "mock_tasks": [
//         {
//             "id": "x8xadv0qyl4t704x",
//             "_status": "created",
//             "_changed": "",
//             "name": "Task Projeto 0 0",
//             "position": 1,
//             "is_completed": false,
//             "description": "Task Projeto 0 jfcpkcmo7p42vi8p hf3q3539qhincukt 0",
//             "project_id": "jfcpkcmo7p42vi8p",
//             "project_section_id": "hf3q3539qhincukt",
//             "mock_comments": [
//                 {
//                     "id": "xuvasy1jk12ltsgj",
//                     "_status": "created",
//                     "_changed": "",
//                     "task_id": "x8xadv0qyl4t704x",
//                     "body": "Comment 0 0 x8xadv0qyl4t704x Projeto 0 jfcpkcmo7p42vi8p hf3q3539qhincukt 0",
//                     "created_at": 1666917617126,
//                     "updated_at": 1666917617126
//                 },
//                 {
//                     "id": "c1y852fdbko8u1xf",
//                     "_status": "created",
//                     "_changed": "",
//                     "task_id": "x8xadv0qyl4t704x",
//                     "body": "Comment 0 1 x8xadv0qyl4t704x Projeto 0 jfcpkcmo7p42vi8p hf3q3539qhincukt 0",
//                     "created_at": 1666917617127,
//                     "updated_at": 1666917617127
//                 }
//             ]
//         }
//     ]
// }


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

console.log(projects);
>>
// [
//     {
//         "id": "lpwju4y8zzv2edqm",
//         "_status": "created",
//         "_changed": "",
//         "name": "Projeto 0",
//         "mock_tasks": [
//             {
//                 "id": "1w91fvxn2lkjfgzk",
//                 "_status": "created",
//                 "_changed": "",
//                 "name": "Task Projeto 0 0",
//                 "position": 1,
//                 "is_completed": false,
//                 "description": "Task Projeto 0 lpwju4y8zzv2edqm ij43jd09nt35qd5g 0",
//                 "project_id": "lpwju4y8zzv2edqm",
//                 "project_section_id": "ij43jd09nt35qd5g",
//                 "mock_comments": [
//                     {
//                         "id": "8pb6a99f7sjg7bb7",
//                         "_status": "created",
//                         "_changed": "",
//                         "task_id": "1w91fvxn2lkjfgzk",
//                         "body": "Comment 0 0 1w91fvxn2lkjfgzk Projeto 0 lpwju4y8zzv2edqm ij43jd09nt35qd5g 0",
//                         "created_at": 1666918240690,
//                         "updated_at": 1666918240690
//                     }
//                 ]
//             },
//             {
//                 "id": "dn4ajp77s87536ui",
//                 "_status": "created",
//                 "_changed": "",
//                 "name": "Task Projeto 0 1",
//                 "position": 1,
//                 "is_completed": false,
//                 "description": "Task Projeto 0 lpwju4y8zzv2edqm ij43jd09nt35qd5g 1",
//                 "project_id": "lpwju4y8zzv2edqm",
//                 "project_section_id": "ij43jd09nt35qd5g",
//                 "mock_comments": [
//                     {
//                         "id": "000ncq87bhjg5chl",
//                         "_status": "created",
//                         "_changed": "",
//                         "task_id": "dn4ajp77s87536ui",
//                         "body": "Comment 0 0 dn4ajp77s87536ui Projeto 0 lpwju4y8zzv2edqm ij43jd09nt35qd5g 1",
//                         "created_at": 1666918240691,
//                         "updated_at": 1666918240691
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         "id": "z5qbet9bjiocswil",
//         "_status": "created",
//         "_changed": "",
//         "name": "Projeto 1",
//         "mock_tasks": [
//             {
//                 "id": "bjcojt3vfupxppzi",
//                 "_status": "created",
//                 "_changed": "",
//                 "name": "Task Projeto 1 0",
//                 "position": 1,
//                 "is_completed": false,
//                 "description": "Task Projeto 1 z5qbet9bjiocswil wgn36tq31ypi0ddw 0",
//                 "project_id": "z5qbet9bjiocswil",
//                 "project_section_id": "wgn36tq31ypi0ddw",
//                 "mock_comments": [
//                     {
//                         "id": "cewns0a79vyhi66g",
//                         "_status": "created",
//                         "_changed": "",
//                         "task_id": "bjcojt3vfupxppzi",
//                         "body": "Comment 0 0 bjcojt3vfupxppzi Projeto 1 z5qbet9bjiocswil wgn36tq31ypi0ddw 0",
//                         "created_at": 1666918240691,
//                         "updated_at": 1666918240691
//                     }
//                 ]
//             },
//             {
//                 "id": "05u31v1slky7ovbd",
//                 "_status": "created",
//                 "_changed": "",
//                 "name": "Task Projeto 1 1",
//                 "position": 1,
//                 "is_completed": false,
//                 "description": "Task Projeto 1 z5qbet9bjiocswil wgn36tq31ypi0ddw 1",
//                 "project_id": "z5qbet9bjiocswil",
//                 "project_section_id": "wgn36tq31ypi0ddw",
//                 "mock_comments": [
//                     {
//                         "id": "s6mutk80fxpsmvfp",
//                         "_status": "created",
//                         "_changed": "",
//                         "task_id": "05u31v1slky7ovbd",
//                         "body": "Comment 0 0 05u31v1slky7ovbd Projeto 1 z5qbet9bjiocswil wgn36tq31ypi0ddw 1",
//                         "created_at": 1666918240692,
//                         "updated_at": 1666918240692
//                     }
//                 ]
//             }
//         ]
//     }
// ]


```
