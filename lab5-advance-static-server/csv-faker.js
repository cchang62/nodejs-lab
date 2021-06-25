/* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
Modified: 11/11/20
Author: Chris Mendez
URL: http://chrisjmendez.com/2017/08/23/create-fake-emails-for-testing/
Description: Create a CSV file full of fake data.
* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
const fs     = require('fs');
const path   = require("path");
const moment = require('moment');
const async  = require("async");
const stringify = require('csv-stringify');
const faker  = require('faker');
	  faker.locale = "en_US";

var num_of_records = 1000000;

async.auto({
	//Create fake data
	create_fake_data: function (callback) {
		let arr = []

		// Header
		let string = faker.fake(`SMS, Email, First, Last`);
		let header = string.split(',');
		arr.push(header);

		let createEntry = function (sms, email, first, last) {
			sms   = sms   || '{{phone.phoneNumber}}';
			email = email || '{{internet.email}}';
			last  = last  || '{{name.lastName}}';
			first = first || '{{name.firstName}}';
			let string = faker.fake(`${sms}, ${email}, ${last}, ${first}`);
			let entry = string.split(',');
			return entry;
		}

		// Create a Custom Entry for Testing
		let myData = createEntry(null, 'chris@maildrop.cc', null, null);
		arr.push(myData);

		// Create Random Entries as Rows
		for (var i = 0; i < num_of_records; i++) {
			let row = createEntry(null, null, null, null);
			arr.push(row);
		}
		callback(null, arr);
	},
	//Convert it to CSV
	convert_to_csv: ['create_fake_data', function (arr, callback) {
		let data   = arr.create_fake_data;
		let header = data[0];

		stringify(data, { columns: header }, function (err, output) {
			if (err) console.error(err);
			//console.log(output);
			callback(null, output);
		});
	}],
	//Save to filesystem
	save_to_disk: ['convert_to_csv', function (csv, callback) {
		csv = csv.convert_to_csv;
		var filePath  = `${process.cwd()}/`;

		var timestamp = moment().format("YYMMDD-hh_mm_ss");
		var fileName  = path.join(filePath, timestamp + '.csv');
		fs.writeFile(fileName, csv, function (err) {
			if (err) return console.log(err);
			callback(null);
		});
	}]
}, function (err, result) {
	if(err) console.log("err:", err);
	//End Jake Process
	process.exit();
});