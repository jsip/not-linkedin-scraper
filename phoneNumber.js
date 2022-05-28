// parse the object from the prospects.json file
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'prospects.json');
const prospects = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const axios = require("axios");

require('dotenv').config();


const queryGoogle = async (query) => {
  let results;
  let escapedQuery = encodeURI(query).replace(/%20/g, '+');
  // make a request to the google maps api place search endpoint with the query
  let placeConfig = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${escapedQuery}&inputtype=textquery&key=${process.env.GOOGLE_API_KEY}`
  };

  await axios(placeConfig)
  .then(async response => {
    if (response.status === 200 && response.data.status !== "ZERO_RESULTS") {
      let place_id = response.data.candidates[0].place_id;

      if (place_id) {
        let detailsConfig = {
          method: 'get',
          url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=formatted_phone_number,name,formatted_address,opening_hours/weekday_text,website,types,url&key=${process.env.GOOGLE_API_KEY}`
        };

        return await axios(detailsConfig)
        .then(res => results = res.data)
        .catch((err) => {
          console.error("err: ", err);
        });
      }
      return results;
    }
  })
  .catch((error) => {
    console.error("err: ", error);
  })
  return results;
}

(async () => {
  for (let prospect of prospects) {
    let companyName = prospect.companyName;
    let queryResult;
    if (companyName) {
      await queryGoogle(companyName).then(res => {
        if (res) {
          queryResult = res.result

          prospect.formattedAddress = JSON.stringify(queryResult["formatted_address"] || "Unknown");
          prospect.formattedPhoneNumber = JSON.stringify(queryResult["formatted_phone_number"] || "Unknown");
          prospect.name = JSON.stringify(queryResult["name"] || "Unknown");
          if (queryResult["opening_hours"]) {
            prospect.openingHours = JSON.stringify(queryResult["opening_hours"]["weekday_text"] || "Unknown");
          } else {
            prospect.openingHours = "Unknown";
          }
          prospect.types = JSON.stringify(queryResult["types"] || "Unknown");
          prospect.url = JSON.stringify(queryResult["url"] || "Unknown");
          prospect.website = JSON.stringify(queryResult["website"] || "Unknown");

        } else {
          prospect.formattedAddress = "Unknown"
          prospect.formattedPhoneNumber = "Unknown"
          prospect.name = "Unknown"
          prospect.openingHours = "Unknown"
          prospect.types = "Unknown"
          prospect.url = "Unknown"
          prospect.website = "Unknown"
        }
        fs.writeFileSync(filePath, JSON.stringify(prospects, null, 2));
      });
    } else {
      prospect.formattedAddress = "Unknown"
      prospect.formattedPhoneNumber = "Unknown"
      prospect.name = "Unknown"
      prospect.openingHours = "Unknown"
      prospect.types = "Unknown"
      prospect.url = "Unknown"
      prospect.website = "Unknown"

      fs.writeFileSync(filePath, JSON.stringify(prospects, null, 2));
    }
  }
})();