(function () {
  var PER_PAGE = 10;
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-post]'));
  var total = cards.length;
  var totalPages = Math.ceil(total / PER_PAGE);

  if (totalPages <= 1) return;

  function getPage() {
    var m = location.hash.match(/^#page(\d+)$/);
    var p = m ? parseInt(m[1], 10) : 1;
    return Math.max(1, Math.min(p, totalPages));
  }

  function render() {
    var page = getPage();
    var start = (page - 1) * PER_PAGE;
    var end = start + PER_PAGE;

    cards.forEach(function (el, i) {
      el.style.display = (i >= start && i < end) ? '' : 'none';
    });

    var pager = document.getElementById('pager');
    pager.innerHTML = '';

    // PREV button
    if (page > 1) {
      var prevLink = document.createElement('a');
      prevLink.className = 'pager-prev';
      prevLink.href = '#page' + (page - 1);
      prevLink.innerHTML = '&larr; PREV';
      pager.appendChild(prevLink);
    } else {
      var prevSpan = document.createElement('span');
      prevSpan.className = 'pager-prev pager-disabled';
      pager.appendChild(prevSpan);
    }

    // Page info
    var info = document.createElement('span');
    info.className = 'pager-info';
    info.textContent = 'PAGE ' + page + ' / ' + totalPages;
    pager.appendChild(info);

    // NEXT button
    if (page < totalPages) {
      var nextLink = document.createElement('a');
      nextLink.className = 'pager-next';
      nextLink.href = '#page' + (page + 1);
      nextLink.innerHTML = 'NEXT &rarr;';
      pager.appendChild(nextLink);
    } else {
      var nextSpan = document.createElement('span');
      nextSpan.className = 'pager-next pager-disabled';
      pager.appendChild(nextSpan);
    }

    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
