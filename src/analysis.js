const { getTrips,getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
            let tripData = await getTrips()
          //collect all the drivers Id without duplicates(unique set)
          const allDriversId=[...new Set(tripData.map((item)=>item.driverID))]
          const allDrivers = {}
          const driversInfo = new Map()
          await Promise.allSettled(allDriversId.map((id) =>getDriver(id).then((res) => (allDrivers[id] = res))))


          const output ={
            noOfCashTrips: 0,
            noOfNonCashTrips: 0,
            billedTotal: 0,
            cashBilledTotal:0,
            nonCashBilledTotal: 0,
            noOfDriversWithMoreThanOneVehicle: 0,
            mostTripsByDriver: {
              name: "",
              email: "",
              phone: "",
              noOfTrips: 0,
              totalAmountEarned: 0
            },
            highestEarningDriver: {
              name: "",
              email: "",
              phone: "",
              noOfTrips: 0,
              totalAmountEarned: 0
            }
          }
          for(const trip of tripData){
            const moneyBills = Number(trip.billedAmount) || Number(trip.billedAmount.replace(",", ""))
            if(trip.isCash===true){
              output.noOfCashTrips++
              output.cashBilledTotal += moneyBills

            }
            else {
              output.noOfNonCashTrips++
              output.nonCashBilledTotal += moneyBills
            }
            output.billedTotal += moneyBills
            const driverID = trip.driverID
            const driverDetails = driversInfo.get(driverID)
            if(driverDetails){
              driversInfo.set(driverID, {
                driverID,
                noOfTrips: driverDetails.noOfTrips + 1,
                billedTotal: driverDetails.billedTotal + moneyBills
              })
            }
            else{driversInfo.set(driverID, {
              driverID,
              noOfTrips: 1,
              billedTotal: moneyBills
            })
            }

          }
          output.billedTotal = +output.billedTotal.toFixed(2);
          output.nonCashBilledTotal = +output.nonCashBilledTotal.toFixed(2);
          const values = [...driversInfo.values()]
          const driverWithMostTrips = values.sort((a, b) => b.noOfTrips - a.noOfTrips)[0];
          const driverWithMostEarnings = values.sort((a, b) => b.billedTotal - a.billedTotal)[0];
          // Calculate no of drivers with more than one vehicles
          for (const id in allDrivers) {
              if (allDrivers[id].vehicleID.length > 1)
                  output.noOfDriversWithMoreThanOneVehicle++;
          }
          if (driverWithMostTrips.driverID in allDrivers) {
              const id = driverWithMostTrips.driverID
              output.mostTripsByDriver.name = allDrivers[id].name
              output.mostTripsByDriver.email = allDrivers[id].email
              output.mostTripsByDriver.phone = allDrivers[id].phone
              output.mostTripsByDriver.noOfTrips = driverWithMostTrips.noOfTrips
              output.mostTripsByDriver.totalAmountEarned = +driverWithMostTrips.billedTotal
          }
          if (driverWithMostEarnings.driverID in allDrivers) {
              const id = driverWithMostEarnings.driverID
              output.highestEarningDriver.name = allDrivers[id].name
              output.highestEarningDriver.email = allDrivers[id].email
              output.highestEarningDriver.phone = allDrivers[id].phone
              output.highestEarningDriver.noOfTrips = driverWithMostEarnings.noOfTrips
              output.highestEarningDriver.totalAmountEarned = +driverWithMostEarnings.billedTotal
          }
          
          return output;
          }

          module.exports = analysis;
          analysis()