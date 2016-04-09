package server

import (
	"github.com/gorilla/mux"

	"github.com/forana/luckball/server/routes"
)

func bindRoutes(router *mux.Router) {
	router.HandleFunc("/puzzle", routes.GetPuzzle).Methods("GET")
}
