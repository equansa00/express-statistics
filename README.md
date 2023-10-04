# express-statistics
Express Routing Exercises
This project is a simple Express.js application designed to perform statistical operations on a list of numbers. The application can calculate the mean, median, and mode, and supports additional features like saving results to a file.

Features
Base Routes:

/mean to calculate the average.
/median to determine the midpoint.
/mode to find the most frequent number.
Parameters:

Each route accepts a nums query parameter, which is a comma-separated list of numbers. E.g., /mean?nums=1,2,3,4.
Response Format:

Responses are structured as JSON. Example:
json
Copy code
{
  "operation": "mean",
  "value": 2.5
}
Error Handling:

The application handles invalid numbers and missing input gracefully.
Further Study:

An additional /all route calculates mean, median, and mode simultaneously.
The app can save results to a results.json file if a save=true query parameter is provided.
Timestamps are added for every saved operation.
The application respects the Accept header, serving either JSON or HTML based on client preference.
Getting Started
Prerequisites
Node.js and npm installed on your machine.
Installation
Clone the repository:

bash
Copy code
git clone [repository-url]
Navigate to the project directory:

bash
Copy code
cd express-statistics
Install the required packages:

Copy code
npm install
Start the server:

sql
Copy code
npm start
Open your browser and navigate to http://localhost:3000 to access the application.

Testing
You can use tools like Postman or your browser to test the endpoints. Send GET requests with the appropriate nums parameter to see results.

For example:

http://localhost:3000/mean?nums=1,2,3,4 to get the mean of the provided numbers.
