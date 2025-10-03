# movieflix

Este projeto é uma aplicação web dividida em frontend (React), backend (API Node) com proxy reverso (nginx) e um script ETL que processa CSVs (que simulam um Data Lake) para um banco Postgres (Data Warehouse), com views específicas que simulam um Data Mart. Cada parte do projeto tem um container e tudo é orquestrado pelo docker-compose na raiz.

## Arquitetura

- `app/frontend`: consome dados do backend e mostra na tela.
- `app/backend`: alimenta o frontend com dados do banco, inclusive as views data mart.
- `etl/`: scripts Python para processar `data/raw/*.csv`.
- `data/`: dados brutos em CSV (`data/raw/`).
- `nginx/`: proxy reverso

## Fluxo de dados

1. Arquivos CSV em `data/raw/` são processados pelo ETL (`etl/load.py`) e carregados no(s) banco(s) via scripts SQL.
2. O backend (`app/backend`) acessa o banco através e expõe endpoints HTTP.
3. O frontend (`app/frontend`) consome a API, passando pelo proxy reverso `nginx`.

## Fonte dos dados

Eu não usei a API sugerida porque achei muito limitada, além de não ter ratings nem users. Por isso, usei essa database da Kaggle:
https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset

Já que os csvs seriam versionados, eu apaguei várias colunas desnecessárias do movies_metadata para diminuir o tamanho.

`movies_metadata.csv` e `ratings_small.csv` vieram da database do Kaggle. Como eu não tinha dados de usuários, pedi para o ChatGPT gerar um csv com dados fake para o intervalo de user id (1-671) presentes no arquivo de ratings. É o `users_fake.csv`.

## Como executar

No terminal (bash):

```bash
docker compose up --build
```

O GitHub actions está configurado para buildar e subir a imagem do app para o DockerHub:

https://hub.docker.com/r/pablofsc/movieflix-app

## Notas

Escolhi usar docker-compose porque acho mais fácil principalmente porque temos muitos conteiners que rodam em paralelo e precisam subir na ordem certa.

Usei bastante IA para me ajudar a construir o frontend e backend (que não estão exatamente do jeito que eu gostaria mas funcionam). Mas, como solicitado, os dockerfiles e docker-compose foram feitos na mão mesmo. (com algum sofrimento em certos momentos). Nos scripts Python o uso de IA foi mais pontual.
