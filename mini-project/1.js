// Données d'entrée
let Taxis = [ 
  { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 }, 
  { id: 4, position: 4, available: true, timeRemaining: 0, totalRides: 0 }, 
  { id: 3, position: 14, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 5, position: 21, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 2, position: 1, available: true, timeRemaining: 0, totalRides: 0 } 
];

let Requests = [ 
  { reqId: 1, position: 10, duration: 3, time: 0 }, 
  { reqId: 2, position: 3, duration: 4, time: 1 }, 
  { reqId: 3, position: 18, duration: 2, time: 2 }, 
  { reqId: 5, position: 4, duration: 6, time: 3 },
  { reqId: 4, position: 7, duration: 5, time: 5 },
  { reqId: 6, position: 1, duration: 8, time: 5 }
];

let WaitingQueue = [];
let currentTime = 0;

// Trouver le taxi le plus proche disponible
function taxiLePlusProch(demande) {
  let minDistance = Infinity;
  let selectedTaxi = null;

  for (let taxi of Taxis) {
    if (taxi.available) {
      let distance = Math.abs(taxi.position - demande.position);
      if (distance < minDistance) {
        minDistance = distance;
        selectedTaxi = taxi;
      }
    }
  }
  return { taxi: selectedTaxi, distance: minDistance };
}
// Assigner un taxi à une demande
function dureetrajet(request) {
  let result = taxiLePlusProch(request);
  let taxi = result.taxi;

  if (taxi) {
    taxi.available = false;
    taxi.totalRides++;
    taxi.timeRemaining = request.duration;
    taxi.position = request.position;
    console.log(`Minute ${currentTime} -> Request ${request.reqId} at position ${request.position} : Taxi ${taxi.id} assigned (distance: ${result.distance})`);
  } else {
    WaitingQueue.push(request);
  }
}

// Libérer automatiquement les taxis
function Libererletaxi() {
  for (let taxi of Taxis) {
    if (!taxi.available && taxi.timeRemaining > 0) {
      taxi.timeRemaining--;
      if (taxi.timeRemaining === 0) {
        taxi.available = true;
        console.log(`Minute ${currentTime} -> Taxi ${taxi.id} finished ride at position ${taxi.position}`);
        if (WaitingQueue.length > 0) {
          let demande = WaitingQueue.shift();
          dureetrajet(demande);
        }
      }
    }
  }
}
// Simulation minute par minute
function Simulation() {
   while (Requests.length > 0 || WaitingQueue.length > 0 || Taxis.some(t => !t.available)) {
    let nouvellesRequetes = Requests.filter(r => r.time === currentTime);
    for (let req of nouvellesRequetes) {
      dureetrajet(req);
    }
    Requests = Requests.filter(r => r.time > currentTime);
     Libererletaxi();
    currentTime++;
  }
}
Simulation();
// Rapport final
console.log("\n--- All rides completed ---");
console.log("------- Final Report ------");
let total = 0;
for (let t of Taxis) {
  console.log(`Taxi ${t.id}: ${t.totalRides} rides, final position ${t.position}`);
  total += t.totalRides;
}
console.log("Total rides:", total);
          