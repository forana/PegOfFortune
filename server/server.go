package server

import (
	"net/http"
	"os"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

// Serve serves the servable serving
func Serve() {
	server := negroni.Classic()
	router := mux.NewRouter()
	bindRoutes(router)
	server.Use(negroni.NewStatic(http.Dir("./frontend")))
	server.UseHandler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	server.Run("localhost:" + port)
}
