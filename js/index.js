'use strict';
(function () {

  window.addEventListener('load', init);
  let page = 'home';

  /**
   * Initialization function that should handle anything that needs to occur
   * on page load (include changing from one page to another).
   */
  function init() {
    setNavbarHighlight();
    setNavbarListeners();

    loadNewsPosts();
    createLightBeams();

    const fish = document.querySelectorAll('.fish');
    for (let i = 0; i < fish.length; i++) {
      const id = fish[i].id;
      setTimeout(() => { updateFish(id); }, random(0, 3) * 1000);
    }

    // The scroll top button should work even without js enabled so it uses
    // an anchor, however that appends an ugly '#scroll-top' to the url so
    // for users with js enabled, we do this:
    const scroll_btn = document.getElementById('scroll-top-button');
    scroll_btn.addEventListener('click', (evt) => {
      window.scrollTo({ top: '0' });
      evt.preventDefault();
    });

    // This way the pages are actually bookmark-able and reloading
    // does not return the user to the home page. 
    if (window.location.hash) {
      const page = window.location.hash.slice(1); // remove the # from the hash
      if (isPage(page)) {
        setPage(page);
      } else {
        // clears the hash
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }

  /**
   * Uses the page state to determine which page the user is currently on and
   * appropriately style the navbar links.
   */
  function setNavbarHighlight() {
    const links = document.querySelectorAll('.navlink');
    for (let i = 0; i < links.length; i++) {
      const tab = links[i].innerText.replace(/\s+/g, '-').toLowerCase();

      if (tab === page && !links[i].classList.contains('mobile')) {
        links[i].classList.add('active');
      } else {
        links[i].classList.remove('active');
      }
    }
  }

  /**
   * Loops over all links in the navbar and sets their listeners, and adds
   * the mobile menu listener.
   */
  function setNavbarListeners() {
    const links = document.querySelectorAll('.navlink');
    for (let i = 0; i < links.length; i++) {
      const tab = links[i].textContent.toLowerCase();
      links[i].addEventListener('click', function () {
        if (!links[i].classList.contains('mm-close')) {
          setPage(tab);
        }
        if (links[i].classList.contains('mobile')) {
          mobile_menu.classList.toggle('active');
          menu_button.classList.toggle('menu-open');
        }
      });
    }

    const menu_button = document.querySelector('#navbutton');
    const mobile_menu = document.querySelector('#mobile-menu');
    menu_button.addEventListener('click', function () {
      mobile_menu.classList.toggle('active');
      menu_button.classList.toggle('menu-open');
    });
  }

  /**
   * Sets the page state to the given tab.
   * @param {string} tab The tab to set the page state to.
   */
  function setPage(tab) {
    page = tab.replace(/\s+/g, '-');

    if (page === "home") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = page;
    }

    setNavbarHighlight();
    const pages = document.querySelectorAll('.page-content');
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].id === `page-${page}`) {
        pages[i].classList.remove('hidden');
      } else {
        pages[i].classList.add('hidden');
      }
    }
  }

  /**
   * Verifies a page exists for the given tab name.
   * @param {string} tab The tab name to check has a page.
   */
  function isPage(tab) {
    let found = false;
    const pages = document.querySelectorAll('.page-content');

    pages.forEach(page => {
      if (page.id === `page-${tab}`) {
        found = true;
      }
    });

    return found;
  }

  // Toggles the news page between the posts list and the single article container.
  function toggleNewsView() {
    const article = document.getElementById('full-post');
    article.classList.toggle('hidden');
    const list = document.getElementById('posts-list');
    list.classList.toggle('hidden');
  }

  // Loads post data from posts.js, where the list posts contains
  // several objects each representing a post. Fills out the posts list
  // and gives them event listeners so that when clicked on they display their
  // corresponding article/post.
  function loadNewsPosts() {
    const back_link = document.getElementById('back-link');
    back_link.addEventListener('click', function () {
      toggleNewsView();
    });

    const container = document.getElementById('posts-list');
    const template = document.getElementById('template-post');

    console.log(posts);

    for (let i = 0; i < posts.length; i++) {
      const post = template.cloneNode(true);
      post.classList.remove('hidden');
      post.addEventListener('click', populatePost);
      post.post = posts[i];

      // Fill out the title, date and content
      post.querySelector('h3').innerHTML = posts[i].title;
      post.querySelector('span').innerHTML = posts[i].date;
      post.querySelector('p').innerHTML = posts[i].body.replace(/^(.{100}[^\s]*).*/, "$1") + "...";
      // The above regex shortens a string to the number of characters inside
      // the curly braces without cutting off in the middle of a word.

      container.appendChild(post);
    }
  }

  /**
   * Populates the div with id 'full-post' based on the post
   * which was clicked.
   * @param {object} evt The event object.
   */
  function populatePost(evt) {
    const post = evt.currentTarget.post;
    document.getElementById('post-title').innerHTML = post.title;
    document.getElementById('post-date').innerHTML = post.date;
    document.getElementById('post-body').innerHTML = post.body;

    const link = document.getElementById('post-link');
    if (post.link) {
      link.href = post.link;
      link.classList.remove('hidden');
    } else {
      link.classList.add('hidden');
    }

    const img = document.getElementById('post-img');
    if (post.img) {
      img.src = post.img;
      img.classList.remove('hidden');
    } else {
      img.classList.add('hidden');
    }

    toggleNewsView();
  }

  // Creates the light beams at the top of the page.
  function createLightBeams() {
    const beam = document.querySelector('.light-beam.original');
    const container = document.getElementById('light-beams-container');

    let x = 0;
    while (x < window.innerWidth) {
      const new_beam = beam.cloneNode(true);
      new_beam.style.setProperty('--offset', x); // in px
      new_beam.style.setProperty('--delay', random(0, 20) - 10); // in sec
      new_beam.style.setProperty('--duration', random(7, 10)); // in sec
      new_beam.style.setProperty('--height', random(6, 14)); // in vh

      new_beam.classList.remove('original');
      container.appendChild(new_beam);
      x += random(10, 30);
    }
  }

  // Once called, this function will infinitely loop,
  // calling itself over an over after random delays to
  // continuously update it's assigned fish.
  function updateFish(fish) {
    const ref = document.getElementById(fish);

    const start_x = random(0, window.innerWidth);
    const offset_y = random(0, 50) - 25; // deviation up or down in px
    const duration = random(5, 9); // in sec

    ref.style.setProperty('--start-x', start_x);
    ref.style.setProperty('--offset-y', offset_y);
    ref.style.setProperty('--duration', duration);
    ref.classList.add('animated');
    if (random(0, 1) !== 0) {
      ref.classList.add('reverse');
    } else {
      ref.classList.remove('reverse');
    }

    // potentially replace below with onanimationend event listener,
    // plus setTimeout on top of that for extra delay
    const delay = (duration + random(1, 5)) * 1000
    setTimeout(() => { ref.classList.remove('animated'); }, duration * 1000);
    setTimeout(() => { updateFish(fish); }, delay);
  }

  // Shorthand helper function for getting a random integer
  // between min and max (inclusive).
  function random(min, max) {
    return Math.max(min, Math.round(Math.random() * max));
  }

})();