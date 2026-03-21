# DBML Full Syntax Reference

DBML (Database Markup Language) is a simple, readable DSL to define database structures. This guide covers its full syntax and features for AI coding agents.

## Project Definition
Provide an overall description of your database project.

```dbml
Project project_name {
  database_type: 'PostgreSQL'
  Note: 'Description of the project'
}
```

## Schema & Table Definition
If `schema_name` is omitted, it defaults to `public`.

```dbml
// Default "public" schema
Table table_name {
  column_name column_type [column_settings]
}

// Specific schema
Table auth.users {
  id integer [primary key]
  email varchar(255) [unique, not null]
}
```

### Table Alias
Use aliases for shorthand in relationships.

```dbml
Table very_long_user_table as U { ... }
Ref: U.id < posts.user_id
```

### Table Settings
Settings go in `[]` after the table name:
- `headercolor: #3498DB`: Change the header color.

```dbml
Table users [headercolor: #3498DB] { ... }
```

## Column Definition
Columns consist of `name type [settings]`.

### Column Settings
- `primary key` or `pk`
- `null` or `not null`
- `unique`
- `increment`: Auto-incrementing value.
- `default: value`: Set a default (use backticks for expressions like `` `now()` ``).
- `note: 'string'`: Descriptive note.
- `ref: ...`: Inline relationship definition.
- ``check: `expression` ``: Add a check constraint.

Example:
```dbml
Table products {
  id integer [pk, increment]
  price decimal(10,2) [not null, default: 0]
  status varchar [note: 'Product status']
}
```

## Indexes
Define single or multi-column indexes within a table.

```dbml
Table bookings {
  id integer
  country varchar
  indexes {
    id [pk]
    (country, id) [unique]
    country [type: hash]
    (`lower(country)`) // Expression index
  }
}
```

## Relationships (Refs)
Defines foreign key constraints.
- `<`: One-to-many
- `>`: Many-to-one
- `-`: One-to-one
- `<>`: Many-to-many

### Syntax Styles
- **Short form**: `Ref: table1.col > table2.col`
- **Long form**:
  ```dbml
  Ref name_optional {
    schema1.table1.col1 < schema2.table2.col2
  }
  ```
- **Inline form**: `id integer [ref: > users.id]`
- **Composite foreign keys**: `Ref: table1.(col1, col2) > table2.(col1, col2)`

### Relationship Settings
Only for long/short forms:
- `delete / update: cascade | restrict | set null | set default | no action`
- `color: #79AD51`: Line color.

Example:
```dbml
Ref: products.merchant_id > merchants.id [delete: cascade, color: #79AD51]
```

## Enums
Fixed sets of values for a column.

```dbml
Enum job_status {
  created [note: 'Waiting']
  running
  done
}

Table jobs {
  status job_status
}
```

## Advanced Features

### TableGroups
Group related tables together for visualization.

```dbml
TableGroup identity [color: #345] {
  users
  user_profiles
}
```

### TablePartials
Reuse fields and settings across multiple tables.

```dbml
TablePartial timestamps {
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table users {
  id int [pk]
  ~timestamps
}
```

### Notes
- **Sticky Notes**: `Note: 'This is a sticky note'` outside any block.
- **Multi-line Strings**: Use `'''` for notes.
  ```dbml
  Note: '''
    This is a
    multi-line note.
  '''
  ```

### Comments
- `// single line`
- `/* multi line */`

## Records (Sample Data)
Provide example data within or outside table definitions.

```dbml
Table users {
  id int [pk]
  name varchar
  records {
    1, 'Alice'
    2, 'Bob'
  }
}
```
