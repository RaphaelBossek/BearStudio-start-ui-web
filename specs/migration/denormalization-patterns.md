# Denormalization Patterns

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **See Also**: [MongoDB Reference](./mongodb-reference.md), [Schema Mapping](./schema-mapping.md)

---

## Overview

MongoDB's document model encourages embedding related data within a single document. PostgreSQL's relational model requires normalizing this data into separate tables with foreign key relationships.

This document describes what was embedded in MongoDB and how it was normalized in PostgreSQL.

---

## Embedded → Normalized Patterns

### Pattern 1: User Profiles

**MongoDB (Embedded)**:
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  userProfile: {
    firstName: "John",
    lastName: "Doe",
    title: "Dr.",
    signature: "base64...",
    phoneNumber: "+49..."
  }
}
```

**PostgreSQL (Normalized)**:
```sql
-- users table
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES users(id),
  first_name varchar(255),
  last_name varchar(255),
  title varchar(100),
  signature text,
  phone_number varchar(50)
);
```

**Migration Notes**:
- One-to-one relationship
- Profile data extracted to separate table
- `user_id` is unique foreign key

---

### Pattern 2: Appointment Assignments

**MongoDB (Embedded Array)**:
```javascript
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  startTime: ISODate("2024-01-01T10:00:00Z"),
  assignments: [
    {
      userId: ObjectId("..."),
      state: "assigned",
      assignedAt: ISODate("2024-01-01T09:00:00Z")
    },
    {
      userId: ObjectId("..."),
      state: "pending",
      assignedAt: ISODate("2024-01-01T09:00:00Z")
    }
  ]
}
```

**PostgreSQL (Normalized)**:
```sql
-- appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  state varchar(50) NOT NULL
);

-- appointment_assignments table
CREATE TABLE appointment_assignments (
  id uuid PRIMARY KEY,
  appointment_id uuid REFERENCES appointments(id),
  user_id uuid REFERENCES users(id),
  state varchar(50) NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(appointment_id, user_id)
);
```

**Migration Notes**:
- One-to-many relationship
- Each array element becomes a row
- Compound unique constraint on (appointment_id, user_id)

---

### Pattern 3: Invoice Positions

**MongoDB (Embedded Array)**:
```javascript
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  invoiceNumber: "INV-2024-001",
  positions: [
    {
      jobId: ObjectId("..."),
      description: "Consultation",
      quantity: 2,
      unitPrice: 150.00,
      total: 300.00
    },
    {
      productId: ObjectId("..."),
      description: "Medical supplies",
      quantity: 5,
      unitPrice: 25.00,
      total: 125.00
    }
  ],
  totalAmount: 425.00
}
```

**PostgreSQL (Normalized)**:
```sql
-- invoices table
CREATE TABLE invoices (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers(id),
  invoice_number varchar(50) UNIQUE NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  state varchar(50) DEFAULT 'draft'
);

-- invoice_positions table
CREATE TABLE invoice_positions (
  id uuid PRIMARY KEY,
  invoice_id uuid REFERENCES invoices(id),
  job_id uuid REFERENCES jobs(id),
  product_id uuid REFERENCES products(id),
  description varchar(255),
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  CHECK (job_id IS NOT NULL OR product_id IS NOT NULL)
);
```

**Migration Notes**:
- One-to-many relationship
- Each array element becomes a row
- Either `job_id` or `product_id` must be set

---

### Pattern 4: Prescription Items

**MongoDB (Embedded Array)**:
```javascript
{
  _id: ObjectId("..."),
  consultationId: ObjectId("..."),
  medicationName: "Ibuprofen",
  items: [
    {
      activeIngredient: "Ibuprofen",
      dosage: "400mg",
      frequency: "3x daily"
    }
  ]
}
```

**PostgreSQL (Normalized)**:
```sql
-- prescriptions table
CREATE TABLE prescriptions (
  id uuid PRIMARY KEY,
  consultation_id uuid REFERENCES consultations(id),
  medication_name varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- prescription_items table
CREATE TABLE prescription_items (
  id uuid PRIMARY KEY,
  prescription_id uuid REFERENCES prescriptions(id),
  active_ingredient varchar(255),
  dosage varchar(255),
  frequency varchar(100)
);
```

**Migration Notes**:
- One-to-many relationship
- Each array element becomes a row

---

### Pattern 5: Contact Addresses

**MongoDB (Embedded Object)**:
```javascript
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  firstName: "John",
  lastName: "Doe",
  businessAddress: {
    street: "Main St 123",
    city: "Berlin",
    zipCode: "10115",
    country: "DE"
  },
  privateAddress: {
    street: "Side St 456",
    city: "Munich",
    zipCode: "80331",
    country: "DE"
  }
}
```

**PostgreSQL (Normalized)**:
```sql
-- contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES customers(id),
  first_name varchar(255),
  last_name varchar(255),
  email varchar(255),
  phone varchar(50)
);

-- addresses table
CREATE TABLE addresses (
  id uuid PRIMARY KEY,
  contact_id uuid REFERENCES contacts(id),
  type varchar(50) NOT NULL, -- 'business' or 'private'
  street varchar(255),
  city varchar(255),
  zip_code varchar(20),
  country varchar(2)
);
```

**Migration Notes**:
- One-to-many relationship (one contact can have multiple addresses)
- Address type distinguishes business vs private

---

## Query Pattern Changes

### MongoDB Query
```javascript
// Get appointment with assignments
db.appointments.findOne({ _id: "..." })
// Returns appointments with embedded assignments array
```

### PostgreSQL Query
```sql
-- Get appointment with assignments
SELECT 
  a.*,
  json_agg(json_build_object(
    'id', aa.id,
    'user_id', aa.user_id,
    'state', aa.state,
    'assigned_at', aa.assigned_at
  )) AS assignments
FROM appointments a
LEFT JOIN appointment_assignments aa ON a.id = aa.appointment_id
WHERE a.id = '...'
GROUP BY a.id;
```

## Performance Considerations

### MongoDB Advantages
- Single document read for all data
- No joins required
- Natural data grouping

### PostgreSQL Advantages
- Better data integrity (foreign keys, constraints)
- More efficient updates (don't rewrite entire document)
- Better for complex queries across relationships
- ACID compliance for transactions

## Migration Strategy

1. **Identify all embedded patterns** in MongoDB collections
2. **Design normalized schema** in PostgreSQL
3. **Create transformation scripts** for each pattern
4. **Validate data integrity** after transformation
5. **Update application queries** to use joins or separate queries

## References

- [MongoDB Reference](./mongodb-reference.md) - Collection index
- [Schema Mapping](./schema-mapping.md) - Field-by-field mappings
- [Data Migration](./data-migration.md) - Migration scripts
- [Cutover Plan](./cutover-plan.md) - Production migration strategy
