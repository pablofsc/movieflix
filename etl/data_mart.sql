-- Top 10 filmes mais bem avaliados por gênero
CREATE OR REPLACE VIEW top_movies_by_genre AS
SELECT 
    m.genre,
    m.title,
    AVG(r.rating) AS avg_rating,
    COUNT(r.rating) AS num_ratings
FROM movies m
JOIN ratings r ON m.movie_id = r.movie_id
GROUP BY m.genre, m.title
HAVING COUNT(r.rating) >= 5
ORDER BY m.genre, avg_rating DESC;

-- Nota média por faixa etária
CREATE OR REPLACE VIEW avg_rating_by_age_group AS
SELECT 
    CASE 
        WHEN u.age < 18 THEN '<18'
        WHEN u.age BETWEEN 18 AND 25 THEN '18-25'
        WHEN u.age BETWEEN 26 AND 35 THEN '26-35'
        WHEN u.age BETWEEN 36 AND 50 THEN '36-50'
        ELSE '50+' 
    END AS age_group,
    AVG(r.rating) AS avg_rating
FROM users u
JOIN ratings r ON u.user_id = r.user_id
GROUP BY age_group
ORDER BY age_group;

-- Número de avaliações por país
CREATE OR REPLACE VIEW ratings_by_country AS
SELECT 
    u.country,
    COUNT(r.rating) AS num_ratings
FROM users u
JOIN ratings r ON u.user_id = r.user_id
GROUP BY u.country
ORDER BY num_ratings DESC;
