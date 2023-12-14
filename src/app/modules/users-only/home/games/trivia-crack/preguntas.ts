export class Preguntas {
    public pregunta!: string;
    public respuestas!: string[];
    public idImagen!: number;
    public indexRespuesta!: number;
  
  
    public static GenerarPreguntas() : Preguntas[]{
      return [
        {pregunta:'¿En qué ciudad argentina se encuentra este monumento?', respuestas:['Rosario','Buenos Aires','Córdoba','Luján'], idImagen:10908605, indexRespuesta: 1},
        {pregunta:'¿En dónde están ubicadas las pirámides de Chichén Itzá?', respuestas:['Perú','Colombia','Egipto','México'], idImagen:3591074, indexRespuesta: 3},
        {pregunta:'¿En qué provincia se encuentra el "Cerro de los Siete Colores"?', respuestas:['Jujuy','Salta','San Juan','La Rioja'], idImagen:4161812, indexRespuesta: 0},
        {pregunta:'El Central Park, ¿en qué ciudad está ubicado?', respuestas:['Los Angeles','Chicago','New York','Washington D.C.'], idImagen:11317199, indexRespuesta: 2},
        {pregunta:'¿Cómo se llama el edificio más alto del mundo?', respuestas:['Goldin Finance 117','Lotte World Tower','Torre de Shangái','Burj Khalifa'], idImagen:162031, indexRespuesta: 3},
        {pregunta:'¿Cuál es la selva más grande del mundo?', respuestas:['Amazonas','Selva del Congo','Reserva Natural Bosawás','Selva tropical de Daintree'], idImagen:5326231, indexRespuesta: 0},
      ]
    }
  
  }