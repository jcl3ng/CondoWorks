/**
Name: Joshua Ng 
Date: August 20,2020
 */

const fs = require('fs');
var myBillFile = process.argv[2];
var text = fs.readFileSync(myBillFile, 'utf8');

var rxCustAcct = / Customer no. - Account no.\s*([0-9]+) \- ([0-9]+)/;
var rxBillDate = / Bill date: (\w{3} \d+, \d+)/;
var rxBillPeriod = /Bill period:\s+.* (\w{3} \d+, \d+ to \w{3} \d+, \d+)/;
var rxBillNos = /Bill number: ([0-9]+)/;
var rxTotalCharge = /Total new charges\s+(\$[0-9,.]+)/;

var custAcct = text.match(rxCustAcct);
var billDate = text.match(rxBillDate);
var billPeriod = text.match(rxBillPeriod);
var billNos = text.match(rxBillNos);
var totalCharge = text.match(rxTotalCharge);

console.log(" Customer #: " + custAcct[1] + " and " + "Account #: " + custAcct[2]);
console.log(" Bill Period: " + billPeriod[1]);
console.log(" Bill Number: " + billNos[1]);
console.log(" Bill Date: " + billDate[1]);
console.log(" Total Amount Due: " + totalCharge[1]);