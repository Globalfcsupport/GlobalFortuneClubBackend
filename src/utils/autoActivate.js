const httpStatus = require("http-status");
const {
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
  AdminWallet,
} = require("../models/payment.history");
const { Setting } = require("../models/admin.model");
const User = require("../models/users.model");
const { RefferalIncome } = require("../models/refIncome.model");

const AutoActivateSlot = async () => {
  // let startedUsers = await User.find({ started: true });
  // let settings = await Setting.findOne().sort({createdAt:-1})
  // if (startedUsers.length > 0) {
  //   for (let index = 0; index < startedUsers.length; index++) {
  //     const element = startedUsers[index];
  //     let findActivated = await Slot.findOne({userId:element._id, status:"Activated"})
  //     if(!findActivated){
  //       let LatestActivatedSlotByUSer = await Slot.findOne({userId:element._id}).sort({createdAt:-1})
  //       if(LatestActivatedSlotByUSer){
  //         // find whether the recent slot has fulfilled the spacer 
  //         let findSlot = await Slot.find({createdAt:{$gt:LatestActivatedSlotByUSer.createdAt}});
  //         let spacerFullFIll = findSlot.length >=settings.Sapcer
  //         let reserveMyWallet = element.reserveMywallet;
  //         let mywallet = element.myWallet
  //         let crowdStock = element.crowdStock
  //         console.log(element.myWallet,"kokoko");
  //         let totalwalletAndCrowdStock = mywallet + crowdStock
  //         console.log(mywallet,"lklk");
  //         console.log(spacerFullFIll,totalwalletAndCrowdStock >= reserveMyWallet+100, "Check sapcer" );
  //         if(spacerFullFIll && totalwalletAndCrowdStock >= reserveMyWallet+100 ){
  //           if(crowdStock >=90 && mywallet >=10){
  //             element.crowdStock = element.crowdStock - crowdStock;
  //             element.myWallet = element.myWallet - mywallet;
  //             element.save()
  //             console.log(element, "IF Ele");
  //             let adminWallet = await AdminYield.findOne().sort({createdAt:-1});
  //             let adminYield = adminWallet.Yield ?adminWallet.Yield:0;
  //             let Yields = adminYield + 100;
  //             let totalActivatedSlotCount = await Yield.find({status:"Activated"}).countDocuments();
  //             let totalActivatedSlot = await Yield.find({status:"Activated"});
  //             let splitYields = Yields / totalActivatedSlotCount;
            
  //               let slotcreate = await Slot.create({status:"Activated", userId:element._id,refId:element.refId })
  //               await Yield.create({status:"Activated", userId:element._id,refId:element.refId, slotId:slotcreate._id,totalYield:200,currentYield:0,crowdStock:0,wallet:0 })
  //               let findUserbyId = await User.findById(slotcreate.userId);
  //               let findReferenc = await User.findOne({refId:findUserbyId.uplineId});
  //               let PlatformFee = (100 * refCommision) / 100;
  //               findReferenc = await User.findOneAndUpdate({_id:findReferenc._id}, {$inc:{adminWallet:PlatformFee}}, {new:true});
  //               RefferalIncome.create({userId:findReferenc._id, amount:PlatformFee})
  //               adminWallet.Yield = 0;
  //               adminWallet.save();
        
  //             for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
  //               const splittedYield = splitYields / 2;
  //               let slot = totalActivatedSlot[slots];
  //               slot.currentYield = slot.currentYield + splitYields;
  //               slot.crowdStock = slot.crowdStock + splittedYield;
  //               slot.wallet = slot.wallet + splittedYield;
  //               await Yeild_history.create({userId:slot.userId, slotId:slot.slotId, currentYield:splitYields});
  //               slot.save();
  //               if(slot.currentYield > 200){
  //                 slot.currentYield = 200;
  //                 slot.crowdStock = 100;
  //                 slot.wallet = 200;
  //                 slot.status = "Completed";
  //                 await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
  //                 let PlatformFee = (200 * settings.platFormFee) / 100;
  //                let oioi =  await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
  //                console.log(oioi, "updates admin");
  //                 slot.save();
  //                 let rem = slot.currentYield - 200;
  //                 await Yeild_history.create({slotId:slot.slotId, userId:slot.userId,currentYield: -rem });
  //                 let findLatestLOV = await AdminYield.findOne().sort({createdAt:-1})
  //                 if(findLatestLOV){
  //                   findLatestLOV = await AdminYield.findByIdAndUpdate({_id:findLatestLOV._id}, {$inc:{Yield:rem}},{new:true});
  //                 }
  //               }else if(slot.currentYield == 200){
  //                 slot.status = "Completed";
  //                 await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
  //                 let PlatformFee = (200 * settings.platFormFee) / 100;
  //                let LPLP =  await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
  //                console.log(LPLP,"UPDARE");
  //               }
  //             }
  //           }else{
  //               let totalCrowdStock = 100 - crowdStock;
  //               console.log(totalCrowdStock, "Total Crowd Stack Else");
  //               element.crowdStock = 0;
  //               element.myWallet = element.myWallet - totalCrowdStock;
  //               element.save()
                
  //               let adminWallet = await AdminYield.findOne().sort({createdAt:-1});
  //               let adminYield = adminWallet.Yield ?adminWallet.Yield:0;
  //               let Yields = adminYield + 100;
  //               let totalActivatedSlotCount = await Yield.find({status:"Activated"}).countDocuments();
  //               let totalActivatedSlot = await Yield.find({status:"Activated"});
  //               let splitYields = Yields / totalActivatedSlotCount;
  //               let slotcreate = await Slot.create({status:"Activated", userId:element._id,refId:element.refId });
  //               let settingFind = await Setting.findOne().sort({createdAt:-1});
  //               let findUserbyId = await User.findById(slotcreate.userId);
  //               let refCommision = settingFind.ReferalCommisionSlot;
  //               let findReference = await User.findOne({refId:findUserbyId.uplineId});
  //               let PlatformFee = (100 * refCommision) / 100;
                
  //               findReference = await User.findOneAndUpdate({_id:findReference._id}, {$inc:{adminWallet:PlatformFee}}, {new:true});
  //               RefferalIncome.create({userId:findReference._id, amount:PlatformFee})
  //               await Yield.create({status:"Activated", userId:element._id,refId:element.refId, slotId:slotcreate._id,totalYield:200,currentYield:0,crowdStock:0,wallet:0 })
  //               adminWallet.Yield = 0;
  //               adminWallet.save();
  //               for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
  //                 const splittedYield = splitYields / 2;
  //                 let slot = totalActivatedSlot[slots];
  //                 slot.currentYield = slot.currentYield + splitYields;
  //                 slot.crowdStock = slot.crowdStock + splittedYield;
  //                 slot.wallet = slot.wallet + splittedYield;
  //                 await Yeild_history.create({userId:slot.userId, slotId:slot.slotId, currentYield:splitYields});
  //                 slot.save();
  //                 if(slot.currentYield > 200){
  //                   slot.currentYield = 200;
  //                   slot.crowdStock = 100;
  //                   slot.wallet = 200;
  //                   slot.status = "Completed";
  //                   await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
  //                   let PlatformFee = (200 * settings.platFormFee) / 100;
  //                   let elup = await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
  //                   console.log(elup, "else update IF");
  //                   slot.save();
  //                   let rem = slot.currentYield - 200;
  //                   await Yeild_history.create({slotId:slot.slotId, userId:slot.userId,currentYield: -rem });
  //                   let findLatestLOV = await AdminYield.findOne().sort({createdAt:-1})
  //                   if(findLatestLOV){
  //                     findLatestLOV = await AdminYield.findByIdAndUpdate({_id:findLatestLOV._id}, {$inc:{Yield:rem}},{new:true});
  //                   }
  //                 }else if(slot.currentYield == 200){
  //                   slot.status = "Completed";
  //                   await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
  //                   let PlatformFee = (200 * settings.platFormFee) / 100;
  //                  let PLPL =  await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
  //                  console.log(PLPL, "PLPLPLPLPLPL Else Else");
  //                 }
  //               }
              
              
  //           }
  //         }
  //       }
  //     }else{
  //       console.log("Already Slot In Activated");
  //     }
  //   }
  // }


  // BULK WRITE CODE

  let startedUsers = await User.find({ started: true });
  let settings = await Setting.findOne().sort({ createdAt: -1 });

  if (startedUsers.length > 0) {
    for (let index = 0; index < startedUsers.length; index++) {
      const element = startedUsers[index];
      let findActivated = await Slot.findOne({ userId: element._id, status: "Activated" });

      if (!findActivated) {
        let LatestActivatedSlotByUser = await Slot.findOne({ userId: element._id }).sort({ createdAt: -1 });
        if (LatestActivatedSlotByUser) {
          let findSlot = await Slot.find({ createdAt: { $gt: LatestActivatedSlotByUser.createdAt } });
          let spacerFullFill = findSlot.length >= settings.Sapcer;
          let reserveMyWallet = element.reserveMywallet;
          let mywallet = element.myWallet;
          let crowdStock = element.crowdStock;
          let totalwalletAndCrowdStock = mywallet + crowdStock;

          if (spacerFullFill && totalwalletAndCrowdStock >= reserveMyWallet + 100) {
            let bulkOps = [];
            if (crowdStock >= 90 && mywallet >= 10) {
              element.crowdStock = element.crowdStock - crowdStock;
              element.myWallet = element.myWallet - mywallet;
              bulkOps.push({
                updateOne: {
                  filter: { _id: element._id },
                  update: { crowdStock: element.crowdStock, myWallet: element.myWallet }
                }
              });

              let adminWallet = await AdminYield.findOne().sort({ createdAt: -1 });
              let adminYield = adminWallet.Yield ? adminWallet.Yield : 0;
              let Yields = adminYield + 100;
              let totalActivatedSlotCount = await Yield.find({ status: "Activated" }).countDocuments();
              let totalActivatedSlot = await Yield.find({ status: "Activated" });
              let splitYields = Yields / totalActivatedSlotCount;

              let slotCreate = await Slot.create({ status: "Activated", userId: element._id, refId: element.refId });
              await Yield.create({
                status: "Activated",
                userId: element._id,
                refId: element.refId,
                slotId: slotCreate._id,
                totalYield: 200,
                currentYield: 0,
                crowdStock: 0,
                wallet: 0
              });

              let findUserById = await User.findById(slotCreate.userId);
              let findReference = await User.findOne({ refId: findUserById.uplineId });
              let PlatformFee = (100 * settings.ReferalCommisionSlot) / 100;

              findReference = await User.findOneAndUpdate(
                { _id: findReference._id },
                { $inc: { adminWallet: PlatformFee } },
                { new: true }
              );
              ReferralIncome.create({ userId: findReference._id, amount: PlatformFee });
              bulkOps.push({
                updateOne: {
                  filter: { _id: adminWallet._id },
                  update: { Yield: 0 }
                }
              });

              for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
                const splittedYield = splitYields / 2;
                let slot = totalActivatedSlot[slots];
                slot.currentYield = slot.currentYield + splitYields;
                slot.crowdStock = slot.crowdStock + splittedYield;
                slot.wallet = slot.wallet + splittedYield;

                bulkOps.push({
                  updateOne: {
                    filter: { _id: slot._id },
                    update: {
                      currentYield: slot.currentYield,
                      crowdStock: slot.crowdStock,
                      wallet: slot.wallet
                    }
                  }
                });

                await YieldHistory.create({
                  userId: slot.userId,
                  slotId: slot.slotId,
                  currentYield: splitYields
                });

                if (slot.currentYield > 200) {
                  slot.currentYield = 200;
                  slot.crowdStock = 100;
                  slot.wallet = 200;
                  slot.status = "Completed";

                  bulkOps.push({
                    updateOne: {
                      filter: { _id: slot._id },
                      update: { status: "Completed" }
                    }
                  });

                  let PlatformFee = (200 * settings.platFormFee) / 100;
                  await AdminWallet.create({ slotId: slot.slotId, adminWallet: PlatformFee });

                  let rem = slot.currentYield - 200;
                  await YieldHistory.create({
                    slotId: slot.slotId,
                    userId: slot.userId,
                    currentYield: -rem
                  });

                  let findLatestLOV = await AdminYield.findOne().sort({ createdAt: -1 });
                  if (findLatestLOV) {
                    bulkOps.push({
                      updateOne: {
                        filter: { _id: findLatestLOV._id },
                        update: { $inc: { Yield: rem } }
                      }
                    });
                  }
                } else if (slot.currentYield === 200) {
                  slot.status = "Completed";
                  bulkOps.push({
                    updateOne: {
                      filter: { _id: slot._id },
                      update: { status: "Completed" }
                    }
                  });

                  let PlatformFee = (200 * settings.platFormFee) / 100;
                  await AdminWallet.create({ slotId: slot.slotId, adminWallet: PlatformFee });
                }
              }
            } else {
              let totalCrowdStock = 100 - crowdStock;
              element.crowdStock = 0;
              element.myWallet = element.myWallet - totalCrowdStock;
              bulkOps.push({
                updateOne: {
                  filter: { _id: element._id },
                  update: { crowdStock: element.crowdStock, myWallet: element.myWallet }
                }
              });

              let adminWallet = await AdminYield.findOne().sort({ createdAt: -1 });
              let adminYield = adminWallet.Yield ? adminWallet.Yield : 0;
              let Yields = adminYield + 100;
              let totalActivatedSlotCount = await Yield.find({ status: "Activated" }).countDocuments();
              let totalActivatedSlot = await Yield.find({ status: "Activated" });
              let splitYields = Yields / totalActivatedSlotCount;

              let slotCreate = await Slot.create({ status: "Activated", userId: element._id, refId: element.refId });
              let settingFind = await Setting.findOne().sort({ createdAt: -1 });
              let findUserById = await User.findById(slotCreate.userId);
              let refCommision = settingFind.ReferalCommisionSlot;
              let findReference = await User.findOne({ refId: findUserById.uplineId });
              let PlatformFee = (100 * refCommision) / 100;

              findReference = await User.findOneAndUpdate(
                { _id: findReference._id },
                { $inc: { adminWallet: PlatformFee } },
                { new: true }
              );
              ReferralIncome.create({ userId: findReference._id, amount: PlatformFee });
              await Yield.create({
                status: "Activated",
                userId: element._id,
                refId: element.refId,
                slotId: slotCreate._id,
                totalYield: 200,
                currentYield: 0,
                crowdStock: 0,
                wallet: 0
              });
              bulkOps.push({
                updateOne: {
                  filter: { _id: adminWallet._id },
                  update: { Yield: 0 }
                }
              });

              for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
                const splittedYield = splitYields / 2;
                let slot = totalActivatedSlot[slots];
                slot.currentYield = slot.currentYield + splitYields;
                slot.crowdStock = slot.crowdStock + splittedYield;
                slot.wallet = slot.wallet + splittedYield;

                bulkOps.push({
                  updateOne: {
                    filter: { _id: slot._id },
                    update: {
                      currentYield: slot.currentYield,
                      crowdStock: slot.crowdStock,
                      wallet: slot.wallet
                    }
                  }
                });

                await YieldHistory.create({
                  userId: slot.userId,
                  slotId: slot.slotId,
                  currentYield: splitYields
                });

                if (slot.currentYield > 200) {
                  slot.currentYield = 200;
                  slot.crowdStock = 100;
                  slot.wallet = 200;
                  slot.status = "Completed";

                  bulkOps.push({
                    updateOne: {
                      filter: { _id: slot._id },
                      update: { status: "Completed" }
                    }
                  });

                  let PlatformFee = (200 * settings.platFormFee) / 100;
                  await AdminWallet.create({ slotId: slot.slotId, adminWallet: PlatformFee });

                  let rem = slot.currentYield - 200;
                  await YieldHistory.create({
                    slotId: slot.slotId,
                    userId: slot.userId,
                    currentYield: -rem
                  });

                  let findLatestLOV = await AdminYield.findOne().sort({ createdAt: -1 });
                  if (findLatestLOV) {
                    bulkOps.push({
                      updateOne: {
                        filter: { _id: findLatestLOV._id },
                        update: { $inc: { Yield: rem } }
                      }
                    });
                  }
                } else if (slot.currentYield === 200) {
                  slot.status = "Completed";
                  bulkOps.push({
                    updateOne: {
                      filter: { _id: slot._id },
                      update: { status: "Completed" }
                    }
                  });

                  let PlatformFee = (200 * settings.platFormFee) / 100;
                  await AdminWallet.create({ slotId: slot.slotId, adminWallet: PlatformFee });
                }
              }
            }

            if (bulkOps.length > 0) {
              await User.bulkWrite(bulkOps);
            }
          }
        }
      } else {
        console.log("Already Slot In Activated");
      }
    }
  }

};


module.exports = {
  AutoActivateSlot,
};
