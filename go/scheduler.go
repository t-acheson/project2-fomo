package main

import (
  "fmt"
  "strconv"
  "time"
)

func runScheduler() {
  now := time.Now()
  firstRun := time.Date(now.Year(), now.Month(), now.Day() + 1, 7, 0, 0, 0, time.UTC) // First run is tomorrow at 7am

  // Sleep until tomorrow 7am
  delay := time.Until(firstRun)
  time.Sleep(delay)

  // Start ticker to run every 48 hours at 7am
  ticker := time.NewTicker(48 * time.Hour)
  defer ticker.Stop()

  // Call the the 2 function for the first time
  archiveComments()
  cacheBusyness()

  // Listen to ticker ticks every 48hrs and execute
  for range ticker.C {
    archiveComments()
    cacheBusyness()
  }
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

