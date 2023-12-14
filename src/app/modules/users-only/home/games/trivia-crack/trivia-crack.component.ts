import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxWheelComponent } from 'ngx-wheel';
import { HolDefeatDialogComponent } from '../high-or-low/hol-defeat-dialog/hol-defeat-dialog.component';
import { CorrectDialogComponent } from 'src/app/components/correct-dialog/correct-dialog.component';
import { TriviaService } from './trivia.service';
import { TriviaQuestion } from 'src/app/Entities/trivia-question';
import { AuthService } from 'src/app/services/users.service';
import { DatePipe } from '@angular/common';
import { Score } from 'src/app/Entities/game-score';
import { Preguntas } from './preguntas';

@Component({
  selector: 'app-trivia-crack',
  templateUrl: './trivia-crack.component.html',
  styleUrls: ['./trivia-crack.component.css']
})
export class TriviaCrackComponent {

  // constructor(private triviaService : TriviaService, public dialog : MatDialog, private _router : Router, private usersService : AuthService, private datePipe : DatePipe) { }

  // answers : string[] = [];
  // score = 0;
  // loadingQuestion = false;
  // triviaQuestion : TriviaQuestion;

  // ngOnInit(): void {
    
  // }

  // ngAfterViewInit(){
  // }

  // setQuestion(idCategory : number){
  //   this.loadingQuestion = true;
  //   this.triviaService.getQuestion(idCategory).subscribe((data)=>{
  //     this.triviaQuestion = data.results[0];
  //     console.log(this.triviaQuestion);
  //     this.answers = this.shuffleAnswers(data.results[0].correct_answer, ...data.results[0].incorrect_answers);
  //     this.loadingQuestion = false;
  //   })
  // }

  // shuffleAnswers(...ans : string[]) : string[]{
  //   let currentIndex = ans.length,  randomIndex;

  //   while (currentIndex != 0) {

  //     // Pick a remaining element.
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex--;

  //     // swap it with the current element.
  //     [ans[currentIndex], ans[randomIndex]] = [ans[randomIndex], ans[currentIndex]];
  //   }

  //   return ans;

  // }

  // answerSelected( ans : string){
  //   if(ans === this.triviaQuestion.correct_answer){
  //     this.openCorrectAnswerDialog();
  //   } else {
  //     this.usersService.addGameResult(this.getScore(), 'TriviaCrack');
  //     this.openDefeatDialog({data : { score : this.score}});
  //   }
  // }

  // openDefeatDialog(data : {data :{ score : number}}){
  //   let dialogRef = this.dialog.open(HolDefeatDialogComponent, data);
  //   dialogRef.afterClosed().subscribe((playAgain) => {
  //     if(playAgain == "true"){
  //       this.reset();
  //       this.score = 0;
  //     } else {
  //       this._router.navigateByUrl('/users/home');
  //     }
  //   })
  // }

  // openCorrectAnswerDialog(){
  //   let dialogRef = this.dialog.open(CorrectDialogComponent);
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.score++;
  //     this.reset();
  //     }
  //   )
  // }

  // reset (){
  //   this.triviaQuestion = undefined;
  //   this.answers = [];
  // }

  // getScore() : Score{
  //   return { 
  //     date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
  //     score : this.score
  //   }
  // }

  public tituloPage = 'Preguntados';

  public correoJugador: string = '';

  public juegoIniciado = false;
  public nivelSuperado = false;
  public nivelPerdido = false;
  public botonesDeshabilitados = true;
  public botonSiguienteDeshabilitado = true;
  public mostrarSpinner = false;

  public btnComenzar: string = 'Comenzar';

  public puntaje = 0;
  public nivel = 0;

  public preguntaImg: string = "";
  public preguntaStr: string = "";
  public respuestas: {respuesta: string, clase: string}[] = [{respuesta: '', clase: ''},{respuesta: '', clase: ''},{respuesta: '', clase: ''},{respuesta: '', clase: ''}]
  private idRespuestaCorrecta: number = 0;

  constructor(private imgPreguntasService: TriviaService, private usersService : AuthService, private datePipe : DatePipe) { }

  public iniciarJuego(){
    this.btnComenzar = 'Reiniciar';

      this.puntaje = 0;
      this.nivel = 0;
    
    this.nuevoNivel();
    this.juegoIniciado = true;
    this.nivelPerdido = false;
    this.nivelSuperado = false;

    console.log("Juego iniciado");
  }

  //Al asignar un nuevo nivel, mostramos spinner de carga, obtenemos palabra y reseteamos a 0 las fallas del nivel actual y ocultamos spinner al finalizar.
  public nuevoNivel(){
    this.mostrarSpinner = true;

    this.SiguientePregunta();
    this.nivel++;
    this.botonesDeshabilitados = false;
    this.botonSiguienteDeshabilitado = false;
    this.nivelSuperado = false;
    this.mostrarSpinner = false;
  }



  public SiguientePregunta(){
    let preguntas: Preguntas[] = Preguntas.GenerarPreguntas();
    this.preguntaStr = preguntas[this.nivel].pregunta;
    this.obtenerImagen(preguntas[this.nivel].idImagen);

    for(let i = 0; i<4; i++){
      this.respuestas[i].respuesta = preguntas[this.nivel].respuestas[i];
      this.respuestas[i].clase = 'btn-primary'
    }

    this.idRespuestaCorrecta = preguntas[this.nivel].indexRespuesta;

    this.usersService.addGameResult(this.getScore(), 'TriviaCrack');
  }

  getScore() : Score{
    return { 
      date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
      score : this.puntaje
    }
  }

  public obtenerImagen(idImagen: number){
    return this.imgPreguntasService.ObtenerFoto(idImagen)
    .subscribe(
      foto => {
        this.preguntaImg = JSON.parse(JSON.stringify(foto)).src.original;
      }
    )
  }

  public Responder(idRespuesta: number){
    if (idRespuesta !== this.idRespuestaCorrecta){
      this.respuestas[idRespuesta].clase = 'btn-danger';
      this.gameOver();
    }
    else{
      this.SumarPuntaje();
      this.nivelSuperado = true;
    }

    this.botonesDeshabilitados = true;
    this.respuestas[this.idRespuestaCorrecta].clase = 'btn-success';
  }

    public gameOver(){
    //Subir puntaje;
    this.nivelPerdido = true;
  }

  private SumarPuntaje(){
    this.puntaje += this.nivel;

    console.log("nivel "+this.nivel);
    console.log("puntaje "+this.puntaje);
  }
}
