import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnChanges{
  cityName: string = '';
  coordinates: { latitude: number, longitude: number } | null = null;
  meteoApi: string = '';
  weatherData: any = null;
  backgroundImage: string;
  pageTitle: string = '';
  loading: boolean = false; // Variabile per tenere traccia dello stato di caricamento
  notFound: boolean = false
  cityInfo: string;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.searchCoordinates();
    
  }
  /* 
    dato che l'api del meteo accetta come valori di ricerca solo latitudine e longitudine
    in questo metodo andiamo ad utilizzare un'altra api per convertire il nome della citta' in dati di latitudine e longitudine 
  */
  searchCoordinates(): void {
    const apiUrl = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: this.cityName,
      format: 'json',
    };

    this.loading = true;

    this.http.get<any[]>(apiUrl, { params }).subscribe(data => {
      if (data.length > 0) {
        this.coordinates = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        //dal nostro data , ci prendiamo l'informazione della nazione
        if (data[0].hasOwnProperty('display_name')) {
          const displayName = data[0].display_name;
          // Divido la stringa utilizzando la virgola come delimitatore
          const displayNameParts = displayName.split(',');
          // Prendo l'ultima parte e rimuovo con il metodo trim() eventuali spazi vuoti
          const country = displayNameParts[displayNameParts.length - 1].trim();
          this.cityInfo = country;
        }
        console.log(data);
        
        this.meteoApi = `https://api.open-meteo.com/v1/forecast?latitude=${this.coordinates.latitude}&longitude=${this.coordinates.longitude}&current=is_day,temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,cloud_cover,wind_speed_10m`;
        
        this.fetchWeatherData();
        this.pageTitle = `Meteo ${this.cityName}`;
      } else {
        this.coordinates = null;
        this.weatherData = null;
        this.backgroundImage = ''; 
        this.pageTitle = '';
        this.loading = false;
        this.notFound = true
      }
    });
  }

  /* in questo metodo vado ad effettuare la definitiva chiamata all'api per i servizi metereoogici */
  fetchWeatherData(): void {
    if (this.meteoApi) {

      this.loading = true;

      this.http.get<any>(this.meteoApi).subscribe(
        data => {
          this.weatherData = data.current;

          // if (this.weatherData.is_day !== undefined) {
          //   // Controllo per impostare la classe per lo sfondo in base alla temperatura
          //   //se notte
          //   if (this.weatherData.temperature_2m <= 0 && this.weatherData.precipitation_probability >= 50) {
          //     this.backgroundImage = 'immagineNeveNotte';
          //   } else if ( this.weatherData.temperature_2m <= 0) {
          //     this.backgroundImage = 'immagineFreddoNotte';
          //   } else if ( this.weatherData.precipitation_probability >= 50) {
          //     this.backgroundImage = 'immaginePioggiaNotte';
          //   } else if ( this.weatherData.cloud_cover >= 70) {
          //     this.backgroundImage = 'immagineNuvolosoNotte';
          //   } else {
          //     this.backgroundImage = 'immagineSerenoNotte';
          //   }
  
          //   //se giorno
          //   if (this.weatherData.is_day && this.weatherData.temperature_2m <= 0 && this.weatherData.precipitation_probability >= 50) {
          //     this.backgroundImage = 'immagineNeve';
          //   } else if (this.weatherData.is_day && this.weatherData.temperature_2m <= 0) {
          //     this.backgroundImage = 'immagineFreddo';
          //   } else if (this.weatherData.is_day && this.weatherData.precipitation_probability >= 50) {
          //     this.backgroundImage = 'immaginePioggia';
          //   } else if (this.weatherData.is_day && this.weatherData.cloud_cover >= 70) {
          //     this.backgroundImage = 'immagineNuvoloso';
          //   } else if(this.weatherData.is_day) {
          //     this.backgroundImage = 'immagineSole';
          //   }
          // }
          
          this.loading = false;
          this.cityName = ''
          this.notFound = false
        },
        error => {
          console.error('Errore durante la chiamata all\'API del meteo:', error);
          this.loading = false;
        }
      );
    }
  }
}
