# AI Workplace Productivity Assistant

## 1. Project Overview

The AI Workplace Productivity Assistant is a modern, responsive web application designed to help professionals automate common workplace tasks using Artificial Intelligence (AI).

The application provides three AI-powered productivity tools:

* Smart Email Generator

* Meeting Notes Summariser

* AI Task Planner

The application uses a clean, professional SaaS-style dashboard with a pastel pink, black, and white colour scheme. It includes sidebar navigation, editable AI-generated outputs, and responsible AI guidance.

The application is frontend-focused and does not use user accounts, authentication, or a database.

---

## 2. Features Implemented

### 2.1 Smart Email Generator

The Smart Email Generator helps users create professional workplace emails based on their own input.

Features include:

* Users enter the purpose and key points of an email.

* Users can select a tone:

    * Formal

    * Friendly

    * Persuasive

* AI generates an email based on the user’s input.

* Generated emails can be edited.

* Users can copy the generated email.

* Users can clear the generated content.

### 2.2 Meeting Notes Summariser

The Meeting Notes Summariser helps users process workplace information and identify important details.

Features include:

* Users can enter or paste meeting notes, articles, or website URLs.

* AI generates a summary based on the provided content.

* The output is organised into:

    * Summary

    * Action Items

    * Decisions

    * Deadlines

* Generated results can be edited.

* Users can copy the generated results.

* Users can clear the generated content.

### 2.3 AI Task Planner

The AI Task Planner helps users organise and prioritise their workload.

Features include:

* Users enter tasks and deadlines.

* Users enter their available working time.

* Users can select:

    * Daily

    * Weekly

* AI generates a prioritised schedule based on the user’s input.

* The schedule includes:

    * Priority

    * Task

    * Date/Time

    * Deadline

* Generated schedules can be edited.

### 2.4 Dashboard

The application includes a dashboard that acts as the main landing page.

The dashboard provides access to the three productivity tools:

* Smart Email Generator

* Meeting Notes Summariser

* AI Task Planner

Each tool is presented as a card that links to its corresponding feature.

### 2.5 Settings

The Settings section provides information about the application, data, and responsible AI use.

It includes:

**About This Assistant**

AI Workplace Productivity Assistant helps professionals automate workplace tasks using AI.

**Your Data**

There is no account and no database. Nothing typed into the application is stored by the application. Information remains within the current browser session and may disappear when the page is refreshed or closed.

**Responsible AI Use**

Users are advised to:

* Review AI-generated outputs before using or sending them.

* Check important facts, figures, names, and dates against reliable sources.

* Avoid entering confidential or sensitive personal information.

* Remain responsible for anything sent to colleagues or clients.

---

## 3. Technologies and Tools Used

### Development

* Lovable

* GitHub:'https://pink-ai-assistant.lovable.app/'

### Artificial Intelligence

* AI-generated content

* Structured AI prompts

* AI-powered email generation

* AI-powered content summarisation

* AI-powered task planning and scheduling

### Application Design

* Responsive web application

* SaaS-style dashboard

* Sidebar navigation

* Interactive forms

* Editable AI-generated outputs

* Pastel pink, black, and white colour scheme

### Backend and Data Storage

* No custom backend

* No database

* No authentication

* No user account system

---

## 4. Project Structure

```text

AI-Workplace-Productivity-Assistant/

│

├── src/

│   ├── components/

│   │   ├── EmailGenerator

│   │   ├── MeetingNotesSummariser

│   │   ├── TaskPlanner

│   │   ├── Dashboard

│   │   └── Settings

│   │

│   ├── pages/

│   │   ├── Dashboard

│   │   ├── EmailGenerator

│   │   ├── MeetingNotesSummariser

│   │   ├── TaskPlanner

│   │   └── Settings

│   │

│   └── ...

│

├── public/

│

├── README.md

├── package.json

└── ...
5. Setup Instructions
Step 1: Clone the Repository

Clone the project repository from GitHub:

git clone <YOUR-GITHUB-REPOSITORY-URL>

Step 2: Open the Project

Navigate into the project directory:

cd AI-Workplace-Productivity-Assistant
Step 3: Install Dependencies

Install the required dependencies:

npm install
Step 4: Start the Development Server

Run the development server:

npm run dev
Step 5: Open the Application

Open the local development URL provided by the development server in a web browser.

The dashboard can then be used to access the Email Generator, Meeting Notes Summariser, Task Planner, and Settings.

⸻
6. Usage
Smart Email Generator

Open Email Generator from the sidebar.

Enter the purpose and key points of the email.

Select the required tone.

Generate the email.

Review and edit the generated email.

Copy the email when it is ready.
Meeting Notes Summariser

Open Meeting Notes Summariser from the sidebar.

Enter or paste meeting notes, an article, or a website URL.

Generate the summary.

Review the Summary, Action Items, Decisions, and Deadlines.

Edit the results if necessary.

Copy the final output.
AI Task Planner

Open Task Planner from the sidebar.

Enter your tasks and deadlines.

Enter your available working time.

Select Daily or Weekly.

Select Generate Schedule.

Review the prioritised schedule.

Edit the schedule if necessary.

⸻
7. Responsible AI Notice

AI-generated content may contain errors, incomplete information, or inaccurate information.

Users should:

Review and verify AI-generated outputs before using them.

Check important facts, figures, names, and dates against reliable sources.

Avoid entering confidential or sensitive personal information.

Review workplace communications before sending them.

Remain responsible for anything they send to colleagues or clients.

The AI Workplace Productivity Assistant is intended to support workplace productivity and should not replace human judgement.

⸻
8. Data and Privacy

The application does not use user accounts, authentication, or a database.

There is no persistent user data storage within the application. Information entered by users is intended to remain within the current browser session and may disappear when the page is refreshed or closed.

Users should avoid entering confidential, private, or sensitive workplace information.

⸻
9. Author

Author: Caylin Arendse

Project: AI Workplace Productivity Assistant

⸻
10. License

This project is licensed under the MIT License.

You are free to use, modify, and distribute the project in accordance with the terms of the MIT License.

⸻
11. Project Purpose

The AI Workplace Productivity Assistant was developed as an AI-powered productivity application to demonstrate how Artificial Intelligence can be used to automate common workplace tasks.

The project focuses on three workplace productivity tasks:

Generating professional emails

Summarising meeting information and extracting important details

Planning and prioritising workplace tasks

The application demonstrates the use of structured AI prompts and AI-generated outputs within a modern workplace productivity interface.
 
