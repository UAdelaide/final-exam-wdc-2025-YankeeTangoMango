var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//
let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    /*
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end(); */

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    // Create a table if it doesn't exist
    /*
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner','walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `); */

    /*
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Dogs (
        dog_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        size ENUM('small','medium','large') NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES Users(user_id)
      );
    `); */

    /*
    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkRequests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        dog_id INT NOT NULL,
        requested_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('open','accepted','completed','cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
      );
    `); */

    /*
    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkApplications (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending','accepted','rejected') DEFAULT 'pending',
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        UNIQUE(request_id, walker_id)
      );
    `); */

    /*
    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkRatings (
        rating_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        owner_id INT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        FOREIGN KEY (owner_id) REFERENCES Users(user_id),
        UNIQUE(request_id)
      );
    `); */

    // Insert data if table is empty
    /*
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123','alice@example.com','hashed123','owner'),
        ('bobwalker','bob@example.com','hashed456','walker'),
        ('carol123','carol@example.com','hashed789','owner'),
        ('daveowner','dave@example.com','hashed101','owner'),
        ('elviswalker','elvis@example.com','hashed202','walker')
      `);

      await db.execute(`
        INSERT INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username='alice123'),'Max','medium'),
        ((SELECT user_id FROM Users WHERE username='carol123'),'Bella','small'),
        ((SELECT user_id FROM Users WHERE username='carol123'),'Charlie','medium'),
        ((SELECT user_id FROM Users WHERE username='daveowner'),'Rex','large'),
        ((SELECT user_id FROM Users WHERE username='alice123'),'Lucky','large')
      `);

      await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        ((SELECT dog_id FROM Dogs WHERE name='Max'),  '2025-06-10 08:00:00', 30, 'Parklands',       'open'),
        ((SELECT dog_id FROM Dogs WHERE name='Bella'),'2025-06-10 09:30:00', 45, 'Beachside Ave',  'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name='Lucky'),'2025-06-11 07:00:00', 60, 'Downtown Plaza','open'),
        ((SELECT dog_id FROM Dogs WHERE name='Rex'),  '2025-06-12 10:15:00', 30, 'Garden Ave',     'completed'),
        ((SELECT dog_id FROM Dogs WHERE name='Charlie'),'2025-06-13 15:00:00', 30, 'Sunset Ave',     'completed')
      `);

      await db.execute(`
        INSERT INTO WalkApplications (request_id, walker_id, status) VALUES
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Bella')),   (SELECT user_id FROM Users WHERE username='bobwalker'),   'accepted'),
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Rex')),     (SELECT user_id FROM Users WHERE username='elviswalker'),'accepted'),
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Charlie')), (SELECT user_id FROM Users WHERE username='bobwalker'),   'accepted')
      `);

      await db.execute(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Rex')),     (SELECT user_id FROM Users WHERE username='elviswalker'), (SELECT user_id FROM Users WHERE username='daveowner'), 4,'Great walk'),
        ((SELECT request_id FROM WalkRequests WHERE dog_id=(SELECT dog_id FROM Dogs WHERE name='Charlie')),(SELECT user_id FROM Users WHERE username='bobwalker'),   (SELECT user_id FROM Users WHERE username='carol123'),   5,'Excellent')
      `);
    } */

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// Route to return books as JSON
/* app.get('/', async (req, res) => {
  try {
    const [books] = await db.execute('SELECT * FROM books');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.use(express.static(path.join(__dirname, 'public'))); */

app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.name AS dog_name, d.size, u.username AS owner_username
       FROM Dogs d
       JOIN Users u ON d.owner_id = u.user_id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT wr.request_id,
              d.name AS dog_name,
              wr.requested_time,
              wr.duration_minutes,
              wr.location,
              u.username AS owner_username
       FROM WalkRequests wr
       JOIN Dogs d ON wr.dog_id = d.dog_id
       JOIN Users u ON d.owner_id = u.user_id
       WHERE wr.status = 'open'`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.username AS walker_username,
              COALESCE(ratings.total_ratings, 0) AS total_ratings,
              ratings.average_rating,
              COALESCE(comp.completed_walks, 0) AS completed_walks
       FROM Users u
       LEFT JOIN (
         SELECT walker_id,
                COUNT(*) AS total_ratings,
                ROUND(AVG(rating), 2) AS average_rating
         FROM WalkRatings
         GROUP BY walker_id
       ) ratings ON ratings.walker_id = u.user_id
       LEFT JOIN (
         SELECT wa.walker_id,
                COUNT(*) AS completed_walks
         FROM WalkApplications wa
         JOIN WalkRequests wr ON wa.request_id = wr.request_id
         WHERE wa.status = 'accepted' AND wr.status = 'completed'
         GROUP BY wa.walker_id
       ) comp ON comp.walker_id = u.user_id
       WHERE u.role = 'walker'`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch walkers summary' });
  }
});

module.exports = app;