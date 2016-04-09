package routes

import (
	"encoding/json"
	"net/http"
)

func respondObj(w http.ResponseWriter, code int, obj interface{}) {
	w.Header().Set("Content-Type", "application/json;charset=utf-8")
	bytes, err := json.MarshalIndent(&obj, "", "    ")
	if err != nil {
		panic(err)
	}
	w.WriteHeader(code)
	w.Write(bytes)
	w.Write([]byte("\n"))
}
