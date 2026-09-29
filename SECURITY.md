# Security Policy

## Supported versions
This project is in active development. Security updates are applied to the latest branch under development and the latest release line.

## Reporting a vulnerability
Please report any suspected vulnerability privately rather than in a public issue. Use the repository maintainer contact or GitHub private security reporting if enabled.

## Public disclosure guidance
Do not publicly disclose:
- JWT secret values
- database passwords
- API keys
- local environment details that could help attackers

## Local development rules
- Never commit `.env` files
- Use `.env.example` as the baseline
- Store secrets only in GitHub secrets or local secure environment storage
- Validate all request payloads and enforce auth checks on protected endpoints

## Project security baseline
- password hashing with bcrypt
- JWT-based authentication
- role-based authorization checks
- input validation and rate limiting
- no secrets stored in repository source files
