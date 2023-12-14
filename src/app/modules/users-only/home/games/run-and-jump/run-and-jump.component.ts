import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { HolDefeatDialogComponent } from '../high-or-low/hol-defeat-dialog/hol-defeat-dialog.component';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/users.service';
import { Score } from 'src/app/Entities/game-score';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-run-and-jump',
  templateUrl: './run-and-jump.component.html',
  styleUrls: ['./run-and-jump.component.css']
})
export class RunAndJumpComponent {

  // @ViewChild('character') character!: ElementRef;
  // @ViewChild('block') block!: ElementRef;

  // animate = false;
  // counter = 0;
  // score = 0;
  // // character : any;
  // // block : any;
  // checkDead : any;
  
  // constructor(public defeatDialog : MatDialog, private _router : Router, private usersService : AuthService, private datePipe : DatePipe) {  }

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key == ' '){
  //     this.jump();
  //   }
  // }

  // jump(){
  //   if(this.animate){return}
  //   this.animate = true;
  //   setTimeout(()=>{
  //     this.animate = false;
  //   },300);
  // }  

  // ngOnInit(): void {    
  // }

  // ngAfterViewInit(){
  //   this.initializeGame();
  // }

  // initializeGame(){
  //   this.checkDead = setInterval(() => this.checkDeadFunc(), 10);
  // }

  // checkDeadFunc(){
  //     if(this.characterCollidedWithBlock()){
  //       clearInterval(this.checkDead);
  //       this.block.nativeElement.style.animation = "none";
  //       this.usersService.addGameResult(this.getScore(), 'RunAndJump');
  //       this.openDefeatDialog({data : { score : this.score}});
  //     }else{
  //         this.counter++;
  //         this.score = Math.floor(this.counter/10);
  //     }
  // }

  // characterCollidedWithBlock() : boolean {
  //   let characterTop = this.character.nativeElement.offsetTop;
  //   let characterLeft = this.character.nativeElement.offsetLeft;
  //   let blockLeft = this.block.nativeElement.offsetLeft;
  //   return (blockLeft>= characterLeft-5) && (blockLeft<= characterLeft+42) && characterTop>316
  // }

  // async openDefeatDialog(data : {data :{ score : number}}){
  //   let dialogRef = this.defeatDialog.open(HolDefeatDialogComponent, data);
  //   let playAgain = await lastValueFrom(dialogRef.afterClosed());
  //   if(playAgain == "true"){
  //     this.reset();
  //   } else {
  //     this._router.navigateByUrl('/users/home');
  //   }
  // }

  // reset(){
  //   this.counter = 0;
  //   this.block.nativeElement.style.animation = "block 1.5s infinite linear";
  //   this.initializeGame();
  // }

  // getScore() : Score{
  //   return { 
  //     date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
  //     score : this.score
  //   }
  // }

  // ngOnDestroy() {
  //   clearInterval(this.checkDead);
  // }

  public finaliza: boolean = false;
  public comenzado: boolean = false;
  public esCumplido: boolean = false;
  public esIncorrecta: boolean = true;
  public juegoIniciado: boolean = false;
  public palabraCorrecta: string = '';
  public palabraIngresada: string = '';
  public cronometro: number = 0;
  public tiempoInicio: number = 0;
  public tiempoCumplido: number = 0;
  public tiempoTranscurrido: number = 0;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private palabraIngresadaChanged: Subject<string> = new Subject<string>();
  private cronometroSubscription: Subscription | undefined;
  public btnComenzar: string = 'Comenzar';
  public palabraOpciones: string[] = [
    'embarazada',
    'mecanizado',
    'zambullido',
    'compañeros',
    'reproduzco',
    'justifique',
    'formalizar',
    'desconozca',
    'comenzando',
    'acompañado',
  ];
  score = 0;

  constructor(private usersService : AuthService, private datePipe : DatePipe) {
    this.palabraIngresadaChanged.subscribe(() => {
      this.nuevaLetra();
    });
  }

  comenzar() {
    this.btnComenzar = 'Reiniciar';
    this.comenzado = true;
    this.palabraCorrecta = this.palabraOpciones[Math.floor(Math.random() * 10)];
    this.palabraIngresada = '';
    this.juegoIniciado = false;
    this.finaliza = false;
    this.cronometro = 0;
    this.detenerCronometro();
  }

  iniciarJuego() {
    this.juegoIniciado = true;
    this.esIncorrecta = true;
    this.cronometro = 0;
    this.iniciarCronometro();
  }

  terminarJuego() {
    console.log('terminar juego');
    this.juegoIniciado = false;
    this.comenzado = false;
    this.finaliza = true;
    this.tiempoCumplidoFunction(500);
    this.detenerCronometro();
  }

  nuevaLetra() {
    console.log(this.palabraIngresada);
    if (!this.juegoIniciado) {
      this.iniciarJuego();
    } else {
      if (this.palabrasIguales() == true) {
        this.terminarJuego();
      }
    }
  }

  iniciarCronometro() {
    console.log('Iniciar cronometro');
    this.cronometroSubscription = interval(1)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.cronometro++;
      });
  }

  detenerCronometro() {
    console.log('Detener cronometro');
    if (this.cronometroSubscription) {
      this.cronometroSubscription.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  palabrasIguales() {
    if (
      this.palabraIngresada.toLowerCase() === this.palabraCorrecta.toLowerCase()
    ) {
      console.log('palabras iguales');
      this.esIncorrecta = false;
      return true;
    } else {
      return false;
    }
  }

  onInputChange() {
    setTimeout(() => {
      console.log(this.palabraIngresada);
      this.palabraIngresadaChanged.next(this.palabraIngresada);
    });
  }

  tiempoCumplidoFunction(tiempoACumplir: number) {
    this.tiempoCumplido = this.cronometro;
    if (this.cronometro < tiempoACumplir) {
      console.log('Cumplio el tiempo');
      this.esCumplido = true;
      this.score++;
    }
    this.usersService.addGameResult(this.getScore(), 'RunAndJump');
  }

  getScore() : Score{
      return { 
        date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
        score : this.score
      }
    }

}
