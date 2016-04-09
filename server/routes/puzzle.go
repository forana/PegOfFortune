package routes

import (
	"net/http"

	"github.com/forana/PegOfFortune/server/puzzles"
)

// GetPuzzle retrieves a new random puzzle.
func GetPuzzle(w http.ResponseWriter, r *http.Request) {
	respondObj(w, 200, puzzles.GetNew())
}
