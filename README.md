# Health Hub - Day Planning Application

> 🎯 **Schoolproject** - Een uitgebreide dagplanningsapplicatie voor dagactiviteitencentra die cliënten met verstandelijke beperkingen ondersteunen.

## 📋 Projectoverzicht

Health Hub is een webapplicatie ontworpen voor dagactiviteitencentra om dagschema's te beheren voor cliënten met verschillende verstandelijke beperkingen, waaronder het syndroom van Down. Het systeem biedt gepersonaliseerde activiteitenplanning gebaseerd op individuele mogelijkheden en behoeften.

### 🎯 Doelgroep
- **Primair**: Begeleiders en zorgverleners in dagactiviteitencentra
- **Secundair**: Cliënten met verstandelijke beperkingen
- **Ontwikkelaars**: Studenten die het project verder willen ontwikkelen

## ✨ Hoofdfunctionaliteiten

### 🔧 Voor Beheerders
- **Gebruikersbeheer**: Cliëntprofielen aanmaken en beheren
- **Beperkingsconfiguratie**: Uitgebreide profielen voor verschillende beperkingen
- **Activiteitentemplates**: Herbruikbare activiteitensjablonen beheren
- **Groepsactiviteiten**: Beheer van groepsdeelname en instellingen

### 🎯 Voor Cliënten
- **Gepersonaliseerde schema's**: Automatische dagschema's aangepast aan individuele mogelijkheden
- **Activiteitenfiltering**: Alleen geschikte activiteiten worden getoond
- **Aangepaste UI**: Interface past zich aan aan gebruikersprofiel
- **Voortgangstracking**: Bijhouden van voltooide activiteiten

### 🚀 Technische Features
- **Real-time updates**: Live synchronisatie van activiteitenstatus
- **Responsive design**: Werkt op desktop, tablet en mobiel
- **Toegankelijkheid**: Ontworpen voor gebruikers met verschillende beperkingen
- **Data persistentie**: Alle instellingen en voortgang worden opgeslagen

## 🛠️ Technische Stack

| Categorie | Technologie | Versie | Doel |
|-----------|------------|--------|------|
| **Frontend** | React | 18+ | User interface |
| **Styling** | Tailwind CSS | v4 | Responsive design |
| **Backend** | Node.js | 16+ | Server-side logic |
| **Database** | SQLite/SQL | - | Data opslag |
| **Authentication** | JWT | - | Beveiligde authenticatie |
| **Build Tool** | Vite/Webpack | - | Development & build |

## 🚀 Quick Start Guide

### Vereisten

Zorg ervoor dat je het volgende hebt geïnstalleerd:

- **Node.js** (versie 16 of hoger)
- **npm** of **yarn** package manager
- **Git** voor versiecontrole

### Installatie

1. **Clone het project**

   ```bash
   git clone <repository-url>
   cd Health-Hub
   ```

2. **Installeer dependencies**

   ```bash
   npm install
   ```

3. **Configureer omgevingsvariabelen**

   Maak een `.env` bestand in de root directory:

   ```env
   PORT=5000
   NODE_ENV=development
   DB_PATH=./data/day-planning-app.db
   DB_DEMO_DATA=true
   JWT_SECRET=YourSecretKeyForDevelopmentOnly_ChangeMeInProduction
   JWT_EXPIRY=8h
   ```

4. **Initialiseer de database**

   ```bash
   npm run init-db
   ```

5. **Start de development server**

   ```bash
   npm run dev
   ```

   De applicatie is nu beschikbaar op `http://localhost:3000`

### Production Deployment

1. **Build de applicatie**

   ```bash
   npm run build
   ```

2. **Start production server**

   ```bash
   npm start
   ```

## 📁 Projectstructuur

```text
Health-Hub/
├── api/                    # Backend API endpoints
│   ├── activities_js.tsx
│   ├── auth_js.tsx
│   └── users_js.tsx
├── components/             # React componenten
│   ├── ui/                # Herbruikbare UI componenten
│   ├── ActivityCard.tsx
│   ├── AdminPanel.tsx
│   └── ...
├── contexts/              # React Context providers
├── database/              # Database schema en migraties
├── public/                # Statische bestanden
├── scripts/               # Build en deployment scripts
├── styles/                # CSS en styling bestanden
├── utils/                 # Utility functies
├── package.json           # NPM dependencies
└── README.md             # Dit bestand
```

## 🗄️ Database Schema

Het systeem gebruikt een SQLite database met de volgende kernentiteiten:

### Gebruikers & Profielen

- **users** - Cliëntinformatie en basisgegevens
- **user_disabilities** - Specifieke beperkingen per gebruiker
- **user_preferences** - Persoonlijke voorkeuren en instellingen

### Activiteiten

- **activity_templates** - Herbruikbare activiteitensjablonen
- **activities** - Geplande activiteiten voor specifieke gebruikers
- **group_activity_participants** - Deelnemers aan groepsactiviteiten

### Administratie

- **admin_users** - Beheerder accounts
- **activity_history** - Historische activiteitendata
- **app_settings** - Applicatie-brede instellingen

## 🔌 API Documentatie

### Authenticatie Endpoints

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| `POST` | `/api/auth/login` | Inloggen beheerder |
| `GET` | `/api/auth/me` | Huidige gebruikersinfo |
| `POST` | `/api/auth/change-password` | Wachtwoord wijzigen |
| `POST` | `/api/auth/setup` | Eerste beheerder aanmaken |

### Gebruikers Endpoints

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| `GET` | `/api/users` | Alle gebruikers ophalen |
| `GET` | `/api/users/:id` | Specifieke gebruiker |
| `POST` | `/api/users` | Nieuwe gebruiker aanmaken |
| `PUT` | `/api/users/:id` | Gebruiker bijwerken |
| `DELETE` | `/api/users/:id` | Gebruiker verwijderen |

### Activiteiten Endpoints

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| `GET` | `/api/activities/user/:userId/date/:date` | Activiteiten voor gebruiker/datum |
| `GET` | `/api/activities/templates` | Alle activiteitensjablonen |
| `POST` | `/api/activities/templates` | Nieuw sjabloon aanmaken |
| `POST` | `/api/activities/generate/:userId` | Activiteiten genereren |

## 🔐 Standaard Inloggegevens

Voor eerste toegang tot het admin panel:

- **Gebruikersnaam**: `admin`
- **Wachtwoord**: `admin123`

> ⚠️ **Belangrijk**: Wijzig deze gegevens direct na eerste login!

## 🧪 Testing & Development

### Available Scripts

| Script | Beschrijving |
|--------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build productie versie |
| `npm run test` | Run unit tests |
| `npm run lint` | Code linting |
| `npm run format` | Code formatting |

### Code Style Guidelines

- **ESLint** voor JavaScript/TypeScript linting
- **Prettier** voor code formatting
- **Conventional Commits** voor commit messages
- **TypeScript** strict mode enabled

## 🤝 Contributing (Voor Studenten)

### Voor je begint

1. **Fork** het project naar je eigen GitHub account
2. **Clone** je fork lokaal
3. Maak een nieuwe **feature branch** aan
4. Lees de bestaande code door om de architectuur te begrijpen

### Development Workflow

1. **Issue aanmaken**

   ```text
   - Beschrijf het probleem of de feature
   - Voeg labels toe (bug, enhancement, etc.)
   - Assigneer jezelf
   ```

2. **Feature branch**

   ```bash
   git checkout -b feature/jouw-feature-naam
   ```

3. **Development**

   - Schrijf clean, gedocumenteerde code
   - Voeg tests toe waar mogelijk
   - Test je wijzigingen lokaal

4. **Pull Request**

   - Duidelijke titel en beschrijving
   - Link naar gerelateerde issues
   - Screenshots bij UI wijzigingen

### Code Review Proces

- Minimaal 1 review van teamlid vereist
- Alle tests moeten slagen
- Code moet voldoen aan style guidelines
- Documentatie moet up-to-date zijn

## 📈 Roadmap & Toekomstige Features

### Geplande Verbeteringen

- [ ] **Multi-language support** (Nederlands/Engels)
- [ ] **Mobile app** (React Native)
- [ ] **Advanced reporting** dashboard
- [ ] **API rate limiting** en beveiliging
- [ ] **Real-time notifications**
- [ ] **Export functionaliteit** (PDF/Excel)
- [ ] **Integration** met externe kalender systemen

### Bekende Issues

- Performance optimalisatie nodig voor grote datasets
- Mobile responsiveness kan verbeterd worden
- Offline functionaliteit ontbreekt

### Documentatie

- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Database Schema](./docs/database.md)

## 📄 Licentie

Dit project is gelicenseerd onder de **MIT License** - zie het [LICENSE](LICENSE) bestand voor details.

### Open Source Notice

Dit is een educatief project. Voel je vrij om:

- ✅ Code te gebruiken voor leermateriaal
- ✅ Features toe te voegen en te verbeteren
- ✅ Issues te rapporteren en op te lossen
- ✅ Documentatie te verbeteren

---

## Gemaakt met ❤️ door studenten voor studenten

> 💡 **Tip**: Begin met het bekijken van `components/Welcome.tsx` om de applicatieflow te begrijpen!