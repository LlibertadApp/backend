# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2023-11-19

### Added

- Data processing worker

### Changed

- Moving from DynamoDB to PostgreSQL
- Changed token claims format

### Added
- Support for Amazon DAX
- API Version path prefix (`/v1`)
- GET /v1/actas/{mesaId} - Get scrutiny data for a given mesaId (#71)
- GET /v1/actas - Get uploaded scrutunies by the user (#71)
- Verify total envelopes vs scrutiny data

### Removed

- Endpoint GET /config
- DynamoDB support

## [0.1.0-alpha] - 2023-11-9

### Added

- Authentication Endpoint.
- Upload Endpoint.

[unreleased]: https://github.com/LlibertadApp/backend/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/LlibertadApp/backend/compare/v0.1.0-alpha...v1.0.0
[0.1.0-alpha]: https://github.com/LlibertadApp/backend/releases/tag/v0.1.0-alpha
