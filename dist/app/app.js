// export function changePage(pageID, subPage) {
//   //getting the subpage id & navigating with url
//   if (subPage == undefined) {
//     $.get(`pages/${pageID}/${pageID}.html`, function (data) {
//       $("#app").html(data);
//       //error if subpage id can't be found
//     }).fail((error) => {
//       if (error.status == "404") {
//         alert("Page cannot be found.");
//       }
//     });
//     //getting the page id & navigating with url
//   } else {
//     $.get(`pages/${pageID}/${subPage}.html`, function (data) {
//       $("#app").html(data);
//       //error if page id can't be found
//     }).fail((error) => {
//       if (error.status == "404") {
//         alert("Page cannot be found.");
//       }
//     });
//   }
// }

// function route() {
//   let hashTag = window.location.hash;
//   let pageID = hashTag.replace("#", "");

//   let pageIDArray = pageID.split("/");
//   pageID = pageIDArray[0];
//   let subPageID = pageIDArray[1];
//   if (!pageID) {
//     changePage("home");
//   } else if (pageID == "" || pageID == "home") {
//     changePage(pageID, subPageID, buyNow);
//   } else if (pageID == "books") {
//     changePage(pageID, subPageID, buyNow);
//   } else if (pageID == "cart") {
//     changePage(pageID, subPageID, deleteItem);
//   } else if (pageID == "account") {
//     changePage(pageID, subPageID);
//   } else {
//     if (pageID === subPageID) {
//       changePage(pageID);
//     } else {
//       changePage(pageID, subPageID);
//     }
//   }
// }

// //Initializing functions
// function initApp() {
//   $(window).on("hashchange", route);
//   route();
// }

// $(document).ready(function () {
//   initApp();
// });
