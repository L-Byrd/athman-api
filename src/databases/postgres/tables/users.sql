BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY, 
    name varchar(100),
    email text UNIQUE NOT NULL,
    joined TIMESTAMP NOT NULL
);

COMMIT;