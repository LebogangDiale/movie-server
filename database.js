const {
    Pool,
    types
} = require('pg');

//const connection_string = "postgres://admin:12345678@localhost:5432/movies_spot";
const connection_string = "postgres://ddeghzzreoaqxm:4875b5559cab7ddb751ba3521f9f4be3cd50c4ed1b862a5961f20279b1dc152e@ec2-54-208-139-247.compute-1.amazonaws.com:5432/da179abtdmjkad";

module.exports = class Database {
    constructor() {
        try {
            this.pool = new Pool({
                connectionString: connection_string,
                ssl: {
                    rejectUnauthorized: false
                  }
            });


            // numeric
            types.setTypeParser(1700, value => parseFloat(value));

            // bigint
            types.setTypeParser(20, value => parseInt(value));
        } catch (error) {
            throw error;
        }

        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            // process.exit(-1);
        });
    }  
    
    callFnWithResultsAdd(functionname, adduser) {
        debugger;
        const removeQuotes = `SELECT * FROM ${functionname}`

        removeQuotes.replace(/'/g, "''");

        return new Promise((resolve, reject) => {
            this.pool.connect()
                .then(client => client.query(removeQuotes, adduser)
                    .then((res) => {
                        // client.release();

                        const rb = {
                            status: true,
                            message: 'Success',
                            data: res.rows
                        }

                        resolve(rb);
                    })
                    .catch((err) => {
                        // client.release();
                        const rb = {
                            status: false,
                            message: `Failed To addData ${err.stack}`,
                            data: err
                        }
                        reject(rb);
                    }));
        });
    }


};