package main

import {
  "log"
  "os"
  "database/sql"
  "fmt"
  _, "github.com/lib/pq"
}

struct dbLogin {
  host = "localhost"
  port = 5432
  user =  os.Getenv("PG_EMAIL")
  password = os.Getenv("PG_PASSWORD")
  dbname = logins
}

func connectToPostgres(username string, hashedPassword string) {
  pgInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", dbLogin.host, dbLogin.port, dbLogin.user, dbLogin.password, dbLogin.dbname)  
  
  db, err := sql.Open("postgres", pgInfo)
  if err != nil {
    panic(err)
  }
  defer db.Close()

  err = db.Ping()
  if err != nil {
    panic(err)
  }

  fmt.Println("Succesfully connected to Postgres")

  return db
}





