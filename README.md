N423 Final Project - Elissa Murphy

---

Web 4 Link: https://in-info-web4.informatics.iupui.edu/~elrmurph/n423-finalProject/n423-final/dist/

This appliation is a fully working CRUD application using Firebase for authentification and storage. 

Requirements include:
- Must be a CRUD application
- Must look like the prototype/proposal
- Must be styled and look professional
- Must run on Web 4 with Firebase

To use this application, a user can...
1. Create an account on the Login page 
2. Log out of the account or log back into it later
3. Add (or create) recipes to be displayed on the Explore Recipes page
4. View the recipes they add on the Explore Recipes page
5. Edit, save, and delete a recipe
6. Favorite a recipe to be displayed on the Favorite Recipes page for easy access
7. View their account information on the View Account page 

When a user adds a recipe, the following information will need to be provided: 
- Recipe name
- Recipe Description
- Recipe Prep Time
- Recipe Ingredients
- Recipe Instructions
- Image of Recipe

All users are authenticated through Firebase. 
- If a user is not logged in, they cannot access the View Account Page
- If a user has difficulty signing in, an alert will inform the user of what their error is (wrong email, etc.)

Also, all recipes and their images are stored using Firebase Storage. Therefore, when a user adds a recipe to the application, the recipe will still be there when they return. 

The homepage of the application also outlines the features of the application and guides the user on how to begin. Alerts are presented to the user as they navigate throughout the site to help guide them. 

All design prototyping was done using Adobe XD: https://xd.adobe.com/view/6b2987c1-5fbd-4d34-8d30-a914f884a402-3e7a/grid
