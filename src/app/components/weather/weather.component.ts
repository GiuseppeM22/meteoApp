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

        this.meteoApi = `https://api.open-meteo.com/v1/forecast?latitude=${this.coordinates.latitude}&longitude=${this.coordinates.longitude}&current=temperature_2m,wind_speed_10m`;

        this.fetchWeatherData();
      } else {
        this.coordinates = null;
        this.weatherData = null; 
      }
    });

  }

  fetchWeatherData(): void {
    if (this.meteoApi) {
      this.http.get<any>(this.meteoApi).subscribe(
        data => {
          this.weatherData = data.current; 
        },
        error => {
          console.error('Errore durante la chiamata all\'API del meteo:', error);
        }
      );
    }
  }
}
