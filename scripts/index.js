//The bookmark app allows users to pin their favorite website to the app by [INPUT URL], 
//adding a brief [DESCRIPTION] of the pinned website, giving it [TITLE] and a [1-5 RATING].

//when the app first load it will display saved bookmarks and the form for adding new bookmarks
//Form >>[INPUT URL], [TITLE], [DESCRIPTION], [SAVE]

/*Display form information--bookmark
[INPUT URL], --use id to retrieve val $('#url').val();
[TITLE] --use id to retrieve val $('#title').val();
[DESCRIPTION] --use id to retrieve val $('#description').val();
*/

import api from './api.js';
import store from './store.js';
import $ from 'jquery';


// export function toggleAccordion(){
//   let accordion = document.getElementsByClassName('accordion');

//   $('.accordion').on('click', function(){
//     this.classList.toggle('active');
//   })
  
//   let panel = this.nextElementSibling;
//   if(panel.style.maxHeight){
//     panel.style.maxHeight= "null";
//   }else{
//     panel.style.maxHeight = panel.scrollHeight + "px";
//   }
  
// }

$(function(){
  $('.bookmark-element').accordion({collapsible: true})
})

export function generateBookmark(bookmark) {
  return `
    <li  data-item-id="${bookmark.id}">
     <button class="accordion"><a href="${bookmark.url}"> ${bookmark.title} </a></button>
      <div class="panel">
      <p>Description: ${bookmark.desc} </p>
      <p>Rating: ${bookmark.rating} </p>
      <br>
      <button class="delete-bookmark">Delete Bookmark</button>
      </div>
    </li>
  `;
}


export function generateBookmarkList() {
  console.log(store.bookmarks);
  return `<div class="filter-by-rating"><select name="filter-by-rating">
  <option value="0">Filter by Rating</option>
  <option value="5">5-star</option>
  <option value="4">4-star</option>
  <option value="3">3-star</option>
  <option value="2">2-star</option>
  <option value="1">1-star</option>
</select></div>

    <ul class="bookmark-element">
      ${store.bookmarks.map((bookmark) => generateBookmark(bookmark).join())}
    </ul>
  `;

}



//the content that will be displayed at the start 
function generateForm() {
  return `
    <form class="add-new">
      <label for="bookmark">New Bookmark</label><input type="text" id="url"  value="https://"  >
      <label for="title">Title</label><input type="text" id="title" placeholder="Title" />
      <label for="desc">Description</label><input type='text' id="desc" placeholder="Description"/>
      <div class="rating"><label for="rating">Rating</label>
        <input type="radio" class="star star-1" id="star1-rating" name="star" value="1"><label class="star star-1" for="star-1"></label>
        <input type="radio" class="star star-2" id="star2-rating" name="star" value="2"><label class="star star-2" for="star-2"></label>
        <input type="radio" class="star star-3" id="star3-rating" name="star" value="3"><label class="star star-3" for="star-3"></label>
        <input type="radio" class="star star-4" id="star4-rating" name="star" value="4"><label class="star star-4" for="star-4"></label>
        <input type="radio" class="star star-5" id="star5-rating" name="star" value="5"><label class="star star-5" for="star-5"></label>
      </div>
      <button type='submit' class='submit-button'>Submit</button> 
    </form>
    `;
}

// event handlers
//when a new bookmark is submitted, retrieves the user's data and creates an object for the bookmark
export function handleSubmitBookmark() {
  $('.main').on('click', '.submit-button', (e) => {
    e.preventDefault();
    const url = $('#url').val();
    const title = $('#title').val();
    const desc = $('#desc').val();
    const rating = $('input [type="radio"]').val();
    const bookmark = { url, title, desc, rating };

    console.log(bookmark);

    api
      .createNewBookmark(bookmark)
      .then((bookmark) => {
        console.log(bookmark);
        store.setAddedBookmark(bookmark);
        render();
      })
      .catch((err) => {
        console.log(err);
        store.setError(err.message);
        render();
      });
  });
}


// helper for delete --retrieves the id of the item
function getIdFromEl(item) {
  return $(item).closest('.bookmark-element').data('item-id');
}

export function handleDeleteBookmark() {
  $('.bookmark').on('click', '.delete-bookmark', (e) => {
    e.preventDefault();
    const id = getIdFromEl(e.currentTarget);
    api
      .deleteBookmark(id)
      .then(() => {
        store.setDeleteBookmark(id);
        render();
      })
      .catch((err) => {
        console.log(err);
        store.setError(err.message);
        render();
      });
  });
}



// function handleRating(){
//   $('input [type="radio"]').on('click', function(){
//     const ratingValue = $('input[name="star"]:checked').val();
//   })}


function bindEventListeners() {
  handleSubmitBookmark();
  handleDeleteBookmark();
}
//dynamically add content 
function render() {
  let html = '';
  html += generateBookmarkList();
  $('.bookmark').html(html);
}

function start() {
  bindEventListeners();
  api
    .fetchAllBookmarks()
    .then((bookmarks) => {
      store.setAllBookmarks(bookmarks);
      render();
    })
    .catch((err) => {
      console.log(err);
      store.setError(err.message);
      render();
    });
}


function main() {
  render();
  start();
  let form = '';
  form += generateForm();
  $('.main').html(form);
}

$(main());
