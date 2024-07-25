package main

import (
  "os"
  "database/sql"
  "fmt"
  "github.com/elliotchance/sshtunnel"
  "golang.org/x/crypto/ssh"
  "log"
  "time"

  _ "github.com/lib/pq"
)

// Struct to input Postgres login details
type dbStruct struct {
  host string
  port int
  user string
  password string
  dbname string
  sshUser string
  sshPassword string
  serverIP string
}

// Function to establish a connection to the postgres database and return a database object
func connectToPostgres() *sql.DB {
  // Create an instance of dbStruct
  dbLogin := dbStruct{
    host: "postgres-container",
    port: 5432,
    user: os.Getenv("POSTGRES_USER"),
    password: os.Getenv("POSTGRES_PASSWORD"),
    dbname: "main",
    sshUser: os.Getenv("SSH_USER"),
    sshPassword: os.Getenv("SSH_PASSWORD"),
    serverIP: os.Getenv("SERVER_IP"),
  }

  // Setup the ssh tunnel
  tunnel, err := sshtunnel.NewSSHTunnel(
    fmt.Sprintf("%s@%s", dbLogin.sshUser, dbLogin.serverIP),
    ssh.Password(dbLogin.sshPassword),
    fmt.Sprintf("%s:5432", dbLogin.serverIP),
    "5432",
  )

  // Create a log for the ssh tunnel
  tunnel.Log = log.New(os.Stdout, "", log.Ldate | log.Lmicroseconds)

  // Start the ssh tunnel so we can login (This is only useful when port 5432 is blocked and 22 is open as in our case)
  go tunnel.Start()
  time.Sleep(100 * time.Millisecond)

  conn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbLogin.host, tunnel.Local.Port, dbLogin.user, dbLogin.password, dbLogin.dbname) 
 
  // Attempt to establish a database connection. Panic on error
  db, err := sql.Open("postgres", conn)
  if err != nil {
    panic(err)
  }

  // Attempt to ping the database. Panic on error
  err = db.Ping()
  if err != nil {
    panic(err)
  }

  fmt.Println("Succesfully connected to Postgres")

  // Create necessary tables if not exists
  // Note: SRID of 4316 declares geographic spatial reference system
  _, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      parent_id INT,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      text TEXT NOT NULL,
      location GEOGRAPHY(POINT, 4326) NOT NULL,
      likes INT DEFAULT 0,
      dislikes INT DEFAULT 0,
      tags TEXT[],
      author TEXT,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    );
  `)
  if err != nil {
    fmt.Println("Error creating table comments:", err)
  }

  _, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS archived_comments (
      id INT PRIMARY KEY,                                                                                                                                                                        
      parent_id INT,              
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      text TEXT NOT NULL,         
      location GEOGRAPHY(POINT, 4326) NOT NULL,
      likes INT DEFAULT 0,           
      dislikes INT DEFAULT 0,
      tags TEXT[],
      author TEXT,
      FOREIGN KEY (parent_id) REFERENCES archived_comments(id) ON DELETE CASCADE
    );   
  `)
  if err != nil {
    fmt.Println("Error creating table archived_comments:", err)
  }

  _, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS comments_interactions (
      comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
      fingerprint TEXT NOT NULL,
      like BOOLEAN NOT NULL,
      PRIMARY KEY (fingerprint, comment_id, like)
    );
  `)
  if err != nil {
    fmt.Println("Error creating table comments_interactions:", err)
  }

  _, err = db.Exec(`
    CREATE TABLE IF NOT EXISTS users (
      fingerprint TEXT PRIMARY KEY,
      location GEOGRAPHY(POINT, 4326) NOT NULL
    );
  `)
  if err != nil {
    fmt.Println("Error creating table users:", err)
  }

  // Ensure the users table has been wiped
  _, err = db.Exec(`
    DELETE FROM users;
  `)
  if err != nil {
    fmt.Println("Error wiping the users table:", err)
  }

  // Return database object
  return db
}





