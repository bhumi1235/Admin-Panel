# Security Guard Admin System

A production-grade application for managing security guards and supervisors.

## Project Structure

This repository contains the **frontend application only**. The backend API is hosted separately on an external platform.

- `frontend/`: React application built with Vite and deployed to Vercel

## Architecture

- **Frontend**: React + Vite (this repository)
- **Backend**: Node.js/Express API with PostgreSQL (hosted externally)
- **Frontend Deployment**: Vercel
- **Backend Deployment**: External platform (configured via environment variables)

## Setup Instructions

1. Navigate to the `frontend/` directory
2. Copy `.env.example` to `.env` and configure your backend API URL
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## Environment Variables

The frontend requires a `.env` file with the backend API endpoint. See `frontend/.env.example` for the required configuration.
