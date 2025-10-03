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

## Data Mart

### View de avaliação média por idade: 
<img width="301" height="114" alt="image" src="https://github.com/user-attachments/assets/05469ca5-bb32-49da-9b1a-698193a96af5" />

### View de quantidade de avaliações por país:
<img width="297" height="222" alt="image" src="https://github.com/user-attachments/assets/d0316f4f-b208-4c6f-bba5-05a8b2e5f5d6" />

### View de top filmes por gênero:
<img width="682" height="231" alt="image" src="https://github.com/user-attachments/assets/ce7d5543-4394-450f-9b81-eb31abcdbcd1" />

As views também estão disponíveis no frontend para efeito de demonstração:

<img width="800" height="400" alt="image" src="https://github.com/user-attachments/assets/f515f2e2-6889-4877-a0b8-615e6793fbfd" />

Com as views, que simulam um Data Mart, temos acesso a dados direcionados mais facilmente.

## Consultas Analíticas

### 5 filmes mais populares: 

```sql
SELECT m.movie_id, m.title, COUNT(r.rating) AS total_ratings, AVG(r.rating) AS average_rating 
FROM public.movies m 
JOIN public.ratings r ON m.movie_id = r.movie_id 
GROUP BY m.movie_id, m.title 
ORDER BY total_ratings DESC 
LIMIT 5;
```

São Exterminador do Futuro 3, The Million Dollar Hotel, Solaris, The 39 Steps e Monsoon Weeding.

### Gênero mais bem avaliado:

```sql
SELECT m.genre, AVG(r.rating) AS average_rating
FROM public.movies m
JOIN public.ratings r ON m.movie_id = r.movie_id
GROUP BY m.genre
ORDER BY average_rating DESC
LIMIT 1;
```

É o de filmes estrangeiros.

### País que mais assiste filmes:

```sql
SELECT * FROM ratings_by_country ORDER BY num_ratings DESC LIMIT 1;
```

Aqui podemos usar uma das views. É a Alemanha com 6423 avaliações. (não temos o número de visualizações, só avaliações)

## Notas

Escolhi usar docker-compose porque acho mais fácil principalmente porque temos muitos conteiners que rodam em paralelo e precisam subir na ordem certa.

Usei bastante IA para me ajudar a construir o frontend e backend (que não estão exatamente do jeito que eu gostaria mas funcionam). Mas, como solicitado, os dockerfiles e docker-compose foram feitos na mão mesmo. (com algum sofrimento em certos momentos). Nos scripts Python o uso de IA foi mais pontual.
