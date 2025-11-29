# tests_integration/backend_db/test_gateway_get_movies.py
import requests
import json

GATEWAY_URL = "http://localhost:8080/api/movie/movies/displayingMovies"

def test_gateway_returns_movies_correctly():
    print("\n==============================")
    print(" INICIO TEST: GET MOVIES ")
    print("==============================")
    print(f"Llamando al API Gateway en: {GATEWAY_URL}")

    # 1. ACT
    response = requests.get(GATEWAY_URL)

    print("\n> Status Code recibido:", response.status_code)
    print("> Cuerpo bruto de la respuesta:")

    # Imprimir la respuesta formateada, si es JSON
    try:
        print(json.dumps(response.json(), indent=4, ensure_ascii=False))
    except:
        print(response.text)

    # 2. ASSERT BÁSICO
    assert response.status_code == 200, (
        f" El API Gateway devolvió un status inesperado: {response.status_code}"
    )

    movies = response.json()

    print("\n> Cantidad de películas recibidas:", len(movies))

    assert isinstance(movies, list), " La respuesta debe ser una lista."

    assert len(movies) > 0, " La lista de películas no debe estar vacía."

    print("\n> Validando estructura de cada película...\n")

    for i, movie in enumerate(movies):
        print(f"--- Película #{i + 1} ---")
        print(json.dumps(movie, indent=4, ensure_ascii=False))

        assert "movieId" in movie, " Falta movieId"
        assert isinstance(movie["movieId"], int), " movieId debe ser int"

        assert "movieName" in movie, " Falta movieName"
        assert isinstance(movie["movieName"], str)

        assert "description" in movie
        assert isinstance(movie["description"], str)

        assert "duration" in movie
        assert isinstance(movie["duration"], int)

        assert "releaseDate" in movie
        assert isinstance(movie["releaseDate"], str)

        assert "categoryId" in movie
        assert isinstance(movie["categoryId"], int)

        assert "categoryName" in movie
        assert isinstance(movie["categoryName"], str)

        assert "movieImageUrl" in movie
        assert isinstance(movie["movieImageUrl"], str)

        assert "movieTrailerUrl" in movie
        assert isinstance(movie["movieTrailerUrl"], str)

        assert "directorName" in movie
        assert isinstance(movie["directorName"], str)

        assert "display" in movie
        assert isinstance(movie["display"], bool)

        print(" Película validada correctamente.\n")

    print("==============================")
    print(" TEST FINALIZADO CON ÉXITO  ")
    print("==============================\n")
test_gateway_returns_movies_correctly()