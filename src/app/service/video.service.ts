import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Video } from '../domain/video.interface';
import { HttpClient } from '@angular/common/http';
import { Videos } from '../utils/data';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private videos = new BehaviorSubject<Video[]>([]);
  private currentPage = 1;
  //private pageSize = 12;
  private loading = false;


  constructor() { }

  getVideos(): Observable<Video[]> {
    return this.videos.asObservable();
  }

  loadMoreVideos() {
    if (this.loading) return;

    this.loading = true;
    try {
      const newVideos = Videos;
      this.videos.next([...this.videos.value, ...newVideos]);
      this.currentPage++;
    } finally {
      this.loading = false;
    }
  }

  searchVideos(query: string): Observable<Video[]> {
    const filteredVideos = Videos.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    );
    this.videos.next(filteredVideos);
    return this.videos.asObservable();
  }

  filterByCategory(category: string): Observable<Video[]> {
    const filteredVideos = Videos.filter((video) =>
      video.category?.toLowerCase().includes(category.toLowerCase())
    );
    this.videos.next(filteredVideos);
    return this.videos.asObservable();
  }
}
