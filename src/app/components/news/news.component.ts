import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  currentPageIndex: number = 0;
  pages: any[] = [[]]; // Inizializzazione con una pagina vuota
  nextPageId: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('Inizializzazione del componente...');
    this.getLatestNews();
  }

  getLatestNews(pageId?: string) {
    let url = `https://newsdata.io/api/1/news?apikey=pub_39472fba2bfd2d23efcb4cd7aa157c6c22179&language=it&category=lifestyle,sports,technology`;

    // If pageId is defined, append it to the URL
    if (pageId) {
      url += `&page=${pageId}`;
    }

    this.http.get(url)
      .subscribe((response: any) => {
        console.log('Risposta ricevuta:', response);
        if (response.results.length > 0) {
          this.pages.push(response.results); // Push the current page to pages array
          this.nextPageId = response.nextPage; // Set nextPageId for the next request
        }
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
    }
  }
}
