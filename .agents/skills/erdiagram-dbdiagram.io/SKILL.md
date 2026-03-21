---
name: dbdiagram
description: Guides and best practices for creating dbdiagram.io (DBML) files. Use this for defining database schemas, relationships, and visualizations using the Database Markup Language.
---

# dbdiagram.io (DBML) Skill

DBML (Database Markup Language) is an open-source DSL to define database schemas. It's designed to be readable and easily converted to SQL, and is the core language used by dbdiagram.io.

## Core Syntax Overview

A typical DBML file consists of Tables, Relationships (Refs), and Enums.

```dbml
// Use Table for defining tables
Table users {
  id integer [primary key]
  username varchar
  email varchar [unique]
  created_at timestamp
}

// Use Ref for defining relationships
Ref: posts.user_id > users.id // many-to-one

// Use Enum for defining fixed sets of values
Enum post_status {
  draft
  published
  archived
}
```

## When to use this skill

- Designing a new database schema.
- Documenting an existing database.
- Visualizing table relationships.
- Generating SQL from a schema definition.

## Detailed Syntax and Reference

For a complete guide on DBML syntax, including advanced features like TableGroups, TablePartials, and Sticky Notes, refer to the syntax documentation.

Link: `references/syntax.md`

## Best Practices

1. **Naming Conventions**: Use `snake_case` for table and column names to maintain consistency with most SQL databases.
2. **Notes**: Use the `note` attribute to document the purpose of tables and columns.
3. **TableGroups**: Group related tables (e.g., `auth`, `billing`, `content`) to make large diagrams more readable.
4. **Colors**: Use `headercolor` for tables and `color` for refs/tablegroups to visually distinguish different modules.
5. **Relationships**: Prefer the short form `Ref: table1.col > table2.col` for clarity, or inline `[ref: > table.col]` for simple one-to-many links.
6. **Enums**: Consolidate duplicate or highly similar Enum definitions into shared, logically named Enums (e.g., `DayOfWeek_Enum`, `JobType_Enum`) to maintain consistency and avoid redundancy.
7. **Column Settings**: Merge multiple column settings into a single set of brackets `[]`, separated by commas (e.g., `_id number [pk, note: 'Interner Bezeichner']` instead of `_id number [pk] [note: '...']`).
8. **Data Types**: All data types must be single-word strings without spaces (e.g., `DocumentDBRef` instead of `Document/DBRef`). Use camelCase or underscores for complex names. Example: `JSON`, `JSONB`, `decimal(1,2)`.
