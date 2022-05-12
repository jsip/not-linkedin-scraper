// Create the results list before everything, make sure it does not get reset on every iteration
results = []
// Initial page
i = 1

interval = setInterval(() => {
  let k = 0;
  scrollInterval = setInterval(async () => {
    if (k == 12) {
      clearInterval(scrollInterval);
      return;
    }
    $("#search-results-container")[0].scroll(0, 500 * k);
    k++;
  }, 500);

  if (i == 100) {
    // Stop the interval if the page number is 100
    clearInterval(interval);
    return results;
  }

  // Scroll to bottom to load all results
  // Set first timeout of 3s to give it time to scroll down
  setTimeout(() => {
    // Get all prospects
    children = document.querySelector("#search-results-container").children[0].children[2].children
    // Loop through all prospects
    Array.prototype.forEach.call(children, child => {
      // Create a new prospect object
      result = {};
      // Append all data to the prospect object
      base = child.firstElementChild.firstElementChild.children[1].firstElementChild.firstElementChild.firstElementChild
      result["salesNavUrl"] = base.firstElementChild.firstElementChild ? base.firstElementChild.firstElementChild.href : null;
      result["profileName"] = base.children[1].firstElementChild.firstElementChild.firstElementChild.innerText || null;
      result["profileTitle"] = base.children[1].children[1].firstElementChild.innerText;
      result["companyName"] = base.children[1].children[1].children[2] ? base.children[1].children[1].children[2].innerText : null;
      result["companyUrl"] = base.children[1].children[1].children[2] ? base.children[1].children[1].children[2].href : null;
      result["timeInPosition"] = base.children[1].children[3].innerText;
      result["geoLocation"] = base.children[1].children[2].firstElementChild.innerText;

      // Append the prospect object to the results list
      results.push(result);
      console.log(results);
      // continue to the next prospect until all 25 are scraped
    })

    if (results.length == 25 * i) {
      // Increment page number
      i++;

      // Set a second timeout of 3s
      // Find the button for the next page
      nextPageBtn = document.querySelector(`li[data-test-pagination-page-btn="${i}"]`);

      if (!nextPageBtn) {
        // Stop the interval if there is no next page button
        clearInterval(interval);
        return results;
      }

      // Set a third timeout of 1s to allow for injector to find the next button
      setTimeout(() => {
        // Click the next page button
        nextPageBtn.firstElementChild.click();
      }, 1000);
    }
  }, 10000)
}, 10000);