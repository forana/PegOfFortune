package puzzles

import (
	"math/rand"
)

// Puzzle represents a puzzle
type Puzzle struct {
	ID       string `json:"id"`
	Category string `json:"category"`
	Solution string `json:"solution"`
}

var puzzles = []*Puzzle{}

func init() {
	puzzles = []*Puzzle{
		&Puzzle{ID: "abc", Category: "Food", Solution: "Pork Chop\nSandwiches"},
		&Puzzle{ID: "def", Category: "Thing", Solution: "Spooky Scary\nSkeletons"},
		&Puzzle{ID: "ghi", Category: "Question", Solution: "What's in\nthe box?"},
		&Puzzle{ID: "jkl", Category: "Testing", Solution: "Testing this,\nI am testing"},
	}
}

// GetNew retrieves a puzzle that is not the one the player just saw.
func GetNew() *Puzzle {
	return puzzles[rand.Intn(len(puzzles))]
}
