Sentinel – AI-Based Crime Detection and Reporting System

Sentinel is a full-stack web application designed to simplify and digitize crime reporting. The platform enables users to report incidents through an intuitive web form or an AI-powered chatbot. Submitted reports are securely stored in MongoDB Atlas and displayed in real time on an interactive crime map and an administrative dashboard for analysis and monitoring.

The system classifies reported incidents into categories such as theft, assault, fraud, vandalism, and other crimes using keyword-based analysis. Administrators can monitor reports, visualize crime statistics through charts, view incident locations on a map, and manage submitted reports efficiently.

Key Features
AI-powered chatbot for interactive crime reporting
Crime report submission through a structured form
Automatic crime categorization
Interactive crime map using Leaflet
Real-time admin dashboard with charts and analytics
Secure storage using MongoDB Atlas
RESTful API built with Express.js
Responsive and modern React user interface
CRUD operations for crime reports
Real-time visualization of crime locations
Technology Stack

Frontend

React.js
TypeScript
Vite
Tailwind CSS
Framer Motion
React Query
Leaflet Maps
Recharts

Backend

Node.js
Express.js
MongoDB Node.js Driver

Database

MongoDB Atlas
Project Workflow
User
   │
   ▼
React Web Application
   │
   ▼
Express REST API
   │
   ▼
MongoDB Atlas
   │
   ▼
Admin Dashboard & Crime Map

running 
* frontend -> cd frontend -> npm run dev

* backend -> cd backend -> npm run dev
