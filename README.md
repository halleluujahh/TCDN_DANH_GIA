# MISA Workshift Management

### System Architecture

```
┌──────────────────────────────────────────┐
│   MISA_FE_Clean (Frontend - Vue 3)       │ http://localhost:5173
├──────────────────────────────────────────┤
│   MISA_BE (Backend API - ASP.NET Core)   │ http://localhost:5000
├──────────────────────────────────────────┤
│   MySQL Database                         │ localhost:3306
└──────────────────────────────────────────┘
```

---

## Backend (MISA_BE)

### Backend Technologies

- **ASP.NET Core 8.0** - Web framework
- **C#** - Programming language
- **MySQL** - Database
- **FluentValidation** - Validation
- **Swagger/OpenAPI** - API documentation

### Backend Structure

```
MISA_BE/
├── MISA_Core/              # Business logic & DTOs
│   ├── Dtos/               # Data transfer objects
│   ├── Entities/           # Domain models
│   ├── Services/           # Business logic
│   ├── Validator/          # FluentValidation
│   └── Interfaces/         # Contracts
├── Misa_Infrastructure/    # Data access layer
│   ├── Repositories/       # Database operations
│   └── DbContext/          # MySQL connection
└── MISA_Workshift/         # API layer
    ├── Controller/         # REST endpoints
    └── Middlewares/        # Exception handling
```
### API Endpoints

```
GET    /api/shifts          - Get all shifts
GET    /api/shifts/{id}     - Get shift details
POST   /api/shifts          - Create new shift
PUT    /api/shifts/{id}     - Update shift
DELETE /api/shifts/{id}     - Delete shift
```

---

## Frontend (MISA_FE_Clean)

### Frontend Technologies

- **Vue 3** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **Axios** - HTTP client
- **DevExtreme** - UI components

### Frontend Structure

```
MISA_FE_Clean/
├── src/
│   ├── apis/               # API calls
│   ├── components/         # Vue components (Base + Features)
│   ├── composables/        # Reusable logic
│   ├── constants/          # Constants
│   ├── layout/             # Layout components
│   ├── router/             # Routes definition
│   ├── services/           # Business logic
│   ├── stores/             # Pinia state management
│   ├── types/              # TypeScript types
│   └── views/              # Pages
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Main Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vue | 3.5.24 | Framework UI |
| pinia | 3.0.4 | State management |
| vue-router | 4.6.4 | Routing |
| axios | 1.13.2 | HTTP client |
| devextreme | 25.2.3 | UI components |
| typescript | 5.9.3 | Type checking |
| vite | 7.2.4 | Build tool |

---

## Features

- Shift management (CRUD)
- View, edit, delete shifts
- Search & filter
- Type-safe API calls
- State management with Pinia
- Reusable UI components
- Responsive design
- API documentation (Swagger)

---

## Best Practices

### Backend
- DTOs separate API contracts
- Business logic in Services
- Data access via Repositories
- FluentValidation for validation
- GlobalExceptionMiddleware
- Dependency Injection
- Async/await for I/O

### Frontend
- Small, reusable components
- Logic extracted to composables
- API calls via services
- State centralized (Pinia)
- TypeScript full type-safe
- Props validation

## References

- [ASP.NET Core Docs](https://docs.microsoft.com/en-us/aspnet/core/)
- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [Pinia Docs](https://pinia.vuejs.org/)

---

## Project Information

| Item | Details |
|------|---------|
| **Version** | 1.0.0 |
| **Year** | 2026 |
| **Backend Framework** | ASP.NET Core 8.0 |
| **Frontend Framework** | Vue 3 + TypeScript |
| **Database** | MySQL |
| **Architecture** | Clean Architecture |

---

## 📚 Purpose

This project is developed for **educational and training purposes**.

