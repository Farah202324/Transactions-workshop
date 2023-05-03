const { Pool } = require('pg');
const pool =new Pool({ connectionString: 'postgres://postgres:1234@localhost:3000/mydatabase' }); //create your own database and connect it to build.js
pool.connect()
  .then(client => {
    return client.query('BEGIN')
      .then(() => {
      
        return client.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['Alice1', 'alice12@example.com'])
          .then(() => client.query('UPDATE accounts SET balance = balance - $1 WHERE user_id = $2', [100, 1]))
          .then(() => client.query('UPDATE accounts SET balance = balance + $1 WHERE user_id = $2', [100, 2]))
          .then(() => {
            return client.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['Bob2', 'bob52@example.com'])

          })
          .then(() => client.query('COMMIT'))
          .catch(err => {
        
            client.query('ROLLBACK')
              .then(() => {
                console.log('Rollback');
              })
              .catch(() => {
                console.error('Error rolling back transaction', err);
              })
              .finally(() => {
                client.release();
              });
          });
      })
      .catch(err => {
        console.error('Error beginning transaction', err);
        client.release();
      });
  })
  .catch(err => {
    console.error('Error acquiring client from pool', err);
  });
