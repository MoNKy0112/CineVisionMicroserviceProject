import axios from "axios";

export class MovieService {

    apiUrl = "http://localhost:8080/api/movie/movies/"

    getAllDisplayingMovies() {
        return axios.get(this.apiUrl + "displayingMovies");
    }

    getAllComingSoonMovies() {
        return axios.get(this.apiUrl + "comingSoonMovies");
    }

    getUpcomingProjectionMovies() {
        return axios.get(this.apiUrl + "upcomingProjectionMovies");
    }

    getRecentlyProjectionMovies() {
        return axios.get(this.apiUrl + "recentlyProjectionMovies");
    }

    getMoviesLeavingSoon() {
        return axios.get(this.apiUrl + "leavingSoonMovies");
    }

    getMoviesOutOfTheaters() {
        return axios.get(this.apiUrl + "outOfTheatersMovies");
    }

    getMovieById(movieId) {
        return axios.get(this.apiUrl + movieId);
    }

    addMovie(movieDto) {
        return axios.post(this.apiUrl + "add", movieDto);
    }
}