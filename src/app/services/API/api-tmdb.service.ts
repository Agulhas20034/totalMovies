import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

//Ambas as interfaces geradas atravez do site https://transform.tools/json-to-typescript atravez da transformação
//da resposta em json da api na função getTopRatedMovies
export interface Root {
  page: number
  results: Result[]
  total_pages: number
  total_results: number
}

export interface Result {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Shows {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path?: string
  first_air_date: string
  name: string
  vote_average: number
  vote_count: number
}

@Injectable({
  providedIn: 'root'
})
export class ApiTMDBService {

  constructor(private http: HttpClient) { }

  getTopRatedMovies(page = 1): Observable<Root>{
    return this.http.get<Root>(
      `${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`
    );
  }

  getMovieDetails(id:string){
    return this.http.get(
      `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`
    );
  }
  getTvShowDetails(tvId: string){
    return this.http.get(
      `${environment.baseUrl}/tv/${tvId}?api_key=${environment.apiKey}`  
  );
}
  getMovieDetailsO(id: string): Observable<Result> {
    return this.http.get<Result>(`${environment.baseUrl}/movie/${id}`);
}

  getMovieimageDetails(id:string){
    return this.http.get(
      `${environment.images}/${id}?api_key=${environment.apiKey}`
    );
  }

  getFullImagePath(posterPath: string | null): string {
    return posterPath ? environment.images + "/w500" + posterPath : 'assets/no-poster.jpg';
  }
  
 getGenres(mediaType: 'movie' | 'tv') {
    return this.http.get(`${environment.baseUrl}/genre/${mediaType}/list`, {
      params: { api_key: environment.apiKey }
    });
  }

  search(mediaType: 'movie' | 'tv', query: string) {
    return this.http.get(`${environment.baseUrl}/search/${mediaType}`, {
      params: {
        api_key: environment.apiKey,
        query: query
      }
    });
  }

  discover(params: {
    mediaType: 'movie' | 'tv',
    year?: number,
    genre?: number,
    rating?: number,
    language?: string
  }) {
    const requestParams: any = {
      api_key: environment.apiKey,
      sort_by: 'popularity.desc'
    };

    // Add media type specific parameters
    if (params.mediaType === 'movie') {
      if (params.year) requestParams.primary_release_year = params.year;
    } else {
      if (params.year) requestParams.first_air_date_year = params.year;
    }

    if (params.genre) requestParams.with_genres = params.genre;
    if (params.rating) requestParams['vote_average.gte'] = params.rating;
    if (params.language) requestParams.with_original_language = params.language;

    return this.http.get(`${environment.baseUrl}/discover/${params.mediaType}`, {
      params: requestParams
    });
  }

  getLanguages(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/configuration/languages?api_key=${environment.apiKey}`);
  }
  
}
