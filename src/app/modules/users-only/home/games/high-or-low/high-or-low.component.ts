import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/users.service';
import { Card } from './entities/card';
import { HolDefeatDialogComponent } from './hol-defeat-dialog/hol-defeat-dialog.component';
import { DeckOfCardsService } from './services/deck-of-cards.service';
import { DatePipe } from '@angular/common';
import { Score } from 'src/app/Entities/game-score';


const CARD_SEPARATION_PX = 10;
const INITIAL_CARD_POSITION_PX = 280;

type HighLow = 'High' | 'Low';

@Component({
  selector: 'app-high-or-low',
  templateUrl: './high-or-low.component.html',
  styleUrls: ['./high-or-low.component.css']
})

export class HighOrLowComponent implements OnInit {

  // deck_id : string;
  // cards : 
  // { info : Card;
  //   rawValue : number;
  //   absolutePosition : number;    
  // }[] = [];
  // selectedValue : HighLow;
  // defeat = false;

  // constructor(private _cardsService : DeckOfCardsService, public defeatDialog : MatDialog, private _router : Router, public usersService : AuthService, private datePipe : DatePipe) { }

  // ngOnInit(): void {
  //   this._cardsService.getNewDeck().subscribe((response)=>{
  //       this.deck_id = response.deck_id;
  //       this.getNewCard();
  //   });
  // }

  // get previousCard() : number{
  //   return this.cards[this.cards.length - 2].rawValue;
  // }

  // get currentCard() : number{
  //   return this.cards[this.cards.length - 1].rawValue;
  // }

  // get score() : number {
  //   return this.cards.length - 2;
  // }

  // getNewCard(){
  //   this._cardsService.drawCard(this.deck_id).subscribe((response)=>{
  //       this.cards.push({ 
  //         info : response.cards[0], 
  //         rawValue : this.getRawValue(response.cards[0]),
  //         absolutePosition : this.getCardTopMargin()          
  //       });
  //   });
  // }

  // getCardTopMargin() : number {
  //    return this.cards.length > 0 ? 
  //    this.cards[this.cards.length - 1].absolutePosition + CARD_SEPARATION_PX :
  //     INITIAL_CARD_POSITION_PX
  // }

  // getRawValue(card : Card) : number{
  //   switch (card.value) {
  //     case 'JACK':
  //       return 11;
  //     case 'QUEEN':
  //       return 12;
  //     case 'KING':
  //       return 13;
  //     case 'ACE':
  //       return 14;
  //     default : 
  //     return Number(card.value);
  //   }
  // }

  // sumarPunto(){
    
  // }

  // async handleAskForCard(selected : HighLow){
  //   const source$ = this._cardsService.drawCard(this.deck_id)
  //   const response = await lastValueFrom(source$);
  //   this.cards.push({ 
  //       info : response.cards[0], 
  //       rawValue : this.getRawValue(response.cards[0]),
  //       absolutePosition : this.getCardTopMargin()          
  //   });
  //   if (this.playerGuessedWrong(selected)){
  //     this.usersService.addGameResult(this.getScore(), 'HighOrLow');
  //     this.openDefeatDialog({data : { score : this.score}});
  //   }
  // }

  // playerGuessedWrong(selected : HighLow){
  //   return this.currentCard > this.previousCard && selected == 'Low' 
  //   || this.currentCard < this.previousCard && selected == 'High'
  // }

  // openDefeatDialog(data : {data :{ score : number}}){
  //   let dialogRef = this.defeatDialog.open(HolDefeatDialogComponent, data);
  //   dialogRef.afterClosed().subscribe((playAgain) => {
  //     if(playAgain == "true"){
  //       this.reset();
  //     } else {
  //       this._router.navigateByUrl('/users/home');
  //     }
  //   })
  // }

  // reset(){
  //   this.cards.length = 0;
  //   this._cardsService.getNewDeck().subscribe((response)=>{
  //     this.deck_id = response.deck_id;
  //     this.getNewCard();
  //   });
  // }

  // getScore() : Score{
  //   return { 
  //     date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
  //     score : this.score
  //   }
  // }

  public mazoOriginal: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public mazo: number[] = [];
  public numeroActual: number = 0;
  public numeroSiguiente: number = 0;
  public btnComenzar: string = 'Comenzar';
  public mostrarGanador: boolean = false;
  public mostrarPerdedor: boolean = false;
  score = 0;

  constructor(private usersService : AuthService, private datePipe : DatePipe) {
  }

  ngOnInit(){
    this.deshabilitarBotones();
  }

  comenzar() {
    this.mostrarGanador = false;
    this.mostrarPerdedor = false;
    this.mazo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.mazo = this.shuffleArray(this.mazo);
    const extractedNumber = this.extractNumber(this.mazo, this.randomNumber());

    if (extractedNumber !== null) {
      this.numeroActual = extractedNumber;
      this.btnComenzar = 'Reiniciar';
    } else {
      console.log('No se pudo extraer un número.');
    }
    console.log(this.mazo);

    this.habilitarBotones();

  }

  getScore() : Score{
    return { 
      date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
      score : this.score
    }
  }

  finalizar(){
    this.numeroActual = 0;
    this.deshabilitarBotones();
    this.usersService.addGameResult(this.getScore(), 'HighOrLow');
  }

  gano(){
    this.mostrarGanador = true;
    this.finalizar();
  }

  perdio(){
    this.mostrarPerdedor = true;
    this.finalizar();
  }

  mayor() {
    console.log('Es mayor?');
    const numeroSiguiente = this.mazo[0];
    console.log("Numero actual:" + this.numeroActual + " - Número siguiente: " + numeroSiguiente);
    if(this.amayorQueB(numeroSiguiente, this.numeroActual)){
        console.log("Es mayor");
        this.score++;
        let numeroSiguiente = this.extractNumber(this.mazo, this.mazo[0]);
        console.log(numeroSiguiente);
        if (numeroSiguiente != null) {
          this.numeroActual = numeroSiguiente;
        }
        console.log(this.mazo);
      }
      else{
        this.perdio();
      }
      this.verificarArrayVacio(this.mazo);
  }

  menor(){
    console.log('Es menor?');
    const numeroSiguiente = this.mazo[0];
    console.log("Numero actual:" + this.numeroActual + " - Número siguiente: " + numeroSiguiente);
    if(this.amenorQueB(numeroSiguiente, this.numeroActual)){
      console.log("Es menor");
      this.score++;
      let numeroSiguiente = this.extractNumber(this.mazo, this.mazo[0]);
      console.log(numeroSiguiente);
      if (numeroSiguiente!= null) {
        
        this.numeroActual = numeroSiguiente;
      }
      console.log(this.mazo);
    }
    else{
      this.perdio();
    }
    this.verificarArrayVacio(this.mazo);

  }

  
  obtenerPrimerNumero(arr: number[]): number | null {
    if (arr.length > 0) {
      return arr[0];
    } else {
      console.error('El array está vacío.');
      return null;
    }
  }

  extractNumber(arr: number[], numberToExtract: number): number | null {
    const index = arr.indexOf(numberToExtract);
    if (index !== -1) {
      const extractedNumber = this.mazo.splice(index, 1)[0];
      return extractedNumber;
    } else {
      return null;
    }
  }

  shuffleArray(arr: number[]): number[] {
    const shuffledArray = [...arr]; // Crear una copia del array para no modificar el original

    // Algoritmo de mezcla Fisher-Yates
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }

  randomNumber(): number {
    let retorno = 0;
    retorno = Math.floor(Math.random() * (this.mazoOriginal.length - 1)) + 1;
    return retorno;
  }

  amayorQueB(a: number, b: number) {
    console.log("Número A: " + a + ", b: " + b);
    if (a > b) {
      console.log("Retorno: true");
      return true;

    }
    console.log("Retorno: false");
    return false;
  }

  amenorQueB(a: number, b: number) {
    console.log("Número A: " + a + ", b: " + b);
    if (a < b) {
      console.log("Retorno: true");
      return true;
    }
    console.log("Retorno: false");
    return false;
  }

  menorQue(a: number, b: number) {
    if (a < b) {
      return true;
    }

    return false;
  }

  verificarArrayVacio(arr: any[]) {
    console.log("Verificar Array");
    if (arr.length === 0) {
      console.log("Array vacio");
      this.gano();  // Llama a la función gano si el array está vacío
    }
  }

  deshabilitarBotones(){
    this.deshabilitarElemento('mayor');
    this.deshabilitarElemento('menor');
  }

  habilitarBotones(){
    this.habilitarElemento('mayor');
    this.habilitarElemento('menor');
  }

  deshabilitarElemento(id: string){
    let elemento = document.getElementById(id);
    if (elemento) {
      elemento.setAttribute('disabled', 'true');
    }
  }

  habilitarElemento(id: string){
    let elemento = document.getElementById(id);
    if (elemento) {
      elemento.removeAttribute('disabled');
    }
  }
}
