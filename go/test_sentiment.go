package main

import (
    "fmt"
    "os/exec"
    "strconv"
    "strings"
)

func main() {
    // Test the sentiment analysis function directly with a hardcoded string
    testText := "This is a great day with lots of positive energy!"
    sentiment, err := getSentiment(testText)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Sentiment Score:", sentiment)
    }
}

// Assumes the getSentiment function is defined as follows:
func getSentiment(text string) (int, error) {
    cmd := exec.Command("python3", "GoSentiment.py", text)
    output, err := cmd.CombinedOutput() // Capture both stdout and stderr
    if err != nil {
        fmt.Printf("Failed to execute command: %s, Output: %s\n", err, output)
        return 0, err
    }


	// Split the output and parse the last line
    outputs := strings.Split(strings.TrimSpace(string(output)), "\n")
    lastLine := outputs[len(outputs)-1]
    sentiment, err := strconv.Atoi(lastLine)
    if err != nil {
        fmt.Printf("Error parsing output as integer: %s, Output: %s\n", err, output)
        return 0, err
    }

    return sentiment, nil
}
