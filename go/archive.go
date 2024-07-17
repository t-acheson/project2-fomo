package main

import (
  "fmt"
  "github.com/robfig/cron/v3"
)

func runCron() {
  c := cron.New()
  c.AddFunc("0 7 * * *", func() {archiveComments()})
  c.Start()
}


func archiveComments() {
  err := db.Execute(`
  INSERT INTO archived_comments (parent_id, timestamp, text, location, likes, dislikes)
  SELECT parent_id, timestamp, text, location, likes, dislikes
  FROM comments
  WHERE timestamp < NOW() - INTERVAL '48 hours';

  DELETE FROM comments
  WHERE timestamp < NOW() - INTERVAL '48 hours';
  `)
  if err != nil {
    fmt.Println("Error moving comments to archive:", err)
  }
}


