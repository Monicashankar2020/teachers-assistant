# Online Teacher's Assistant Application

This online application is created with the needs of teachers in mind, and to **eliminate** their *repetitive and time consuming* tasks by **automating** them, so that they have more time and energy to focus on their students, and so that the teachers are not overburdened.

## Key Features of the OTAA

### Implemented Features

1. AI powered Quiz generation using Google Forms API
2. Automated Quiz Evaluation
3. User Authentication
4. Automated Feedback for students
5. Ease of access to important information
6. Quiz Creation
7. Separate dashboards for teachers and students.

### Upcoming Features

1. Smart grouping of students to form efficient study groups, based on each student's strenghts and weaknesses.
2. Ability for students to create their own quizzes for practice.

## Hardware Requirements

| Component   | Minimum                                 |
|-------------|------------------------------------------|
| **CPU**     | Dual-core (e.g., Intel i3 / Ryzen 3)     |
| **RAM**     | 4 GB                                     |
| **Storage** | SSD with at least 10 GB free             |
| **GPU**     | Not necessary                            |
| **OS**      | Windows 10+, macOS, or Linux             |
| **Node.js** | v18 or higher (LTS recommended)          |
| **Internet** | For installation and prisma studio      |

| Component   | Recommended                                         |
|-------------|-----------------------------------------------------|
| **CPU**     | Quad-core (Intel i5 / Ryzen 5 or better)            |
| **RAM**     | 8 GB or more                                        |
| **Storage** | SSD (NVMe preferred), 20 GB+ free                   |
| **GPU**     | Integrated is fine unless using WebGL, etc.         |
| **Extras**  | Good internet for `npm/yarn` installs, VS Code      |


## Software Requirements

1. Windows 10 or above.
2. Visual Studio Code or a similar code editor.
3. Node.js (Next.js)
4. Gemini API
5. Google Forms API
6. PostgreSQL

## Tech Stack

1. Next.js 
2. Tailwind CSS version 3
3. Gemini API
4. Prisma ORM
5. PostgreSQL
6. React
**Refer to package.json for all the additional installed packages!**

## Project Structure

**teachers-assistant** is the main root directory of this project. 
**components** contains react components used throughout the application such as ClassCard, Loader, StudentList, CreateQuiz, etc.
**lib** contains the utility files that are used throughout the application. 
**node_modules** contains all the node.js dependancies. This folder is obtained after running `npm install` in the terminal.
**pages** directory contains all the pages/routes in this application. This application uses page router.
    |--> **api** contains all the custom API routes of this application.
**styles** contains files related to the style of the application, using mainly tailwindcss version 3
**public** contains images, icons and other static media which can be imported by the entire application.
**utils** contains other utility files, such as sendEmail. 



## Set-up Instructions

**Step 1: Clone this GitHub Repository**

Copy this repository link and run `git clone` in your device's terminal. Then run `cd teacher-assistant-1` to enter the project folder.
Run `code .` to open the project in Visual Studio Code.

**Step 2: Install dependencies**

Run `npm install` in the VS Code terminal to install dependencies, and the node_modules folder.

**Step 3: Set-up your .env file**

In the teacher-assistant-1 folder, create a `.env` file and add the following environment variables with appropriate values.

*Get Gemini API key, client email and private key from google AI studio.*
GEMINI_API_KEY
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_API_KEY

*Get database related variables from vercel after deployment*
DATABASE_URL
TRANSACTION_POOLER_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SMTP_EMAIL
SMTP_PASSWORD
EMAIL_USER
EMAIL_PASS
JWT_SECRET

*Obtain the google variables from google cloud console.*
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000

**Step 4: Run Prisma Migrations**

Run the following commands in the terminal: 
```bash
npx prisma db push
npx prisma generate
npx prisma studio
```
This will start the prisma studio in localhost:5000

**Step 5: Start development server**

Run `npm run dev` in the VS Code terminal. *This project is ready for deployment in vercel.*

## References

1) [Next.js Documentation](https://nextjs.org/docs) 
2) [Learn Next.js](https://nextjs.org/learn-pages-router) 
3) [TailwindCSS Documentation](https://tailwindcss.com/docs/)
4) [Prisma ORM Documentation](https://www.prisma.io/docs)
5) [Google Forms API Documentation](https://developers.google.com/apps-script/reference/forms)
6) [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## Authors

1. [Keerthana R](https://github.com/keerthanar09)
2. [Monica S](https://github.com/Monicashankar2020)
3. Sneha K M
4. Poorvi V Jain








