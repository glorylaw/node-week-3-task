const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  const report=[]
  const trips = await getTrips()
  //get drivers id
  const ids=[...new Set(trips.map((item =>{return item.driverID})))]
  for (let i= 0; i<ids.length;i++){
    let driverID =ids[i]
    try{
      let driverObject = await getDriver(driverID)
      if(driverObject){
        let tripData= await getTripData(driverID,trips)
        let vehicleData = await getVehicles(driverObject.vehicleID)
        
        //create a result object.
        const resultObj = {
          fullName: driverObject.name,
          id: driverID,
          phone: driverObject.phone,
          noOfTrips:tripData.noOfTrips,
          noOfVehicles: vehicleData.length,
          vehicles: vehicleData,
          noOfCashTrips: tripData.noOfCashTrips,
          noOfNonCashTrips: tripData.noOfNonCashTrips,
          totalAmountEarned: tripData.totalAmountEarned.toFixed(2),
          totalCashAmount: tripData.totalCashAmount.toFixed(2),
          totalNonCashAmount: tripData.totalNonCashAmountl.toFixed(2),
          trips: tripData.trips,
      

        }
        report.push(resultObj)
      }
    }catch(err){
      console.log(err.message)
    }

  }
  return report
}
//acquire the information of the trips by defining a function
async function getTripData(driverID,trips){
  let dataTripObj = {
    noOfTrips: 0,
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    totalAmountEarned: 0,
    totalCashAmount: 0,
    totalNonCashAmount: 0,
    trips: [],
  }
for(let i=0 ;i<trips.length;i++){
  let tripElement=trips[i]
  let billValueString = tripElement.billedAmount
  if(typeof billValueString === "string" && billValueString.includes(",")){
    billValueString =billValueString.split(",").join("")
  }else{
    billValueString =billValueString
  }
  const billValueNum = parseFloat(billValueString)
  let cashTripData ={
    user: tripElement.user,
    created: tripElement.created,
    pickup: tripElement.pickup.address,
    destination: tripElement.destination.address,
    billed: billValueNum,
    isCash: true,
  }
  if(tripElement.driverID === driverID){
    dataTripObj.noOfTrips +=1
    if (tripElement.isCash ===true){
      dataTripObj.noOfCashTrips +=1
      dataTripObj.totalCashAmount += billValueNum
    }
    if (tripElement.isCash ===false){
      dataTripObj.noOfNonCashTrips +=1
      dataTripObj.totalNonCashAmount += billValueNum
    }
    dataTripObj.trips.push(cashTripData)
  }
}
return  dataTripObj
}
// get vehicleIDs
async function getVehicles(vehicleIDs) {
  let vehicleData = [
    {
      plate: '',
      manufacturer: '',
    },
  ]
  for (let i = 0; i < vehicleIDs.length; i++) {
    try {
      let vehicleItem = await getVehicle(vehicleIDs[i])
      let vehicleObj = {
        plate: '',
        manufacturer: '',
      }
      vehicleObj.plate = vehicleItem.plate
      vehicleObj.manufacturer = vehicleItem.manufacturer
      vehicleData.push(vehicleObj)
    } catch (err) {
      console.log(err.message)
    }
  }
  return vehicleData
}
module.exports = driverReport;
