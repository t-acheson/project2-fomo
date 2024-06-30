package main

import (
  "os"
  "database/sql"
  "fmt"

  _ "github.com/lib/pq"
)

// Struct to input Postgres login details
type dbStruct struct {
  host string
  port int
  user string
  password string
  dbname string
}

// Function to establish a connection to the postgres database and return a database object
func connectToPostgres() *sql.DB {
  // Create an instance of dbStruct
  dbLogin := dbStruct{
    host: "postgres",
    port: 5432,
    user: os.Getenv("POSTGRES_USER"),
    password: os.Getenv("POSTGRES_PASSWORD"),
    dbname: "main",
  }

  // Create login input
  pgInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbLogin.host, dbLogin.port, dbLogin.user, dbLogin.password, dbLogin.dbname)  
 
  // Attempt to establish a database connection. Panic on error
  db, err := sql.Open("postgres", pgInfo)
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
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      text TEXT NOT NULL,
      location GEOGRAPHY(POINT, 4326) NOT NULL 
    );
  `)
  if err != nil {
    fmt.Println("Error creating table comments", err)
  }

  // Return database object
  return db
}





