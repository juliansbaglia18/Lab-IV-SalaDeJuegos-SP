import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  games = [
    {
      name: 'Ahorcado',
      route: 'users/games/hangman',
      img: '../../../../assets/images/hangman_min.png',
    },
    {
      name: 'Mayor-Menor',
      route: 'users/games/high-or-low',
      img: '../../../../assets/images/high_low_min.png',
    },
    {
      name: 'Preguntados',
      route: 'users/games/trivia-crack',
      img: '../../../../assets/images/trivia_crack_min.png',
    },
    {
      name: 'Juego Propio',
      route: 'users/games/run-and-jump',
      img: '../../../../assets/images/juego_propio_min.png',
    },
  ];

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  navigateToGame(game: any) {
    this._router.navigateByUrl(game.route);
  }
}
