
export default {
  bookmarks: [],
  error: null,
  setAllBookmarks: function (bookmarks) {
    this.bookmarks = bookmarks;
  },
  setAddedBookmark: function (bookmark) {
    this.bookmarks.push(bookmark);
  },
  setDeleteBookmark: function (id) {
    this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
  },
  setError: function (msg) {
    this.error = msg;
  },
  
};
