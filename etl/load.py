import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker

import os

print("Iniciando ETL...")

# Paths dos arquivos de dados
USERS_FILE = "data/raw/users_fake.csv"
MOVIES_FILE = "data/raw/movies_metadata.csv"
RATINGS_FILE = "data/raw/ratings_small.csv"

DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_NAME = os.getenv("POSTGRES_DB", "movieflix")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "postgres")

DB_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"

engine = create_engine(DB_URL)
Session = sessionmaker(bind=engine)
session = Session()
Base = declarative_base()

# ----- Models -----
class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    country = Column(String)
    sex = Column(String(1))

class Movie(Base):
    __tablename__ = "movies"
    movie_id = Column(String, primary_key=True)  # Mudança para String para suportar IDs grandes
    title = Column(String)
    genre = Column(String)
    year = Column(Integer)

class Rating(Base):
    __tablename__ = "ratings"
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    movie_id = Column(String, ForeignKey("movies.movie_id"), primary_key=True)  # Mudança para String
    rating = Column(Numeric)

# criar tabelas
Base.metadata.create_all(engine)

# ----- Check if data already exists -----
existing_users = session.query(User).count()
if existing_users > 0:
    print("Dados já existem. Pulando ETL.")
    session.close()
    exit(0)

# ----- ETL -----
print("Carregando usuários...")
# Users
df_users = pd.read_csv(USERS_FILE)
df_users["age"] = pd.to_numeric(df_users["age"], errors="coerce").clip(lower=0)
df_users["country"] = df_users["country"].fillna("Unknown").str.upper()
df_users["sex"] = df_users["sex"].fillna("U").str.upper()

# Processar usuários em lotes
user_data = []
for _, row in df_users.iterrows():
    user_data.append({
        'user_id': int(row.userId),
        'name': str(row.name),
        'age': int(row.age) if pd.notna(row.age) else None,
        'country': str(row.country),
        'sex': str(row.sex)
    })

# Inserir usuários em lote
try:
    session.bulk_insert_mappings(User, user_data)
    session.commit()
    print(f"Usuários carregados: {len(user_data)}")
except Exception as e:
    session.rollback()
    print(f"Erro ao carregar usuários: {e}")

print("Carregando filmes...")
# Movies
df_movies = pd.read_csv(MOVIES_FILE, nrows=10000)  # Limitar para teste
if "genres" in df_movies.columns:
    df_movies["genre"] = df_movies["genres"].fillna("Unknown")
else:
    df_movies["genre"] = "Unknown"

if "release_date" in df_movies.columns:
    df_movies["year"] = pd.to_datetime(df_movies["release_date"], errors="coerce").dt.year
else:
    df_movies["year"] = None

# Filtrar filmes válidos e tratar valores NaN
df_movies = df_movies.dropna(subset=["id", "title"])
df_movies["year"] = df_movies["year"].fillna(0).astype(int)

# Processar filmes em lotes
movie_data = []
for _, row in df_movies.iterrows():
    movie_data.append({
        'movie_id': str(int(row.id)),
        'title': str(row.title),
        'genre': str(row.genre),
        'year': int(row.year) if row.year > 0 else None
    })

# Inserir filmes em lote
try:
    session.bulk_insert_mappings(Movie, movie_data, update_on_duplicate=True)
    session.commit()
    print(f"Filmes carregados: {len(movie_data)}")
except Exception as e:
    session.rollback()
    # Tentar inserir um por vez para pular duplicatas
    print(f"Erro em lote, tentando inserção individual...")
    success_count = 0
    for movie in movie_data:
        try:
            session.merge(Movie(**movie))
            success_count += 1
        except:
            session.rollback()
            continue
    session.commit()
    print(f"Filmes carregados individualmente: {success_count}")

print("Carregando avaliações...")
# Ratings
df_ratings = pd.read_csv(RATINGS_FILE)
df_ratings["rating"] = pd.to_numeric(df_ratings["rating"], errors="coerce")
df_ratings = df_ratings[df_ratings["rating"].between(1,5)]
df_ratings.drop_duplicates(subset=["userId","movieId"], inplace=True)

# Processar ratings em lotes
rating_data = []
for _, row in df_ratings.iterrows():
    rating_data.append({
        'user_id': int(row.userId),
        'movie_id': str(int(row.movieId)),
        'rating': float(row.rating)
    })

# Inserir ratings em lote (apenas para filmes que existem)
print("Verificando filmes existentes...")
existing_movie_ids = set(row[0] for row in session.query(Movie.movie_id).all())
valid_ratings = [r for r in rating_data if r['movie_id'] in existing_movie_ids]
print(f"Ratings válidos (com filmes existentes): {len(valid_ratings)} de {len(rating_data)}")

try:
    session.bulk_insert_mappings(Rating, valid_ratings, update_on_duplicate=True)
    session.commit()
    print(f"Avaliações carregadas: {len(valid_ratings)}")
except Exception as e:
    session.rollback()
    # Tentar inserir um por vez para pular duplicatas
    print(f"Erro em lote, tentando inserção individual...")
    success_count = 0
    for rating in valid_ratings:
        try:
            session.merge(Rating(**rating))
            success_count += 1
        except:
            session.rollback()
            continue
    session.commit()
    print(f"Avaliações carregadas individualmente: {success_count}")

session.commit()
session.close()
print("ETL concluído")
