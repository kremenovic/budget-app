# budget-app
<h1>Budget App Project</h1>

<a href="#"><img src="https://i.imgur.com/xUpO3XI.png"></a>

Budget planner has been my new project for a github portfolio. Like in Todo List project, I used BEM, SCSS and vanilla JS. 

For the first time, I used OOP and it was very interesting. Maybe I could use it more in the project, but there is one and mainc class Transactions. 

Instead of using local storage for storing the data, I decide to go with Firebase. Also, for the chart I used chart.js. 

Functionalities that this project has are:

- Add income/expense
- Remove income/expense
- Update balance
- Update chart
- Update progress bar
- Register/Login/Logout

Since I used Firebase, everything is updated in real time. 

I am aware that some things could be written better, because there is a part after the // FIREBASE comment in main.js file where the code is repeating, but I'm still learning new things. 

<h3>How to install</h3>

<h4>1. Create new Firebase project</h4>

Create new Firebase project, and copy/paste your web app's Firebase configuration in firebase.js file.

<h4>2. Update Firestore Database Rules</h4>

After that, you need to go to Firestore Database and update the rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
    // match any doc in transactions collection
    match /transactions/{transactionId} {
    	allow read, write: if request.auth.uid != null;
    }
  }
```

<h4>3. Add New Index</h4>

To be able to sort transactions properly after reloading the page, there is one more thing you need to add new index in Firestore Databse Indexes. The index is going to be:

```
Collection ID: transactions
Fields Indexed: user Ascending id Ascending
Query Scope: Collection
```

<h3>Final Words</h3>

This could be a great starter kit for a project with React or any other framework where new features could be added, such as:

- User profile
- User settings
    - Set up color scheme
    - Set up expense categories

<h3>Live demo</h3>
<a href="#" target="_blank">Click here to see live demo</a>