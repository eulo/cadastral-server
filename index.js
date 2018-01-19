const { Client } = require('pg')

let conn = "postgres://postgres@localhost/gnaf";

let route = process.argv[2];
let query = process.argv[3] || '';

if (route === undefined) {
  return;  
}

const client = new Client(conn);
client.connect();

switch (route) {
  case 'autocomplete':
    // benchmark: "apartmet 34 252 Botany R"
    client.query(`SELECT * FROM gnaf_201711.address_principals WHERE address like '%${query.toUpperCase()}%';`, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows);
      }
      client.end()
    });
    break;

  case 'info':
    client.query(`SELECT * FROM gnaf_201711.address_principals WHERE gid = ${query};`, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows);
      }
      client.end()
    });
    break;
  case 'validate':
    client.query(`SELECT * FROM gnaf_201711.address_principals WHERE (address || ' ' || locality_name || ' ' || locality_postcode) = '${query}';`, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(!!res.rows.length);
      }
      client.end()
    });
    break;
  /*!
   * TODO:
   *  - geocode = address -> latlng
   *
   *  - reverse geocode = latlng -> address
   *
   *  - Classify Coordinates = latlng -> suburb info
   *    - accept radius as param?
   *
   *  - Postcode = suburb info
   *
   */ 
  default:
    client.end();
}
