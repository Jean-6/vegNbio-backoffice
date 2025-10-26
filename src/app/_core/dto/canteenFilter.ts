



export interface CanteenFilter {
  name?: string ;
  address?: string ;
  services?: string[] ;
  seats?: number ;
  startOpeningHour?: Date;
  endOpeningHour?: Date;
  restorer?: string ;
  status?: string ; //Actif - Ferme temporairement - Supprime
}
