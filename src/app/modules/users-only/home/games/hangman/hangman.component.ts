import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HangmanService } from './services/hangman.service';
import { Score } from 'src/app/Entities/game-score';
import { DatePipe, DOCUMENT } from '@angular/common'
import { AuthService } from 'src/app/services/users.service';



const MIN_WORD_LENGTH = 3;

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss'],
})

export class HangmanComponent implements OnInit {
  // question: string = '';
  // questions: string[] = [];
  // guesses: string[] = [];
  // category: string = '';
  // restartGameBtnShown = false;

  // constructor(
  //   private hangmanService: HangmanService,
  //   private location: Location
  // ) {}

  // ngOnInit(): void {
  //   let jsonPath;
  //   const url = this.location.path();
  //   if (url.includes('jsonPath')) {
  //     jsonPath = url.split('jsonPath=')[1];
  //   }
  //   this.hangmanService.getQuestions(jsonPath).subscribe((response) => {
  //     this.questions = response.items.filter((word)=>{
  //       return word.length > MIN_WORD_LENGTH;
  //     });
  //     this.category = response.category;
  //     this.pickNewQuestion();
  //   });
  // }

  // guess(letter: string) {
  //   if (!letter || this.guesses.includes(letter)) {
  //     return;
  //   }
  //   this.guesses = [...this.guesses, letter];
  // }

  // dummyClick() {
  //   const key = prompt('Enter a key') || '';
  //   this.guess(key);
  // }

  // reset() {
  //   this.guesses = [];
  //   this.pickNewQuestion();
  //   this.restartGameBtnShown = false;
  // }

  // pickNewQuestion() {
  //   const randomIndex = Math.floor(Math.random() * this.questions.length);
  //   this.question = this.questions[randomIndex];
  //   console.log(this.question);
  // }

  // onGameFinished() {
  //   this.restartGameBtnShown = true;
  // }

  public palabraSecreta: string = "";
  public palabraSecretaOculta: string = "[HACE CLICK EN EMPEZAR]";
  public img: string = "";
  esAlertaWarning: boolean = true; // Dependiendo de tu lógica
  alertType: string = 'warning';
  public imagenIndex:number = 0;
  public btnEmpezar:string = "Empezar";
  letra: string = ''; // Propiedad para almacenar el valor del input
  arriesga: string = ''; // Propiedad para almacenar el valor del input
  displayValue: string = ''; // Propiedad para mostrar el valor del input
  public palabrasAhorcado: string[] = [
  'agua',
  'aire',
  'alma',
  'alto',
  'amor',
  'año',
  'arte',
  'boca',
  'brazo',
  'cafe',
  'cama',
  'cara',
  'casa',
  'cielo',
  'cola',
  'corazon',
  'dedo',
  'dia',
  'dios',
  'duda',
  'edad',
  'enero',
  'flor',
  'frio',
  'fuego',
  'gato',
  'gota',
  'hijo',
  'hola',
  'lago',
  'luna',
  'mano',
  'mesa',
  'miedo',
  'nieve',
  'noche',
  'nube',
  'olla',
  'olor',
  'paso'
  ];
  score = 0;

  constructor(private usersService : AuthService, private datePipe : DatePipe){

  }

  ngOnInit(){
    this.deshabilitarElemento('arriesgaInput');
    this.deshabilitarTeclado();
  }

  updateDisplayValue() {
    this.displayValue = this.letra; // Actualiza el valor a mostrar
  }

  ingresarLetra(letraIngresada: string) {
    const posiciones: number[] = [];
    let flag: boolean=false;
    this.letra = letraIngresada;

    if (this.letra=="") {
      return
    }

  for (let i = 0; i < this.palabraSecreta.length; i++) {
    if (this.palabraSecreta[i].toLowerCase() === this.letra.toLowerCase()) {
      posiciones.push(i + 1); // Agrega la posición (empezando desde 1)
      this.letraCorrecta(posiciones);
      flag = true;
    }
  }
  if (!flag) {
    this.letraIncorrecta();
  }

  console.log(this.palabraSecreta+"-"+posiciones.toString());

  this.letra="";
  this.deshabilitarElemento(letraIngresada);

  }

  letraCorrecta(posiciones: number[]){
  if (this.palabraSecretaOculta.length !== this.palabraSecreta.length*2) {
    console.log('Las palabras deben tener la misma longitud.'+(this.palabraSecretaOculta+this.palabraSecretaOculta.length+this.palabraSecreta+this.palabraSecreta.length).toString());
  }

  const letrasPalabraSecreta = this.palabraSecreta.split('');

  for (const posicion of posiciones) {
    if (posicion > 0 && posicion <= this.palabraSecretaOculta.length) {
      const nuevaPosicion = posicion * 2;
      this.palabraSecretaOculta = this.palabraSecretaOculta.substring(0, nuevaPosicion - 1) + letrasPalabraSecreta[posicion - 1] + this.palabraSecretaOculta.substring(nuevaPosicion);
    }
  }
  if(!this.tieneGuionBajo(this.palabraSecretaOculta)){
    console.log("gano");
    this.score++;
    this.finalizar();
  }


  }

  getScore() : Score{
    return { 
      date : this.datePipe.transform(Date.now(),'dd-MM-yyyy'), 
      score : this.score
    }
  }

  tieneGuionBajo(palabra: string): boolean {
    return palabra.includes('_');
  }

  redondearNumero(numero: number): number {
    return Math.floor(numero + 0.5); // Redondear hacia arriba si tiene 0.5 o más
  }

  letraIncorrecta() {
    const maxIndex = 3; // Número máximo de imágenes - 1

  // Incrementa el índice y asegúrate de que no supere el máximo
  this.imagenIndex = (this.imagenIndex + 0.5) % (maxIndex + 1);

  let imagenIndexRedondeado = this.redondearNumero(this.imagenIndex);

  // Crea la ruta de la imagen en base al índice actual
  const rutaImagen = `../../../../../assets/images/images/ahorcado-${imagenIndexRedondeado}.png`;

  console.log(rutaImagen);

  // Actualiza la imagen
  this.img = rutaImagen;

  if(imagenIndexRedondeado==maxIndex) {
    this.finalizar();
    this.perdio();
    }
  }

  arriesgarPalabra(){
    
    if (this.arriesga=="") {
      return
    }
    if (this.palabraSecreta.toLowerCase() != this.arriesga.toLowerCase()) {
      this.perdio();
    }
    else{
      this.score++;
    }
    this.finalizar();

    
    this.arriesga = "";

  }
  perdio(){
    this.alertType = "danger";
    this.img = "../../../../../assets/images/images/ahorcado-3.png";
    this.esAlertaWarning = false;
  }

  empezar(){
    this.img = "../../../../../assets/images/images/ahorcado-0.png";
    this.alertType="warning";
    this.imagenIndex = 0;
    this.palabraSecreta = this.obtenerPalabraAleatoria();
    this.palabraSecretaOculta = this.ocultarPalabra(this.palabraSecreta);
    this.btnEmpezar = "Reiniciar";
    this.habilitarElemento('arriesgaInput');

    this.habilitarTeclado();
  }

  finalizar(){
    this.palabraSecretaOculta = this.palabraSecreta;
    this.alertType = "success";

    this.deshabilitarElemento('arriesgaInput');
    this.deshabilitarTeclado();

    this.usersService.addGameResult(this.getScore(), 'Hangman');


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

  ocultarPalabra(palabra: string): string {
    return ' _'.repeat(palabra.length);
}

  obtenerPalabraAleatoria(): string {
    const indiceAleatorio = Math.floor(Math.random() * this.palabrasAhorcado.length);
    return this.palabrasAhorcado[indiceAleatorio];
}

onInputChange(event: any) {
  this.letra = event.target.value; // Actualiza la propiedad con el valor del input
}

deshabilitarTeclado(){
  for (let charCode = 'A'.charCodeAt(0); charCode <= 'Z'.charCodeAt(0); charCode++) {
    const letter = String.fromCharCode(charCode);
    this.deshabilitarElemento(letter.toLowerCase());
  }
  this.deshabilitarElemento('ñ');

}

  habilitarTeclado(){
    for (let charCode = 'A'.charCodeAt(0); charCode <= 'Z'.charCodeAt(0); charCode++) {
      const letter = String.fromCharCode(charCode);
      this.habilitarElemento(letter.toLowerCase());
    }
    this.habilitarElemento('ñ');
  }
  
}