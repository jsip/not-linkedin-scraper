// Create the results list before everything, make sure it does not get reset on every iteration
results = []
// Initial page
i = 1

// Start interval to loop throughout pages, set to 10 seconds
interval = setInterval(() => {
  if (i == 100) {
    // Stop the interval if the page number is 100
    clearInterval(interval);
    console.log(results);
    return results;
  }

  // Scroll to bottom to load all results
  $("html, body").animate({ scrollTop: jQuery(window).height() * 8}, 3000);
  // Set first timeout of 3s to give it time to scroll down
  setTimeout(() => {
    // Get all prospects
    children = $("div.horizontal-person-entity-lockup-4");
    // Loop through all prospects
    children.each((child) => {
      // Create a new prospect object
      result = {};
      // Append all data to the prospect object
      result["salesNavUrl"] = children[child].firstElementChild.firstChild.nextSibling.href;
      result["profileName"] = children[child].children[1].children[0].innerText;
      result["profileTitle"] = children[child].children[1].children[2].children[0].innerText;
      result["companyName"] = children[child].children[1].children[2].children[1] ? children[child].children[1].children[2].children[1].children[0].children[0].innerText.split('\n')[0].trim() : null;
      result["companyUrl"] = children[child].children[1].children[2].children[1] ? children[child].children[1].children[2].children[1].children[0].children[0].href : null;
      result["timeInPosition"] = children[child].children[1].children[3] ? children[child].children[1].children[3].innerText : null;
      result["geoLocation"] = children[child].children[1].children[4] ? children[child].children[1].children[4].innerText : null;

      window.open(result["salesNavUrl"]);

      $("div.artdeco-dropdown__content-inner")[0].firstElementChild.children[3].firstElementChild.click()

      setTimeout(() => {
        navigator.clipboard.readText().then(val => {
          result["profileUrl"] = val;
        })
      }, 500);

      window.history.back()

      // Append the prospect object to the results list
      results.push(result);
      // continue to the next prospect until all 25 are scraped
    })

    // Increment page number
    i++;
    console.log(results);

    // Set a second timeout of 3s
    setTimeout(() => {
      // Find the button for the next page
      nextPageBtn = document.querySelectorAll(`[data-page-number="${i}"]`)[0];

      if (!nextPageBtn) {
        // Stop the interval if there is no next page button
        clearInterval(interval);
        console.log(results);
        return results;
      }

      // Set a third timeout of 1s to allow for injector to find the next button
      setTimeout(() => {
        // Click the next page button
        nextPageBtn.click();
      }, 1000);
    }, 3000);
  }, 3000)
}, 10000);