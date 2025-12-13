import axios from "axios";
import { mockMovies } from "./mockData";

export class MovieService {

    apiUrl = "http://localhost:8080/api/movie/movies/"

    getAllDisplayingMovies() {
        // Intenta usar el backend, si falla usa datos mockeados
        return axios.get(this.apiUrl + "displayingMovies")
            .catch(() => {
                return Promise.resolve({ data: mockMovies.displaying });
            });
    }

    getAllComingSoonMovies() {
        return axios.get(this.apiUrl + "comingSoonMovies")
            .catch(() => {
                return Promise.resolve({ data: mockMovies.comingSoon });
            });
    }

    getAllArchivedMovies() {
        // RF4: Películas archivadas
        return Promise.resolve({ data: mockMovies.archived });
    }

    getMovieById(movieId) {
        return axios.get(this.apiUrl + movieId)
            .catch(() => {
                // Busca en los datos mockeados
                const allMovies = [...mockMovies.displaying, ...mockMovies.comingSoon, ...mockMovies.archived];
                const movie = allMovies.find(m => m.movieId === parseInt(movieId));
                return Promise.resolve({ data: movie || {} });
            });
    }

    addMovie(movieDto) {
        return axios.post(this.apiUrl + "add", movieDto);
    }
}