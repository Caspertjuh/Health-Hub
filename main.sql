CREATE DATABASE Dagplanner;
USE Dagplanner;

-- Bewonersprofielen
CREATE TABLE Bewoners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naam VARCHAR(100) NOT NULL,
    symptomen TEXT
);

-- Activiteiten
CREATE TABLE Activiteiten (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    type ENUM('verplicht', 'vrij') NOT NULL
);

-- Planning per bewoner
CREATE TABLE Planning (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bewoner_id INT,
    activiteit_id INT,
    tijdstip TIME,
    FOREIGN KEY (bewoner_id) REFERENCES Bewoners(id),
    FOREIGN KEY (activiteit_id) REFERENCES Activiteiten(id)
);

-- Standaardactiviteiten toevoegen
INSERT INTO Activiteiten (naam, beschrijving, type) VALUES
('Opstaan & ochtendroutine', 'Rustig wakker worden, aankleden en persoonlijke verzorging', 'verplicht'),
('Ontbijt', 'Ontbijt in een rustige en gestructureerde omgeving', 'verplicht'),
('Dagstart & planning', 'Overlopen van de dagplanning, korte groepsbespreking', 'verplicht'),
('Individuele of groepsactiviteiten', 'Creatieve therapie, wandelen, muziek', 'vrij'),
('Pauze', 'Rustmoment met thee/koffie/water', 'verplicht'),
('Vaardigheidstraining / werkmoment', 'Praktische vaardigheden, concentratieoefeningen', 'verplicht'),
('Lunchpauze', 'Gezamenlijke of individuele lunch', 'verplicht'),
('Vrije tijd / persoonlijke ontwikkeling', 'Eigen keuze: muziek luisteren, knutselen', 'vrij'),
('Theepauze', 'Gezellig samen thee/koffie drinken', 'verplicht'),
('Actieve of ontspannende activiteit', 'Sport, mindfulness, ademhalingsoefeningen', 'vrij'),
('Vrije tijd of begeleiding op maat', 'Tijd voor een persoonlijk gesprek of creatieve activiteiten', 'vrij'),
('Avondeten', 'Gezamenlijk of individueel eten in een rustige sfeer', 'verplicht'),
('Avondactiviteiten', 'Filmavond, spelletjes of muziek luisteren', 'vrij'),
('Rustmoment & voorbereiden op de nacht', 'Persoonlijke verzorging, lezen, douchen', 'verplicht'),
('Bedtijd', 'Naar bed gaan op eigen tempo', 'verplicht');

-- Standaardplanning koppelen aan een voorbeeldbewoner
INSERT INTO Planning (bewoner_id, activiteit_id, tijdstip) VALUES
(1, 1, '07:30:00'),
(1, 2, '08:30:00'),
(1, 3, '08:30:00'),
(1, 4, '09:00:00'),
(1, 5, '10:30:00'),
(1, 6, '10:45:00'),
(1, 7, '12:00:00'),
(1, 8, '13:00:00'),
(1, 9, '14:30:00'),
(1, 10, '15:00:00'),
(1, 11, '16:30:00'),
(1, 12, '17:30:00'),
(1, 13, '18:30:00'),
(1, 14, '20:00:00'),
(1, 15, '21:00:00');
