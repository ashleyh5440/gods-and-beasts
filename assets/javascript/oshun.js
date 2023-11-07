document.addEventListener("DOMContentLoaded", function() {
    const pages = document.querySelectorAll(".page");
    const nextPageBtn = document.getElementById("nextPageBtn");
    let currentPageIndex = 0;
  
    function showPage(pageIndex) {
      pages[currentPageIndex].style.display = "none";
      pages[pageIndex].style.display = "block";
      currentPageIndex = pageIndex;
    }
    // next page function
    nextPageBtn.addEventListener("click", function() {
      if (currentPageIndex < pages.length - 1) {
        // if not on last page, switch to the next
        const nextPageIndex = currentPageIndex + 1;
        showPage(nextPageIndex);
      } else {
        // if on the last page, go to ne html file
        window.location.href = "index.html"; 
      }
    });
  
    // show initial page
    showPage(currentPageIndex);
  });