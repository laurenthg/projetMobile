--
-- PostgreSQL database dump
--

-- Base de donées inital en PostgreSQL
-- DROP et CREATE des tables
-- ajout de quelque données dans la base de données
-- pour des tests initials

DROP TABLE Message;
DROP TABLE Contact;
DROP TABLE Utilisateur;

CREATE TABLE Utilisateur(
    numero integer not null primary key,
    nom character varying(20) NOT NULL,
    mdp character varying(30) NOT NULL,
    coordonne geometry
);


CREATE TABLE Message(
    numero integer not null references Utilisateur(numero),
    destinataire integer not null references Utilisateur(numero),
    dates TIMESTAMP WITH TIME ZONE  NOT NULL,
    Titre character varying(100) NOT NULL,
    Corps character varying(1000) NOT NULL,
    geographique geometry,
    PRIMARY KEY(numero,dates,destinataire)
);

CREATE TABLE Contact (
    client integer not null references Utilisateur(numero),
    numContact integer,
    PRIMARY KEY(client,numcontact)
);

INSERT INTO Utilisateur VALUES (1,'testnom','a','POINT ( 0 123)');
INSERT INTO Utilisateur VALUES (2,'n','m','POINT( 0 124)');
INSERT INTO Utilisateur VALUES (7,'toto','a','POINT ( 0 125)');
INSERT INTO Contact VALUES(1,7);
INSERT INTO Contact VALUES(7,1);
INSERT INTO Message VALUES(1,2,current_timestamp(0),'Testtitre','TestCorps','POINT( 0 123)');
INSERT INTO Message VALUES(1,2,TO_TIMESTAMP('2020-01-01 10:10:10', 'YYYY-MM-DD HH24:MI:SS') ,'Testtitre2','TestCorps2','POINT( 0 125)');
