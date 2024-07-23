package main

import (
  "fmt"
  "github.com/robfig/cron/v3"
  "strconv"
)

func runCron() {
  c := cron.New()
  c.AddFunc("0 7 * * *", func() {archiveComments()})
  c.AddFunc("0 7 * * *", func() {cacheBusyness()})
  c.Start()
}


func archiveComments() {
  fmt.Println("Archiving old comments")
  _, err := db.Exec(`
  INSERT INTO archived_comments
  SELECT *
  FROM comments
  WHERE timestamp < NOW() - INTERVAL '48 hours';

  DELETE FROM comments
  WHERE timestamp < NOW() - INTERVAL '48 hours';
  `)
  if err != nil {
    fmt.Println("Error moving comments to archive:", err)
  }
}


func cacheBusyness() {
  fmt.Println("Regenerating busyness values")
  busynessValues := make(map[string]float32) // Key location ID, value busyness

  for i := 1; i <= 263; i++ {
    busynessValues[strconv.Itoa(i)] = estimateBusyness(i) // Itoa changes int to string
  }

  busynessMap = busynessValues // Update the busynessMap in main
}

