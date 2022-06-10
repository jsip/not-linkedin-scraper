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

      try {
        result["salesNavUrl"] = base.firstElementChild.firstElementChild.href || "";
      }
      catch (e) {
        console.log(e);
        result["salesNavUrl"] = "";
      }
      try {
        result["profileName"] = base.children[1].firstElementChild.firstElementChild.firstElementChild.innerText || "";
      }
      catch (e) {
        console.log(e);
        result["profileName"] = "";
      }
      try {
        result["profileTitle"] = base.children[1].children[1].firstElementChild.innerText || "";
      }
      catch (e) {
        console.log(e);
        result["profileTitle"] = "";
      }
      try {
        result["companyName"] = base.children[1].children[1].children[2].innerText || "";
      }
      catch (e) {
        console.log(e);
        result["companyName"] = "";
      }
      try {
        result["companyUrl"] = base.children[1].children[1].children[2].href || "";
      }
      catch (e) {
        console.log(e);
        result["companyUrl"] = "";
      }
      try {
        result["timeInPosition"] = base.children[1].children[3].innerText || "";
      }
      catch (e) {
        console.log(e);
        result["timeInPosition"] = "";
      }
      try {
        result["geoLocation"] = base.children[1].children[2].firstElementChild.innerText || "";
      }
      catch (e) {
        console.log(e);
        result["geoLocation"] = "";
      }

      // Append the prospect object to the results list
      // make sure that the result has all keys
      results.push(result);
      console.log(results);
      // continue to the next prospect until all 25 are scraped
    })

    if (results.length == 25 * i) {
      // Increment page number
      i++;

      // Set a second timeout of 3s
      // Find the button for the next page
      nextPageBtn = document.querySelector(`button[aria-label="Suivant"]`);

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
  }, 8000)
}, 10000);