import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { Video } from './domain/video.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'player-video';

  selectedVideo?: Video;

  videos: Video[] = [
    {
      id: '8f620eb5-3341-43ea-99e3-c4be3de2aa98',
      title: 'Hades',
      description: 'Hades - Announcement Trailer',
      thumbnail: '../assets/Hades/cover/344da3de659b464bb3b68799587506c0.jpg',
      videoUrl: '../assets/Hades/1080/Hades - v1.0 Launch Trailer.mp4',
      duration: '1:33',
    },
    {
      id: '46f5cdef-4493-4a35-bb7a-ffaba633cd98',
      title: 'Clair Obscur',
      description:
        'Clair Obscur: Expedition 33 - Cast Reveal Trailer | PS5 Games',
      thumbnail: '../assets/Clair Obscur/cover/maxresdefault.jpg',
      videoUrl:
        '../assets/Clair Obscur/1080/Clair Obscur： Expedition 33 - Baguette Trailer (French Cast Reveal) ｜ PS5 Games.mp4',
      duration: '2:33',
    },
    {
      id: '69e72246-6a23-4b72-bc88-8ce7adf507ac',
      title: 'Hit workout',
      description: '20 Min cardio hit workout - All standing - Full body',
      thumbnail: '../assets/Hit workout/cover/hqdefault.jpg',
      videoUrl:
        '../assets/Hit workout/720/20 MIN CARDIO HIIT WORKOUT - ALL STANDING - Full Body, No Equipment, No Repeats (1).mp4',
      duration: '27:47',
    },
    {
      id: '451fb73a-0f0a-4a86-8113-6292307b15dc',
      title: 'Fat burning hit workout',
      description:
        '20 Min Fat Burning HIT Workout - Full Body Cardio, No Equipment, No Repeat',
      thumbnail: '../assets/Fat Burning Hit Workout/cover/hqdefault.jpg',
      videoUrl:
        '../assets/Fat Burning Hit Workout/720/20 Min Fat Burning HIIT Workout -  Full body Cardio, No Equipment, No Repeat.mp4',
      duration: '20:23',
    },
    {
      id: 'c4c28c68-5178-498e-91ec-e48059b7004d',
      title: 'Dont throw bread side',
      description:
        'Meal Prep For The Week In Under An Hour | Sweet and Sour Chicken',
      thumbnail: '../assets/Dont throw bread side/cover/hqdefault.jpg',
      videoUrl:
        '../assets/Dont throw bread side/720/Dont throw bread sides ｜ 5 minutes healthy bread snacks｜ Quick bread recipe ｜ evening snacks.mp4',
      duration: '6:34',
    },
    {
      id: '7dadc7e8-12d1-448f-ab84-68b9d99d2f7b',
      title: 'Battlefield 1',
      description: 'Battlefield 1 Official Gamescom Trailer',
      thumbnail: '../assets/Battlefield 1/cover/zCzwGmscCAucmEoCzNLkWf.jpg',
      videoUrl:
        '../assets/Battlefield 1/720/Battlefield 1 Official Gamescom Trailer.mp4',
      duration: '1:49',
    },
    {
      id: '30c4cc73-fc68-4a6a-bac3-b5fdab78f341',
      title: 'Sony FE 16-35mm 2.8 GM II.',
      description: 'Sony FE 16-35mm 2.8 GM II - Volvió el favorito con mejoras.',
      thumbnail: '../assets/Sony FE 16-35mm/cover/hqdefault.jpg',
      videoUrl: '../assets/Sony FE 16-35mm/720/Sony FE 16-35mm 2.8 GM II -  VOLVIÓ EL FAVORITO CON MEJORAS..mp4',
      duration: '7:09'
    },
  ];

  selectVideo(video: Video): void {
    this.selectedVideo = video;
  }
}
