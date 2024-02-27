import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  cityName: string = '';
  coordinates: { latitude: number, longitude: number } | null = null;
  meteoApi: string = '';
  weatherData: any = null;
  backgroundImage: string;
  pageTitle: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchCoordinates();
  }

  searchCoordinates(): void {
    const apiUrl = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: this.cityName,
      format: 'json',
    };

    this.http.get<any[]>(apiUrl, { params }).subscribe(data => {
      if (data.length > 0) {
        this.coordinates = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        this.meteoApi = `https://api.open-meteo.com/v1/forecast?latitude=${this.coordinates.latitude}&longitude=${this.coordinates.longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,wind_speed_10m`;

        this.fetchWeatherData();
        this.pageTitle = `Meteo ${this.cityName}`;
      } else {
        this.coordinates = null;
        this.weatherData = null;
        this.backgroundImage = ''; 
        this.pageTitle = '';
      }
    });
  }

  fetchWeatherData(): void {
    if (this.meteoApi) {
      this.http.get<any>(this.meteoApi).subscribe(
        data => {
          this.weatherData = data.current;
          // Controllo per impostare la classe per lo sfondo in base alla temperatura
          if (this.weatherData.temperature_2m <= 0 && this.weatherData.precipitation_probability >= 50) {
            this.backgroundImage = 'immagineNeve';
          } else if (this.weatherData.temperature_2m <= 0) {
            this.backgroundImage = 'immagineFreddo';
          } else if (this.weatherData.precipitation_probability >= 50) {
            this.backgroundImage = 'immaginePioggia';
          } else if (this.weatherData.cloud_cover >= 70) {
            this.backgroundImage = 'immagineNuvoloso';
          } else {
            this.backgroundImage = 'immagineSole';
          }
        },
        error => {
          console.error('Errore durante la chiamata all\'API del meteo:', error);
        }
      );
    }
  }
}
