import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyCeKVsomm5QVcoN6MYpshnaND44aIwOFv0",
  authDomain: "n423-em.firebaseapp.com",
  projectId: "n423-em",
  storageBucket: "n423-em.appspot.com",
  messagingSenderId: "1043941398957",
  appId: "1:1043941398957:web:325746d5ede6f805fa6924",
});

const auth = getAuth(firebaseConfig);
const db = getFirestore(firebaseConfig);
const storage = getStorage(firebaseConfig);

var currentEditRecipe;

var favRecipes = [];

export function changePage(pageID, subPage, callback) {
  if (
    subPage == undefined &&
    pageID != "exploreRecipe" &&
    pageID != "account" &&
    pageID != "favRecipe"
  ) {
    $.get(`pages/${pageID}/${pageID}.html`, function (data) {
      $("#app").html(data);
      loginListeners();
    }).fail((error) => {
      if (error.status == "404") {
        alert("Page cannot be found.");
      }
    });
  } else if (pageID == "exploreRecipe") {
    $.get(`pages/exploreRecipe/exploreRecipe.html`, async function (data) {
      $("#app").html(data);
      const querySnapshot = await getDocs(collection(db, "Recipes"));
      querySnapshot.forEach((doc) => {
        $("#allData").append(`<div class="allRecipes-Indiv-Box">
        <div class="all-Recipes-Indiv-Img"><img src="${
          doc.data().image
        }" /></div>
          <p class="allRecipes-Indiv-Title">${doc.data().title}</p>
          <p class="allRecipes-Indiv-Desc">${doc.data().description}</p>
          <div class="allRecipes-Indiv-Box-Btns">
            <button class="viewYourRecipe-btn" id="${
              doc.id
            }">View Recipe</button>
            <span><button id="${
              doc.id
            }" class="favARecipe-btn"><i class="far fa-heart fa-2x"></i></button></span>
          </div>
        </div>`);
        loginListeners();
        addRecipeEditBtnListener();
        addRecipeFavBtnListener();
        callback();
      });
    });
  } else if (pageID == "account") {
    const user = auth.currentUser;
    if (user) {
      // User is signed in
      $.get(`pages/account/account.html`, function (data) {
        $("#app").html(data);
        $(".yourAccountPage_username").append(` ${user.email}`);
      }).fail((error) => {
        if (error.status == "404") {
          alert("Page cannot be found.");
        }
      });
    } else {
      // No user is signed in.
      Swal.fire({
        title: "<strong>NO USER</strong>",
        html: "Please sign in to get started.",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<a href="#login">Sign up or sign in!</a>',
        cancelButtonText: '<a href="#home">Maybe Later...</a>',
      });
    }
  } else if (pageID == "favRecipe") {
    $.get(`pages/favRecipe/favRecipe.html`, function (data) {
      $("#app").html(data);
      favRecipes.forEach((recipe) => {
        $("#favRecipes-list").append(`
          <div class="allRecipes-Indiv-Box">
          <div class="all-Recipes-Indiv-Img"><img src="${recipe.image}" /></div>
            <p class="allRecipes-Indiv-Title">${recipe.title}</p>
            <p class="allRecipes-Indiv-Desc">${recipe.description}</p>
            <p class="allRecipes-Indiv-Desc">Prep Time: ${recipe.time}</p>
            <p class="allRecipes-Indiv-Desc">Ingredients: ${recipe.ingredients}</p>
            <p class="allRecipes-Indiv-Desc">Instructions: ${recipe.instructions}</p>
          </div>
          `);
      });
    }).fail((error) => {
      if (error.status == "404") {
        alert("Page cannot be found.");
      }
    });
  } else {
    $.get(`pages/${pageID}/${subPage}.html`, function (data) {
      $("#app").html(data);
    }).fail((error) => {
      if (error.status == "404") {
        alert("Page cannot be found.");
      }
    });
  }
}

function route() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  let pageIDArray = pageID.split("/");
  pageID = pageIDArray[0];
  let subPageID = pageIDArray[1];
  if (!pageID) {
    changePage("home");
  } else if (pageID == "" || pageID == "home") {
    changePage(pageID, subPageID);
  } else if (pageID == "login") {
    changePage(pageID, subPageID, loginListeners);
  } else if (pageID == "exploreRecipe") {
    changePage(pageID, subPageID, loginListeners);
  } else {
    if (pageID === subPageID) {
      changePage(pageID);
    } else {
      changePage(pageID, subPageID);
    }
  }
}

function loginListeners() {
  $("#addRecipe").on("click", addRecipeToDB);
  $("#toggleIcon").on("click", toggleNav);
  $("#siep").on("click", signIN);
  $("#soep").on("click", signOutWithEP);
  $("#createNewUser").on("click", signUpWithEP);
}

//Toggle Nav
function toggleNav() {
  var x = document.getElementById("links");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

//connect to sign in form
function signIN() {
  let em = document.getElementById("email").value;
  let pw = document.getElementById("pw").value;

  signInWithEmailAndPassword(auth, em, pw)
    .then((userCredential) => {
      const user = userCredential.user;

      document.getElementById("email").value = "";
      document.getElementById("pw").value = "";

      Swal.fire({
        title: "<strong>You are signed in!</strong>",
        html: "Add a Recipe to Get Started",
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<a href="#addRecipe">Get Started</a>',
        cancelButtonText: '<a href="#account">View Account Information</a>',
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "<strong>Oops!</strong>",
        html: error.code,
        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,

        cancelButtonText: "Try again!",
      });
      console.log(error.code);
    });
}

//Creates user so they can come back later and sign into same account
function signUpWithEP() {
  let em = document.getElementById("em").value;
  let pw = document.getElementById("passw").value;

  createUserWithEmailAndPassword(auth, em, pw)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      document.getElementById("em").value = "";
      document.getElementById("passw").value = "";

      Swal.fire({
        title: "<strong>You are signed up!</strong>",
        html: "Add a Recipe to Get Started",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<a href="#addRecipe">Get Started</a>',
        cancelButtonText: '<button id="soep">Sign Out</button>',
      });
    })
    .catch((error) => {
      console.log(error.code);
    });
}

function signOutWithEP() {
  signOut(auth)
    .then(() => {
      console.log("Signed Out");
    })
    .catch((error) => {
      console.log(error.code);
    });

  Swal.fire({
    title: "<strong>You are signed out.</strong>",
    showCloseButton: false,
    showCancelButton: false,
    focusConfirm: false,
    confirmButtonText: '<i class="fa fa-thumbs-up"></i>',
  });
}

//Updating login/logout status
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in");
  } else {
    console.log("no user");
  }
});

//Add recipe to database
function addRecipeToDB() {
  console.log("Added recipe");
  let title = document.getElementById("title").value.toLowerCase();
  let desc = document.getElementById("description").value.toLowerCase();
  let time = document.getElementById("time").value.toLowerCase();
  let ingred = document.getElementById("ingredients").value.toLowerCase();
  let instr = document.getElementById("instructions").value;
  let file = $("#recipeImg").get(0).files[0];
  let fileName = +new Date() + "-" + file.name;
  let pathRef = ref(storage, "recipeImages-423Final/" + fileName);
  const storageRef = ref(storage, pathRef);

  const uploadTask = uploadBytesResumable(storageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      console.log("file available at ", downloadURL);

      let recipe = {
        title: title,
        description: desc,
        time: time,
        ingredients: ingred,
        instructions: instr,
        image: downloadURL,
      };

      addData(recipe);
    });
  });

  Swal.fire({
    title:
      "<strong style='text-align: center;'>You added a recipe to your 'Explore Recipe' Page.</strong>",
    html: "Check out your new recipe now!",
    showCloseButton: false,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: '<a href="#exploreRecipe">Explore Recipes</a>',
    cancelButtonText: "Add another recipe!",
  });
}

//Add recipe to database
async function addData(recipe) {
  try {
    const docRef = await addDoc(collection(db, "Recipes"), recipe);
    getAllRecipes();
  } catch (e) {
    console.log(e);
  }
}

//Button Disabler - edit, save, delete recipes btns
function addEditSaveListener() {
  $("#edit").on("click", (e) => {
    $("#data input").prop("disabled", false);
  });
  $("#save").on("click", (e) => {
    updateRecipe();
    Swal.fire({
      title:
        "<strong style='text-align: center;'>Your recipe has been updated!</strong>",
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<a href="#addRecipe">Add Another Recipe?</a>',
      cancelButtonText: "<i class='fa fa-thumbs-down'></i> No thanks.",
    });
  });
  $("#delete").on("click", (e) => {
    deleteRecipe();
  });
}

//Delete Recipe
async function deleteRecipe() {
  await deleteDoc(doc(db, "Recipes", currentEditRecipe));
  $("#data").html("");

  Swal.fire({
    title:
      "<strong style='text-align: center;'>Your recipe has been deleted.</strong>",
    showCloseButton: false,
    showCancelButton: false,
    focusConfirm: true,
    confirmButtonText: '<a href="#addRecipe">Add another recipe!</a>',
  });

  getAllRecipes();
}

async function updateRecipe() {
  const recipeRef = doc(db, "Recipes", currentEditRecipe);
  let title = document.getElementById("title").value.toLowerCase();
  let desc = document.getElementById("description").value.toLowerCase();
  let time = document.getElementById("time").value.toLowerCase();
  let ingred = document.getElementById("ingredients").value.toLowerCase();
  let instr = document.getElementById("instructions").value;

  await updateDoc(recipeRef, {
    title: title,
    description: desc,
    time: time,
    ingredients: ingred,
    instructions: instr,
  });

  getRecipe(currentEditRecipe);
  viewSingleRecipe(currentEditRecipe);

  //Reprints People data displayed on screen
  getAllRecipes(currentEditRecipe);
}

//Edit Recipe Button - brings recipe up to edit
async function getRecipe(recipeID) {
  const docRef = doc(db, "Recipes", recipeID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    currentEditRecipe = recipeID;
    let aRecipe = docSnap.data();
    $("#data").html(
      `
      <input type="text" id="title" value="${aRecipe.title}" disabled />
      <input type="text" id="description" value="${aRecipe.description}" disabled />
      <input type="text" id="time" value="${aRecipe.time}" disabled />
      <input type="text" id="ingredients" value="${aRecipe.ingredients}" disabled />
      <input type="text" id="instructions" value="${aRecipe.instructions}" disabled />
      <button id="edit">Edit</button>
      <button id="save">Save</button>
      <button id="delete">Delete Profile</button>`
    );

    addEditSaveListener();
  } else {
    console.log("No document");
  }
}

//Updates the recipe info
function addRecipeEditBtnListener() {
  $("button.viewYourRecipe-btn").on("click", (e) => {
    viewSingleRecipe(e.currentTarget.id);
  });
}

//add to favorite recipes btn listener
function addRecipeFavBtnListener() {
  $("button.favARecipe-btn").on("click", (e) => {
    addRecipeToFavs(e.currentTarget.id);
  });
}

//Displays all recipes
async function getAllRecipes() {
  $.get(`pages/exploreRecipe/exploreRecipe.html`, async function () {
    $("#allData").html("");
    const querySnapshot = await getDocs(collection(db, "Recipes"));
    querySnapshot.forEach((doc) => {
      $("#allData").append(`<div class="allRecipes-Indiv-Box">
      <div class="all-Recipes-Indiv-Img"><img src="${doc.data().image}" /></div>
        <p class="allRecipes-Indiv-Title">${doc.data().title}</p>
        <p class="allRecipes-Indiv-Desc">${doc.data().description}</p>
        <div class="allRecipes-Indiv-Box-Btns">
          <button class="viewYourRecipe-btn" id="${doc.id}">View Recipe</button>
          <span><button id="${
            doc.id
          }" class="favARecipe-btn"><i class="far fa-heart fa-2x"></i></button></span>
        </div>
      </div>`);
    });
  });
  addRecipeEditBtnListener();
}

//Add recipe to 'Favorites Page' function
async function addRecipeToFavs(recipeID) {
  const docRef = doc(db, "Recipes", recipeID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    currentEditRecipe = recipeID;
    let aRecipe = docSnap.data();

    //Push the chosen 'favorited recipe' into the array of Favorited Recipes
    favRecipes.push(aRecipe);

    Swal.fire({
      title:
        "<strong style='text-align: center;'>Your recipe was added to your 'Favorite Recipes' Page.</strong>",
      html: "Check out your favorited recipe now!",
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<a href="#favRecipe">Check it out!</a>',
      cancelButtonText: "Add another recipe!",
    });
  } else {
    Swal.fire({
      title:
        "<strong style='text-align: center;'>No favorited recipes at this time.</strong>",
      html: "Check out your favorited recipe now!",
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<a href="#addRecipe">Add a recipe!</a>',
      cancelButtonText: '<a href="#home">No thanks.</a>',
    });
  }
}

async function viewSingleRecipe(recipeID) {
  changePage("viewRecipe");

  const docRef = doc(db, "Recipes", recipeID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    currentEditRecipe = recipeID;

    let aRecipe = docSnap.data();
    $("#singleRecipe").html(
      `
      <div class="test1">
        <div id="data">
          <div class="viewSingleRecipe-row1">
            <div class="viewSingleRecipe-row1Img">
            <div class="all-Recipes-Indiv-Img"><img src="${aRecipe.image}" /></div></div>
            <input class="test" type="text" id="title" value="${aRecipe.title}" disabled />
          </div>
          <div class="viewSingleRecipe-row3-buttons">
          <button id="edit">Edit</button>
          <button id="save">Save</button>
          <button id="delete">Delete</button>
        </div>
            <div class="viewSingleRecipe-row2">
            <p>Description:</p>
              <input class="aRecipe-description" type="text" id="description" value="${aRecipe.description}" disabled />
              <p> Prep Time:</p>
              <input class="aRecipe-time" type="text" id="time" value="${aRecipe.time}" disabled />
              <p> Ingredients:</p>
              <input class="aRecipe-ingredients" type="text" id="ingredients" value="${aRecipe.ingredients}" disabled />
              <p> Instructions:</p>
              <input class="aRecipe-instructions" type="text" id="instructions" value="${aRecipe.instructions}" disabled />
            </div>
          </div>
      </div>`
    );

    addEditSaveListener();
  } else {
    console.log("No document");
  }
}

//Initializing functions
function initApp() {
  $(window).on("hashchange", route);
  route();
}

$(document).ready(function () {
  initApp();
});
