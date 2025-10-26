


export interface TableReservation{

}




export interface eventReservation{

}




export interface roomReservation{

}





export class ReservationFilter {

  id?: string ;
  name?: string ;
  canteenName?: string ;
  startDate?: Date ;
  endDate?: Date ;
  date?: string ;
  hour?: string ;
  type?: string ;
  seats?: number ;
  status?: string ; // Pending - confirmed - cancelled -  finished
}

