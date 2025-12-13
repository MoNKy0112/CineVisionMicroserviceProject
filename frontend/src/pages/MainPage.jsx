import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { MovieService } from '../services/movieService';
import { useNavigate } from 'react-router-dom';
import { mockCategories, mockCities } from '../services/mockData';

export default function MainPage() {
 
    const movieService = new MovieService();

    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]); // Almacenar todas las películas sin filtrar
    const [activeTab, setActiveTab] = useState('displaying');
    const [selectedCategory, setSelectedCategory] = useState(''); // RF8: Filtro de categoría
    const [selectedCity, setSelectedCity] = useState(''); // RF9: Filtro de ciudad

    // Función para filtrar películas
    function applyFilters(moviesToFilter) {
        let filtered = moviesToFilter;
        
        // RF8: Filtrar por categoría
        if (selectedCategory) {
            filtered = filtered.filter(movie => movie.category === selectedCategory);
        }
        
        // RF9: Filtrar por ciudad
        if (selectedCity) {
            filtered = filtered.filter(movie => movie.city === selectedCity);
        }
        
        setMovies(filtered);
    }

    async function getMovies(tabType) {
        setActiveTab(tabType);
        setSelectedCategory(''); // Reset filtros al cambiar tab
        setSelectedCity('');
        
        let moviesToShow;
        
        if (tabType === 'comingSoon') {
            const result = await movieService.getAllComingSoonMovies();
            moviesToShow = result.data;
        } else if (tabType === 'archived') {
            const result = await movieService.getAllArchivedMovies();
            moviesToShow = result.data;
        } else {
            const result = await movieService.getAllDisplayingMovies();
            moviesToShow = result.data;
        }
        
        setAllMovies(moviesToShow);
        setMovies(moviesToShow);
    }

    // Cuando cambian los filtros, reaplica los filtros
    useEffect(() => {
        applyFilters(allMovies);
    }, [selectedCategory, selectedCity]);

    useEffect(() => {
      getMovies('displaying');
    }, [])
    

  return (
    <div>

    <body id="page-top">
    <section>
        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="false">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
            <header class="masthead text-center text-white">
                <div class="masthead-content">
                    <div class="container px-5">
                        <h1 class="masthead-heading mb-0">CineVision</h1>
                        <h2 class="masthead-subheading mb-0">
                            No te pierdas el placer del cine con CineVision
                        </h2>
                        <h2 class="mt-3">
                            Las películas más nuevas en cartelera en los cines CineVision
                        </h2>
                        <a class="btn btn-primary btn-xl rounded-pill mt-5" href="#scroll">Películas</a>
                    </div>
                </div>
                <div class="bg-circle-1 bg-circle"></div>
                <div class="bg-circle-2 bg-circle"></div>
                <div class="bg-circle-3 bg-circle"></div>
                <div class="bg-circle-4 bg-circle"></div>
            </header>
          
            </div>
        {/* Second slide */}

                <div class="topgun-bg carousel-item">

                </div>

        {/* Third slide */}
            <div class="assasin-bg carousel-item">
            
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
        </div>
    </section>


    {/* Section - 2 Navs & Tabs */}

    <section className='py-5'>
        <div className='d-flex justify-content-center'>
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class={`nav-link ${activeTab === 'displaying' ? 'active' : ''}`} id="pills-home-tab" data-bs-toggle="pill" 
                        data-bs-target="#pills-home" type="button"
                        role="tab" aria-controls="pills-home" aria-selected={activeTab === 'displaying'}
                        onClick={() => {
                            getMovies('displaying')
                        }}>En Cartelera</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class={`nav-link ${activeTab === 'comingSoon' ? 'active' : ''}`} id="pills-profile-tab" data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button" role="tab" aria-controls="pills-profile" aria-selected={activeTab === 'comingSoon'}
                    onClick={() => {
                        getMovies('comingSoon')
                    }}>Próximamente</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class={`nav-link ${activeTab === 'archived' ? 'active' : ''}`} id="pills-archived-tab" data-bs-toggle="pill"
                    data-bs-target="#pills-archived"
                    type="button" role="tab" aria-controls="pills-archived" aria-selected={activeTab === 'archived'}
                    onClick={() => {
                        getMovies('archived')
                    }}>Películas Archivadas</button>
                </li>
            </ul>
        </div>
    </section>

    {/* Section - Filtros RF8 y RF9 */}
    <section className='py-3 bg-light'>
        <div className='container'>
            <div className='row g-3'>
                {/* RF8: Filtro por categoría */}
                <div className='col-md-6'>
                    <label className='form-label fw-bold'>Filtrar por Categoría</label>
                    <select 
                        className='form-select'
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value=''>Todas las categorías</option>
                        {mockCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* RF9: Filtro por ciudad */}
                <div className='col-md-6'>
                    <label className='form-label fw-bold'>Filtrar por Ciudad</label>
                    <select 
                        className='form-select'
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value=''>Todas las ciudades</option>
                        {mockCities.map(city => (
                            <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='mt-2'>
                <small className='text-muted'>Mostrando {movies.length} película(s)</small>
            </div>
        </div>
    </section>

    {/* Section - 3 Movie Carrousel */}

    <section className='mb-5'>
        <Swiper
            slidesPerView={5}
            spaceBetween={0}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper movie-slider"
        >
            {movies.map(movie => (
                <SwiperSlide key={movie.movieId}>
                    <div className='slider-item' onClick={()=> navigate("/movie/" + movie.movieId)}>
                        <div className='slider-item-caption d-flex align-items-end justify-content-center h-100 w-100'>
                            <div class="d-flex align-items-center flex-column mb-3" style={{height: "20rem"}}>
                                <div class="mb-auto pt-5 text-white"><h3> {movie.movieName} </h3></div>
                                <div class="p-2 d-grid gap-2">
                                    <a class="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                                        onClick={()=> navigate("/movie/" + movie.movieId)}>
                                        <strong>Comentar </strong>
                                    </a>
                                    <a class="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                                        onClick={()=> navigate("/movie/" + movie.movieId)}>
                                        <strong> Comprar Boleto </strong>
                                    </a>
                                </div>
                            
                            </div>
                        </div>
                        <img src={movie.movieImageUrl}
                            class="img-fluid mx-2" alt="..."/>
                    </div>
                </SwiperSlide>
            ))}
            

        </Swiper>

   
    </section>

  
        
    </body>
    </div>
  )
}
