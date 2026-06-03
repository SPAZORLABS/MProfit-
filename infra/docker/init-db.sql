-- Aurapex Next — Database Initialization
-- Creates required extensions and schemas

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS Aurapex;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS market;

-- Grant usage
GRANT USAGE ON SCHEMA Aurapex TO Aurapex_admin;
GRANT USAGE ON SCHEMA audit TO Aurapex_admin;
GRANT USAGE ON SCHEMA market TO Aurapex_admin;

-- Set default schema
ALTER DATABASE Aurapex SET search_path TO Aurapex, public;
