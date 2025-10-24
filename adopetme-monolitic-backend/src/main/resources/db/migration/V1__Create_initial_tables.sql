/* ==========================================================================

SCRIPT DE CRIAÇÃO DO BANCO DE DADOS (POSTGRESQL)


Ordem de criação (para satisfazer as dependências de chaves estrangeiras):

1. ONG

2. USUARIO (requer ONG)

3. PETS (requer ONG)

4. ONG_FOTO (requer ONG)

5. PET_FOTOS (requer PETS)

6. FAVORITOS (requer USUARIO e PETS)

==========================================================================

*/



-- Tabela 1: ONG

-- Entidade principal, referenciada por outras tabelas.

CREATE TABLE ONG (

ID SERIAL PRIMARY KEY,

NOME VARCHAR(255) NOT NULL,

ENDERECO TEXT,

RESPONSAVEL VARCHAR(255),

TELEFONE VARCHAR(20),

TIPO_ONG VARCHAR(100),

EMAIL VARCHAR(255) UNIQUE NOT NULL,

CIDADE VARCHAR(100),

ESTADO VARCHAR(50),

DT_REGISTRO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

DESCRICAO TEXT

);



-- Tabela 2: USUARIO

-- Referencia a tabela ONG.

-- O campo ID_ONG é nulo (NULL), permitindo usuários sem ONG.

CREATE TABLE USUARIO (

ID SERIAL PRIMARY KEY,

ID_ONG INTEGER, -- CHAVE ESTRANGEIRA para ONG (pode ser NULA)

LOGIN VARCHAR(100) UNIQUE NOT NULL,

SENHA VARCHAR(255) NOT NULL, -- Em produção, armazene um hash da senha

NOME VARCHAR(100) NOT NULL,

SOBRENOME VARCHAR(100),

EMAIL VARCHAR(255) UNIQUE NOT NULL,

CPF VARCHAR(14) UNIQUE,

ENDERECO TEXT,

TELEFONE VARCHAR(20),

TIPO_USER VARCHAR(50) NOT NULL, -- Ex: 'Adotante', 'Admin_ONG', 'Admin_Sistema'

DT_CADASTRO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,


CONSTRAINT fk_usuario_ong

FOREIGN KEY(ID_ONG)

REFERENCES ONG(ID)

ON DELETE SET NULL -- Se a ONG for deletada, o ID_ONG do usuário fica nulo

);



-- Tabela 3: PETS

-- Referencia a tabela ONG.

-- Um pet deve, obrigatoriamente, pertencer a uma ONG.

CREATE TABLE PETS (

ID SERIAL PRIMARY KEY,

ID_ONG INTEGER NOT NULL, -- CHAVE ESTRANGEIRA para ONG (NÃO PODE ser nula)

NOME VARCHAR(100) NOT NULL,

NINHADA VARCHAR(100),

ESPECIE VARCHAR(50),

SEXO VARCHAR(10), -- 'Macho', 'Fêmea'

IDADE INTEGER,

CASTRACAO BOOLEAN,

DT_NASCIMENTO DATE,

DESCRICAO TEXT,

STATUS VARCHAR(50), -- 'Disponível', 'Adotado', etc.

DT_CADASTRO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,


CONSTRAINT fk_pet_ong

FOREIGN KEY(ID_ONG)

REFERENCES ONG(ID)

ON DELETE CASCADE -- Se a ONG for deletada, seus pets também são

);



-- Tabela 4: ONG_FOTO

-- Referencia a tabela ONG (N:1).

CREATE TABLE ONG_FOTO (

ID SERIAL PRIMARY KEY,

ID_ONG INTEGER NOT NULL, -- CHAVE ESTRANGEIRA para ONG

URL TEXT NOT NULL,

DT_CRIACAO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

FT_LOGO BOOLEAN DEFAULT FALSE,


CONSTRAINT fk_ongfoto_ong

FOREIGN KEY(ID_ONG)

REFERENCES ONG(ID)

ON DELETE CASCADE -- Se a ONG for deletada, suas fotos também são

);



-- Tabela 5: PET_FOTOS

-- Referencia a tabela PETS (N:1).

CREATE TABLE PET_FOTOS (

ID SERIAL PRIMARY KEY,

ID_PET INTEGER NOT NULL, -- CHAVE ESTRANGEIRA para PETS

URL TEXT NOT NULL,

DT_CRIACAO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

FT_PRINCIPAL BOOLEAN DEFAULT FALSE,


CONSTRAINT fk_petfoto_pet

FOREIGN KEY(ID_PET)

REFERENCES PETS(ID)

ON DELETE CASCADE -- Se o PET for deletado, suas fotos também são

);



-- Tabela 6: FAVORITOS

-- Tabela de junção N:N (muitos-para-muitos) entre USUARIO e PETS.

CREATE TABLE FAVORITOS (

ID SERIAL PRIMARY KEY,

ID_USER INTEGER NOT NULL, -- CHAVE ESTRANGEIRA para USUARIO

ID_PET INTEGER NOT NULL, -- CHAVE ESTRANGEIRA para PETS

DT_FAVORITO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,


CONSTRAINT fk_favorito_usuario

FOREIGN KEY(ID_USER)

REFERENCES USUARIO(ID)

ON DELETE CASCADE, -- Se o usuário for deletado, seus favoritos são deletados


CONSTRAINT fk_favorito_pet

FOREIGN KEY(ID_PET)

REFERENCES PETS(ID)

ON DELETE CASCADE, -- Se o pet for deletado, ele sai dos favoritos


CONSTRAINT uq_user_pet_favorito

UNIQUE (ID_USER, ID_PET) -- Impede que um usuário favorite o mesmo pet múltiplas vezes

);