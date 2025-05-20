import { HttpClient } from '@angular/common/http';
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
  
}
