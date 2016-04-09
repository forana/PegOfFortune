package puzzles

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3" // shh
)

// Puzzle represents a puzzle
type Puzzle struct {
	ID       string `json:"id"`
	Category string `json:"category"`
	Solution string `json:"solution"`
}

var conn *sqlx.DB

func init() {
	var err error
	conn, err = sqlx.Open("sqlite3", "puzzles.db")
	if err != nil {
		panic(err)
	}
}

// GetNew retrieves a puzzle that is not the one the player just saw.
func GetNew(excludeID string) (*Puzzle, error) {
	puzzle := &Puzzle{}
	return puzzle, conn.Get(puzzle, "select id, category, solution from puzzles where id <> $1 order by random() limit 1", excludeID)
}
