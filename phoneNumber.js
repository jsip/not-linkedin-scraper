// parse the object from the prospects.json file
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'prospects.json');
const prospects = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const https = require('https');

const parsePhoneNumbers = (html) => {
  const regex = /\(?\b[2-9]\d{2}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g;
  // find all the phone numbers in the text
  let phoneNumbers = [...new Set(html.match(regex))];
  let cleanPhoneNumbers = [];
  phoneNumbers.forEach((phoneNumber) => {
    console.log(phoneNumber)
    // remove the parentheses
    const cleanPhoneNumber = phoneNumber.replace(/\(|\)/g, '');
    // remove the dashs
    const cleanPhoneNumber2 = cleanPhoneNumber.replace(/\-/g, '');
    // remove the spaces
    const cleanPhoneNumber3 = cleanPhoneNumber2.replace(/\s/g, '');
    // format the 10 digit number to the format (###) ###-####
    const formattedPhoneNumber = `(${cleanPhoneNumber3.substring(0, 3)}) ${cleanPhoneNumber3.substring(3, 6)}-${cleanPhoneNumber3.substring(6, 10)}`;

    cleanPhoneNumbers.push(formattedPhoneNumber);
  });
  phoneNumbers = [...new Set(cleanPhoneNumbers)];
  return phoneNumbers;
}

const queryGoogle = async (query) => {
  let phoneNumbers = []
  let options = {
    hostname: "https://www.google.com",
    path: `/maps/search/${query}`,
    method: 'GET',
  }
  new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(responseBody));
      });
    });

    req.on('error', (err) => {
        reject(err);
    });

    req.write(data)
    req.end();
  }).then((data) => {
    console.log(data);
    phoneNumbers.push(parsePhoneNumbers(data));
    console.log(phoneNumbers)
  });
  return phoneNumbers;
}

// loop through the prospects and use the company name and company url to find the website
for (let prospect of prospects) {
  (async () => {
    // perform a query on the company name
    let query = prospect.companyName;
    // append the company url to the query
    let escapedQuery = encodeURI(query).replace(/%5B/g, '[').replace(/%5D/g, ']');
    console.log(escapedQuery);
    let numbers = queryGoogle(escapedQuery);
    // append the phone numbers to the prospect object
    console.log(numbers)
    prospect.phoneNumbers = numbers;
    // write the prospect object to the prospects.json file
    fs.writeFileSync(filePath, JSON.stringify(prospects, null, 2));
  })();
}