package main

import (
    "fmt"
    "os/exec"
    "strconv"
    "strings"
)

// Assumes the getSentiment function is defined as follows:
func testGetSentiment(text string) (int, error) {
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
