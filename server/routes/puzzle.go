package routes

import (
	"net/http"

	"github.com/forana/luckball/server/puzzles"
)

// GetPuzzle retrieves a new random puzzle.
func GetPuzzle(w http.ResponseWriter, r *http.Request) {
	excludeID := r.URL.Query().Get("exclude")
	puzzle, err := puzzles.GetNew(excludeID)
	if err != nil {
		panic(err)
	}
	respondObj(w, 200, puzzle)
}
