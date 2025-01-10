Test Cases for Project
This document outlines the test cases that need to pass for the project. The tests are categorized into different levels: Unit Tests, Integration Tests, and E2E Tests.

## Getting Started

End task

```bash

yarn dev => yarn test:unit

```

Before commit

```bash

yarn dev => yarn test

```

## 1. Unit Tests

-   run service worker: get data in app.
-   init data learning
-   init data diagnostic test
-   init data practice test
-   init data final test
-   init data custom test
-   choice answer
-   next question
-   finish test

## 2. Integration Tests

These tests validate interactions between multiple components or modules.

ID Description Expected Result
I01 Form submission updates the database Form should save data and trigger API requests successfully.
I02 Navigation links work as expected Clicking on navigation links should load the correct pages.
I03 User authentication flow Users can log in, log out, and maintain session state.
I04 Component lifecycle with API calls Components should handle loading, success, and error states.

## 3. E2E Tests

These tests validate the entire application flow from the user's perspective.

ID Description Expected Result
E01 User can complete a full signup process User is redirected to the dashboard after signing up.
E02 User can log in and view their profile Profile page displays user information correctly.
E03 Search functionality works correctly Search results match the query input.
E04 Pages load within acceptable performance limits Page load time is less than 2 seconds.
E05 Errors are displayed for invalid inputs Users see error messages for invalid form submissions.
Notes
Ensure all tests are run in the specified environments:
