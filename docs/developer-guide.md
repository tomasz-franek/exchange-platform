# Developer Guide: OpenAPI Exchange Protal Naming Conventions

## Introduction

This guide outlines the naming conventions for OpenAPI specifications to ensure consistency and
clarity across API documentation. Following these conventions will help developers understand and
use the API more effectively.

## 1. General Naming Guidelines for API

- Use **camelCase** for variable names and properties.
- Use **PascalCase** for object types and model names.
- Use **camelCase** for query parameters and path variables.
- Keep names **descriptive** but **concise**.

## Paths

- Use plural nouns for resource paths.
    - Example: `/users`, `/products`
- Use `{}` to denote path parameters.
    - Example: `/users/{userId}`

## HTTP Methods

- Use standard HTTP methods:
    - `GET` for retrieving resources.
    - `POST` for creating resources.
    - `PUT` for updating resources.
    - `DELETE` for removing resources.

## Parameters

- **Path Parameters**: Use `{parameterName}` format.
- **Query Parameters**: Use `parameter_name` format.
- **Header Parameters**: Use `X-Custom-Header` format for custom headers.

## Response Codes

- Use standard HTTP status codes:
    - `200 OK` for successful requests.
    - `201 Created` for successful resource creation.
    - `204 No Content` for successful deletion.
    - `400 Bad Request` for client errors.
    - `404 Not Found` for non-existent resources.
    - `500 Internal Server Error` for server errors.

## Models

- Use **PascalCase** for model names.
    - Example: `UserProfile`, `ProductDetails`
- Use descriptive names that reflect the purpose of the model.

## Properties

- Use **camelCase** for property names.
    - Example: `firstName`, `lastName`, `productId`
- Keep property names consistent across models.

## ErrorResponse Object

The `ErrorResponse` object is used to standardize error responses across the API. It includes the
following properties:

- **errorCode**: A string representing the error code.
- **uuid**: A unique identifier for the error instance.
- **message**: A descriptive message explaining the error.

### Example

```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        errorCode:
          type: string
          description: A code representing the type of error
        errorId:
          type: string
          format: uuid
          description: A unique identifier for the error instance
        message:
          type: string
          description: A descriptive message explaining the error
```

## 2. Developer Guide for Database Naming Conventions

This document outlines the naming conventions for database objects to ensure consistency and clarity
across the database schema.

## Table Naming

- **Table Names**: Use singular nouns to represent the entity (e.g., `user`, `order`, `product`).

## Primary Key

- **Primary Key Column**: Always name the primary key column as `id`.
- **Primary Key Constraint Name**: The primary key constraint should be named in the format
  `<table_name>_pk` (e.g., `user_pk`, `order_pk`).

## Foreign Key

- **Foreign Key Column**: Name foreign key columns in the format `<foreign_table>_id` (e.g.,
  `user_id`, `product_id`).
- **Foreign Key Constraint Name**: Use the format `<table_name>_<foreign_table>_fk` for foreign key
  constraints (e.g., `order_user_fk`).

## Sequencer

- **Sequencer Name**: Name the sequencer in the format `<table_name>_seq` (e.g., `user_seq`,
  `order_seq`).

## Indexes

- **Index Name**: Name indexes in the format `<table>_<columns>_idx` (e.g., `user_name_idx`,
  `order_date_idx`).

## Unique Constraints

- **Unique Constraint Name**: Name unique constraints in the format `<table>_<column>_uq` (e.g.,
  `user_email_uq`, `product_sku_uq`).

## Additional Requirements

1. **Consistency**: Ensure that naming conventions are consistently applied across all tables and
   columns.
2. **Descriptive Names**: Use descriptive names that clearly indicate the purpose of the table or
   column.
3. **Avoid Abbreviations**: Avoid using abbreviations unless they are widely recognized and
   understood.
4. **Lowercase**: Use lowercase letters for all table and column names to maintain uniformity.
5. **Underscores for Separation**: Use underscores to separate words in names for better
   readability (e.g., `order_date`).
6. **Documentation**: Document any deviations from these conventions in the project documentation.
7. **Timezone**: All date and time fields should be stored in UTC timezone to ensure consistency
   across different regions.
8. **String Columns Size**: The size of string columns should not be excessively large compared to
   the data they are expected to hold. Define appropriate lengths based on the expected content.

## Database Change Management with Liquibase

1. **All Changes via Liquibase**: All database schema changes, including table creation,
   modification, and deletion, must be executed through Liquibase scripts. This includes changes to
   tables, columns, indexes, constraints, and any other database objects.

2. **Version Control**: Each Liquibase script must be versioned and stored in a version control
   system (e.g., Git). This ensures that all changes are tracked and can be rolled back if
   necessary.

3. **ChangeLog Files**: Organize Liquibase changes into ChangeLog files. Each ChangeLog file should
   represent a logical grouping of changes and should be named descriptively (e.g.,
   `2025-05-23-add-user-table.xml`).

4. **ChangeSet Structure**: Each change within a ChangeLog file should be defined as a ChangeSet.
   Each ChangeSet must have a unique ID and author to facilitate tracking and auditing.

