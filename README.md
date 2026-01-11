# 💸 DevBills – Back-End

API REST do **DevBills**, uma aplicação de controle financeiro pessoal.
Responsável por autenticação, gerenciamento de usuários, transações
(receitas e despesas) e categorias.

---

## 🚀 Tecnologias
- **Node.js**
- **TypeScript**
- **Fastify**
- **Prisma ORM**
- **PostgreSQL**
- **JWT**
- **Zod**
- **ESLint / Biome**

---

## 🧱 Arquitetura
- Padrão em camadas (Controller → Service → Repository)
- Autenticação via JWT
- Validação com Zod
- ORM com Prisma
- Commits semânticos
- GitFlow

---

## 📁 Estrutura
```text
src/
 ├─ modules/
 ├─ routes/
 ├─ controllers/
 ├─ services/
 ├─ schemas/
 ├─ prisma/
 └─ server.ts
