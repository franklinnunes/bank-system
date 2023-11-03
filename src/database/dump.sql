create database bank;

CREATE TABLE
    usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    );

CREATE TABLE
    categorias (
        id SERIAL PRIMARY KEY,
        descricao TEXT
    );

CREATE TABLE
    transacoes (
        id SERIAL PRIMARY KEY,
        descricao TEXT,
        valor INTEGER,
        data DATE,
        categoria_id INTEGER REFERENCES categorias(id),
        usuario_id INTEGER REFERENCES usuarios(id),
        tipo TEXT
    );

INSERT INTO
    categorias (descricao)
VALUES ('Food'), ('Subscriptions and Services'), ('Home'), ('Market'), ('Personal Care'), ('Education'), ('Family'), ('Leisure'), ('Pets'), ('Gifts'), ('Clothes'), ('Health'), ('Transportation'), ('Salary'), ('Sales'), ('Other incomes'), ('Other expenses');