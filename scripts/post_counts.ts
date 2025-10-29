global.loadAuthorsList = () => {
  fetch("/authors.json", {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((response) => response.json())
    .then((postCounts: Author[]) => {
      const activeAuthors = postCounts.filter((author) => author.isActive);
      displayCarousel(activeAuthors);
    });
};

/*
 * Sort by number of posts descending, then by name
 */
function compareAuthor(a: Author, b: Author) {
  if (a.postCount > b.postCount) {
    return -1;
  }
  if (a.postCount < b.postCount) {
    return 1;
  }
  return a.name.localeCompare(b.name);
}

function displayCarousel(authorList: Author[]) {
  authorList.sort(compareAuthor);

  const pageSize = 12;
  const pageCount = Math.floor(authorList.length / pageSize);
  const remainder = authorList.length % pageSize;

  const carouselDiv = document.getElementById("author-carousel");
  if (carouselDiv?.innerHTML) carouselDiv.innerHTML = "";

  for (let i = 0; i < pageCount; i++) {
    const start = i * pageSize;
    const end = (i+1) * pageSize;

    const authorsForPage = authorList.slice(start, end);
    displayPage(i, authorsForPage);
  }

  if (remainder) {
    const start = pageCount * pageSize;
    const end = authorList.length;

    const authorsForPage = authorList.slice(start, end);
    displayPage(pageCount*pageCount, authorsForPage)
  }
}

function displayPage(pageNumber: number, authors: Author[]) {
  const carouselDiv = document.getElementById("author-carousel");
  if (!carouselDiv) {
    throw Error("Cannot find element with id: 'author-carousel'")
  }
  const carouselPage = carouselDiv.appendChild(document.createElement("div"));
  carouselPage.id = `author-grid${pageNumber}`;
  carouselPage.classList.add("cell");
  carouselPage.classList.add("author-grid");

  
  for (const author of authors) {
    const authorIcon = carouselPage.appendChild(document.createElement("a"));
    authorIcon.classList.add("author-icon");
    authorIcon.href = `${author.authorId}`;
    const avatar = authorIcon.appendChild(document.createElement("div"));
    avatar.classList.add("author-list-avatar");
    const image = avatar.appendChild(document.createElement("img"));
    image.role = "presentation";
    image.alt = author.name ?? "";
    if (author.picture) {
      image.src = `/${author.authorId}/${author.picture}`;
    } else {
      image.src = `/assets/avatar.png`;
    }

    const name = authorIcon.appendChild(document.createElement("div"));
    name.classList.add("author-name");
    name.textContent = author.name;

    const postCountText = authorIcon.appendChild(document.createElement("div"));
    postCountText.classList.add("author-post-count");
    postCountText.textContent =
      author.postCount == 1
        ? `${author.postCount} Blog post`
        : `${author.postCount} Blog posts`;
  }
}

interface Author {
  name: string,
  picture: string,
  authorId: string,
  postCount: number,
  isActive: boolean
}
