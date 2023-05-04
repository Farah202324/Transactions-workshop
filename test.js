const { Pool } = require('pg');

function performTransaction() {
  const pool = new Pool({
    connectionString: 'postgres://postgres:1234@localhost:3000/mydatabase'
  });

  return pool.connect()
    .then(client => {
      return client.query('BEGIN')
        .then(() => {
          //fix any errors in the queries
          return client.query('INSERT INTO user (name, email) VALUES ($1, $2)', ['farah', 'farah@example.com'])
            .then(() => client.query('UPDATE accounts SET balance = balance - $1 WHERE user_id = $2', [100, 1]))
            .then(() => client.query('UPDATE accounts SET balance = balance + $1 WHERE user_id = $2', [100, 2]))
            .then(() => {
              return client.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['aya', 'aya@example.com'])
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
}

test('Transaction is successful', async () => {
  await performTransaction();
  const pool = new Pool({
    connectionString: 'postgres://postgres:1234@localhost:3000/mydatabase'
  });
  const result = await pool.query('SELECT name FROM users');
  expect(result.rows).toContainEqual({name: 'farah'});
  expect(result.rows).toContainEqual({name: 'aya'});
});

