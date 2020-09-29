import api from './api.js';
import store from './store.js';
import $ from 'jquery';

export function generateBookmark(bookmark) {
  return `
    <li class="bookmark-element" data-item-id="${bookmark.id}">
      <fieldset>
        <div class="container">
          <div class="accordion">
            <a href="${bookmark.url}" target="_blank"> ${bookmark.title}</a>
            <p>Rating: ${bookmark.rating} </p>
          </div>
          <div class="panel hidden">
            Description: ${bookmark.desc}
              <br>
            <button class="delete-bookmark">Delete</button>
          </div>
        </div>
      </fieldset>
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
<ul class="bookmark-element"> ${store.bookmarks.map((bookmark) => generateBookmark(bookmark))}
    </ul>`;

}

function generateForm() {
  return `
    <form class="add-new">
      <label for="bookmark">New Bookmark</label><input type="text" id="url"  value="https://"  >
      <label for="title">Title</label><input type="text" id="title" placeholder="Title" />
      <label for="desc">Description</label><input type='text' id="desc" placeholder="Description"/>
      <div>
        <label for="rating">Rating</label>
        <input type="radio" class="star star-1" id="star1-rating" name="star" value=1 required>
        <label class="star star-1" for="star1-rating"></label>
        <input type="radio" class="star star-2" id="star2-rating" name="star" value=2>
        <label class="star star-2" for="star2-rating"></label>
        <input type="radio" class="star star-3" id="star3-rating" name="star" value=3>
        <label class="star star-3" for="star3-rating"></label>
        <input type="radio" class="star star-4" id="star4-rating" name="star" value=4>
        <label class="star star-4" for="star4-rating"></label>
        <input type="radio" class="star star-5" id="star5-rating" name="star" value=5>
        <label class="star star-5" for="star5-rating"></label>
      </div>
      <button type='submit' class='submit-button'>Submit</button>
    </form>
    `;
}


export function handleSubmitBookmark() {
  $('.main').on('click', '.submit-button', (e) => {
    e.preventDefault();
    const url = $('#url').val();
    let title = $('#title').val();
    title = title.charAt(0).toUpperCase() + title.slice(1);
    const desc = $('#desc').val();
    // let rating = $('input:checked').val();
    let rating = Number($('input[name="star"]:checked').val())
    console.log(rating, "rating");
    const bookmark = { url, title, desc, rating };

    console.log(bookmark, "coming from this line");

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

function bindEventListeners() {
  handleSubmitBookmark();
  handleDeleteBookmark();
}
//dynamically add content
function render() {
  let html = '';
  html += generateBookmarkList();
  $('.bookmark').html(html);
  toggleAccordion();
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

function toggleAccordion() {
  setTimeout(() => {
    const acc = document.querySelectorAll(".accordion");

    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
          panel.style.minHeight = "0";
        } else {
          panel.style.display = "block";
          panel.style.minHeight = "50px";
        }
      });
    }
  }, 100)
}

function main() {
  render();
  start();
  toggleAccordion()
  let form = '';
  form += generateForm();
  $('.main').html(form);

}

$(main());