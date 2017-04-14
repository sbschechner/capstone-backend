exports.DATABASE_URL = process.env.DATABASE_URL || //in linux, global variables or environment variables 
                       global.DATABASE_URL ||
                      'mongodb://localhost/expenseGrouper'; // this is the db name in Mongo

exports.TEST_DATABASE_URL = (
							process.env.TEST_DATABASE_URL ||
							'mongodb://localhost/test-expenseGrouper');//this is the db name in Mongo

exports.PORT = process.env.PORT || 8080;
