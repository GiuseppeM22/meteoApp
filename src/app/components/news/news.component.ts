import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  currentPageIndex: number = 0;
  pages: any[] | undefined;
  nextPageId: string | undefined;
  loading: boolean = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getLatestNews();
  }

  getLatestNews(pageId?: string) {
    let url = `https://newsdata.io/api/1/news?apikey=pub_39472fba2bfd2d23efcb4cd7aa157c6c22179&language=it&category=lifestyle,sports,technology`;

    // If pageId is defined, append it to the URL
    if (pageId) {
      url += `&page=${pageId}`;
    }

    this.http.get(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Gestisci l'errore qui, ad esempio stampalo a console
          console.error('Errore durante la chiamata HTTP:', error);
          // Ritorna un observable vuoto o un observable con un valore di default
          this.loading = false;
          return throwError('Si è verificato un errore durante la chiamata HTTP.');
        })
      )
      .subscribe((response: any) => {
        console.log('Risposta ricevuta:', response);
        if (response.results.length > 0) {
          if (!this.pages) {
            this.pages = []; // Inizializza l'array solo se non è già stato inizializzato
          }
          this.pages[this.currentPageIndex] = response.results; // Assegna i dati alla pagina corrente
          this.nextPageId = response.nextPage;
        }
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  onNextPage() {
    if (this.nextPageId) {
      this.currentPageIndex++;
      this.getLatestNews(this.nextPageId);
    }
  }

  onPrevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.getLatestNews(this.nextPageId);
    }
  }
}
