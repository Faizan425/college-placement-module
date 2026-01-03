# College Placement Management System

A full-stack web application to manage campus placement drives, streamline student applications, and automate email notifications for eligible candidates.

## Features

### Student Module
* **Secure Login:** Unique dashboards for students.
* **Profile Management:** Build a Resume/Profile (CGPA, Arrears, Resume Links).
* **Smart Eligibility Check:** Students can only apply to companies if they meet specific criteria (Min CGPA, No History of Arrears, etc.).
* **Real-time Dashboard:** View placement status and application history.

### Admin Module
* **Statistics Dashboard:** Visual analytics of Average Package and Placement Rates using Chart.js.
* **Company Management:** Add new companies with specific constraints (Year, CGPA, Backlogs).
* **Automated Email Blasts:** The system automatically scans the database for eligible students and sends email notifications via SMTP (Gmail) when a new company is added.

---

## Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Chart.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** Session-based auth with `bcrypt` encryption
* **Email Service:** Nodemailer (SMTP)

---

##  Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/placement-management-system.git](https://github.com/YOUR_USERNAME/placement-management-system.git)
cd placement-management-system 
```
### 2.Install Dependencies

```bash
 npm install
 ```

 ### 3. Environment Configuration
 # Server Port
```bash
PORT=3000
```
# MongoDB Connection String (Local or Atlas)
```bash
MONGO_URI=mongodb://localhost:27017/db_name
```
# Session Secret 
```bash
COOKIE_KEY=your_secret_key_here
```
# Email Configuration 
# NOTE: If using Gmail, you must use an App Password.
```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```
### 4.Run the Application
```bash
npm run dev
# OR
npx nodemon server.js
```
### For production environments
```bash
node server.js
```
