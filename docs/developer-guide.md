# Developer Guide: OpenAPI Exchange Protal Naming Conventions

## Table of Contents

1. [General Naming Guidelines for API](#1-general-naming-guidelines-for-api)
2. [Developer Guide for Database Naming Conventions](#2-developer-guide-for-database-naming-conventions)
2. [NgRx Developer Guide for Angular](#3-ngrx-developer-guide-for-angular)

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

# 3 NgRx Developer Guide for Angular

## State Management Concepts

- **State**: The single source of truth for your application.
- **Actions**: Events that describe something that happened in the application.
- **Reducers**: Pure functions that take the current state and an action, and return a new state.
- **Selectors**: Functions that select a slice of state from the store.
- **Effects**: Side effects that handle asynchronous operations.

## Selectors

- Define selectors in separate files (e.g., `feature.selectors.ts`).
- Use the `createSelector` function to create selectors.

### Accepted Selector names

1. **select**: A prefix that indicates the function is a selector.
2. **Feature**: The name of the feature or module the selector is related to. This helps in
   identifying which part of the application the selector belongs to.
3. **Entity**: The specific entity or resource the selector is concerned with. This could be a noun
   representing the data type.
4. **Property**: (Optional) The specific property of the entity being selected. This is useful when
   you want to select a specific attribute of an entity.

### Example Selector Names

Here are some examples of selector names following the proposed convention:

- **Feature Selectors**
    - `selectFeatureState`: Selects the entire state for the feature.
    - `selectAllFeatures`: Selects all features from the state.
    - `selectFeatureById`: Selects a feature by its ID.
    - `selectFeatureData`: Selects the data property of the feature state.
    - `selectFeatureError`: Selects the error property of the feature state.

## Actions

- Define actions in separate files (e.g., `feature.actions.ts`).
- Use the `createAction` function to create actions.
- Use descriptive names for actions to clearly indicate their purpose. Below are examples of action
  names for common operations:

### Accepted Action names

- `loadFeature`: Triggered to load a feature.
- `selectFeature`: Triggered to select a specific feature.
- `saveFeature`: Triggered to save a new feature.
- `updateFeature`: Triggered to update an existing feature.
- `deleteFeature`: Triggered to delete a feature.
- `filterFeatures`: Triggered to apply filters to the list of features.
- `getFeatureById`: Triggered to retrieve a feature by its ID.
- `removeFeature`: Triggered to remove a feature from the list.
- `addFeature`: Triggered to add a feature to the list.

### Accepted Action names for Effects responses

- `<actionName>Success`: Triggered when the feature is successfully removed.
- `<actionName>Failure`: Triggered when removing the feature fails.

## Reducers

- Define reducers in separate files (e.g., `feature.reducers.ts`).
- Use the createReducer function to create reducers.
- Handle actions using the `on` function.

## Effects

- Define effects in separate files (e.g., `feature.effects.ts`).
- Use the createEffect function to create effects.
- Handle side effects and asynchronous operations.
- Effect class should be

```text
@Injectable()
export class FeatureEffects {
 ...
}
```

### Example Effect Names

Here are some examples of effect names following the proposed convention:

### Accepted Feature names

    - `load$`: Triggered when the load feature action is dispatched.
    - `select$`: Triggered when the select feature action is dispatched.
    - `save$`: Triggered when the save feature action is dispatched.
    - `update$`: Triggered when the update feature action is dispatched.
    - `delete$`: Triggered when the delete feature action is dispatched.
    - `filter$`: Triggered when the filter features action is dispatched.
    - `getById$`: Triggered when the get feature by ID action is dispatched.
