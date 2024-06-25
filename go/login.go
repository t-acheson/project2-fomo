package main

import (
  //"log"
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
    host: "localhost",
    port: 5432,
    user: os.Getenv("PG_EMAIL"),
    password: os.Getenv("PG_PASSWORD"),
    dbname: "main",
  }

  // Create login input
  pgInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", dbLogin.host, dbLogin.port, dbLogin.user, dbLogin.password, dbLogin.dbname)  
 
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

  // Return database object
  return db
}





