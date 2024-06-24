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

const AutoActivateSlot = async () => {
  // let pendingSlots = await User.find({ role: { $ne: "admin" } });
  // let findSetting = await Setting.findOne().sort({ createdAt: -1 });
  // if(pendingSlots.length>0){
  //   for (let index = 0; index < pendingSlots.length; index++) {
  //     const element = pendingSlots[index];
  //     // console.log(element,"ELEL");
  //     let findYield = await Yield.findOne({userId:element._id}).sort({createdAt:-1});

  //     if(findYield){
  //       let findSapce = await Yield.find({createdAt:{$gt:findYield.createdAt}}).countDocuments()
  //       let findExistingActivatedSlots = await Yield.find({status: "Activated"});
  //       if(findSetting.Sapcer>=findSapce){
  //         let walletAmt = element.myWallet
  //         let crowdStockAmt = element.crowdStock
  //         if(crowdStockAmt >=90 && walletAmt >=10 ){
  //           let croudAmount = 90
  //           let wallet = 10

  //           let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });
  //           let findExistingActivatedSlotsCount = await Yield.countDocuments({status: "Activated"});
  //           if (findExistingActivatedSlotsCount > 0 && findLOY) {
  //             let splitAmount = (findLOY.Yield + 100) / findExistingActivatedSlotsCount;
  //             findLOY.Yield = 0;
  //             await findLOY.save();
  //             const splitTwo = splitAmount / 2;
  //             for (let e of findExistingActivatedSlots) {
  //               let YIELD = element.currentYield + splitAmount;
  //                console.log(YIELD, "Updated Yield");
  //                if (YIELD > 200) {
  //                 let staticAmount = 100;
  //                 let rem = YIELD - 200;
  //                 findLOY.Yield = rem.toFixed(4);
  //                 console.log(findLOY);
  //                 await findLOY.save();
  //                 e.crowdStock = staticAmount.toFixed(4);
  //                 e.currentYield = staticAmount.toFixed(4);
  //                 e.status = "Completed";
  //                 let set = await Setting.findOne().sort({createdAt:-1})
  //                 let amount = 200;
  //                 let percentage = set.platFormFee
  //                 let val = amount * (percentage / 100);
  //                 await AdminWallet.create({slotId:element.slotId, adminWallet:val})
  //                 await e.save();
  //                 console.log(e);
  //                 await Slot.findByIdAndUpdate(e.slotId, { status: "Completed" }, { new: true });
  //                 await Yeild_history.create({ userId: e.userId, slotId: e.slotId, currentYield: splitAmount.toFixed(4) });
  //                }else{
  //                 e = await Yield.findByIdAndUpdate(
  //                   e._id,
  //                   {
  //                     $inc: {
  //                       wallet: parseFloat(splitTwo.toFixed(4)),
  //                       crowdStock: parseFloat(splitTwo.toFixed(4)),
  //                       currentYield: parseFloat(splitAmount.toFixed(4)),
  //                     }
  //                   },
  //                   { new: true }
  //                 );
  //                 await User.findByIdAndUpdate({_id:e.userId}, {
  //                   $inc: {
  //                     myWallet: parseFloat(splitTwo.toFixed(4)),
  //                     crowdStock: parseFloat(splitTwo.toFixed(4)),
  //                   }
  //                 })

  //                 console.log(element,"element");

  //                 await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
  //                }
  //                if (element.currentYield >= element.totalYield) {
  //                 element.status = "Completed";
  //                 await element.save();
  //                 await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
  //               }

  //               await Slot.create({status:"Activated",userId:element._id})
  //               findUserbyId = await User.findByIdAndUpdate(
  //                 { _id: element._id },
  //                 {$inc:{myWallet:-wallet,crowdStock:- croudAmount}},
  //                 { new: true }
  //               );
  //               let createSlot = await Slot.create({ userId: element._id, status: "Activated" });
  //               console.log(createSlot, "createSlot");
  //               await Yield.create({
  //                 userId: element._id,
  //                 status: "Activated",
  //                 slotId: createSlot._id,
  //                 totalYield: 200,
  //                 currentYield: 0,
  //                 crowdStock: 0,
  //               });
  //             }
  //           }
  //         }else{
  //           let crowdTotalAmt = 100 - crowdStockAmt;
  //           let findExistingActivatedSlotsCount = await Yield.countDocuments({status: "Activated"});
  //           let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });
  //           if(crowdTotalAmt >=walletAmt ){
  //             if (findExistingActivatedSlotsCount > 0 && findLOY) {
  //               let splitAmount = (findLOY.Yield + 100) / findExistingActivatedSlotsCount;
  //               findLOY.Yield = 0;
  //               await findLOY.save();
  //               const splitTwo = splitAmount / 2;
  //               for (let e of findExistingActivatedSlots) {
  //                 let YIELD = element.currentYield + splitAmount;
  //                  console.log(YIELD, "Updated Yield");
  //                  if (YIELD > 200) {
  //                   let staticAmount = 100;
  //                   let rem = YIELD - 200;
  //                   findLOY.Yield = rem.toFixed(4);
  //                   console.log(findLOY);
  //                   let set = await Setting.findOne().sort({createdAt:-1})
  //                   let amount = 200;
  //                   let percentage = set.platFormFee
  //                   let val = amount * (percentage / 100);
  //                   await AdminWallet.create({slotId:element.slotId, adminWallet:val})
  //                   await findLOY.save();
  //                   e.crowdStock = staticAmount.toFixed(4);
  //                   e.currentYield = staticAmount.toFixed(4);
  //                   e.status = "Completed";
  //                   await e.save();
  //                   console.log(e);
  //                   await Slot.findByIdAndUpdate(e.slotId, { status: "Completed" }, { new: true });
  //                   await Yeild_history.create({ userId: e.userId, slotId: e.slotId, currentYield: splitAmount.toFixed(4) });
  //                  }else{
  //                   e = await Yield.findByIdAndUpdate(
  //                     e._id,
  //                     {
  //                       $inc: {
  //                         walletadminYield: parseFloat(splitTwo.toFixed(4)),
  //                         crowdStock: parseFloat(splitTwo.toFixed(4)),
  //                         currentYield: parseFloat(splitAmount.toFixed(4)),
  //                       }
  //                     },
  //                     { new: true }
  //                   );
  //                   await User.findByIdAndUpdate({_id:e.userId}, {
  //                     $inc: {
  //                       myWallet: parseFloat(splitTwo.toFixed(4)),
  //                       crowdStock: parseFloat(splitTwo.toFixed(4)),
  //                     }
  //                   })

  //                   console.log(element,"element-----09");

  //                   await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
  //                  }
  //                  if (element.currentYield >= element.totalYield) {
  //                   element.status = "Completed";
  //                   await element.save();
  //                   await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
  //                 }

  //                 await Slot.create({status:"Activated",userId:element._id})
  //                 findUserbyId = await User.findByIdAndUpdate(
  //                   { _id: element._id },
  //                   {$inc:{myWallet:-crowdTotalAmt,crowdStock:- crowdStockAmt}},
  //                   { new: true }
  //                 );
  //                 let createSlot = await Slot.create({ userId: element._id, status: "Activated" });
  //                 await Yield.create({
  //                   userId: element._id,
  //                   status: "Activated",
  //                   slotId: createSlot._id,
  //                   totalYield: 200,
  //                   currentYield: 0,
  //                   crowdStock: 0,
  //                 });
  //               }
  //             }
  //           }
  //         }
  //       }

  //     }

  //   }
  // }

  // Old Code

  // if (pendingSlots.length > 0) {
  //   for (let index = 0; index < pendingSlots.length; index++) {
  //     const pendingSlot = pendingSlots[index];
  //     let userId = pendingSlot.userId;
  //     let findLatestActivatedSloted = await Slot.findOne({status:"Activates"}).sort({createdAt:-1})
  //     if(findLatestActivatedSloted){
  //       let findActivatedSlot = await Slot.find({createdAt:{$gte:findLatestActivatedSloted.createdAt}})
  //     let settingForSpacer = await Setting.findOne().sort({createdAt:-1})
  //     let spacer = settingForSpacer.Sapcer
  //     if(spacer >= findActivatedSlot.length ){
  //       let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });
  //      let findExistingActivatedSlots = await Yield.find({status: "Activated"});
  //       let findExistingActivatedSlotsCount = await Yield.countDocuments({status: "Activated"});
  //       if (findExistingActivatedSlotsCount > 0 && findLOY) {
  //           let splitAmount = (findLOY.Yield + 100) / findExistingActivatedSlotsCount;
  //           findLOY.Yield = 0;
  //           await findLOY.save();
  //           const splitTwo = splitAmount / 2;
  //           for (let element of findExistingActivatedSlots) {
  //             console.log(element);
  //             let YIELD = element.currentYield + splitAmount;
  //             console.log(YIELD, "Updated Yield");
  //             if (YIELD > 200) {
  //               let staticAmount = 100;
  //               let rem = YIELD - 200;
  //               findLOY.Yield = rem.toFixed(4);
  //               console.log(findLOY);
  //               await findLOY.save();

  //               element.crowdStock = staticAmount.toFixed(4);
  //               element.currentYield = staticAmount.toFixed(4);
  //               element.status = "Completed";
  //               await element.save();
  //               console.log(element);

  //               await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
  //               await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
  //             } else {
  //               element = await Yield.findByIdAndUpdate(
  //                 element._id,
  //                 {
  //                   $inc: {
  //                     wallet: parseFloat(splitTwo.toFixed(4)),
  //                     crowdStock: parseFloat(splitTwo.toFixed(4)),
  //                     currentYield: parseFloat(splitAmount.toFixed(4)),
  //                   }
  //                 },
  //                 { new: true }
  //               );
  //               console.log(element,"element");

  //               await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
  //             }

  //             if (element.currentYield >= element.totalYield) {
  //               element.status = "Completed";
  //               await element.save();
  //               await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
  //             }

  //             let findSlotByUserId = await Slot.find({status: "Pending" }).sort({ createdAt: -1 });
  //             console.log(findSlotByUserId,"Slot By User");
  //             if (findSlotByUserId.length > 0) {
  //               let findSlotToActivate = await Slot.findOne({_id:findSlotByUserId[0]._id})
  //               await Yield.findOneAndUpdate({slotId:findSlotToActivate},{status:"Activated"},{new:true})

  //             }
  //           }
  //         }
  //     }
  //     }

  //   }
  // }

  let startedUsers = await User.find({ started: true });
  let settings = await Setting.findOne().sort({createdAt:-1})
  if (startedUsers.length > 0) {
    for (let index = 0; index < startedUsers.length; index++) {
      const element = startedUsers[index];
      // find Users Slot By User
      let LatestActivatedSlotByUSer = await Slot.findOne({userId:element._id}).sort({createdAt:-1})
      // console.log(LatestActivatedSlotByUSer);
      if(LatestActivatedSlotByUSer){
        // find whether the recent slot has fulfilled the spacer 
        let findSlot = await Slot.find({createdAt:{$gt:LatestActivatedSlotByUSer.createdAt}});
        let spacerFullFIll = findSlot.length >=settings.Sapcer
        let reserveMyWallet = element.reserveMywallet;
        let mywallet = element.myWallet
        let crowdStock = element.crowdStock
        console.log(element.myWallet,"kokoko");
        let totalwalletAndCrowdStock = mywallet + crowdStock
        console.log(mywallet,"lklk");
        console.log(spacerFullFIll,totalwalletAndCrowdStock >= reserveMyWallet+100, "Check sapcer" );
        if(spacerFullFIll && totalwalletAndCrowdStock >= reserveMyWallet+100 ){
          if(crowdStock >=90 && mywallet >=10){
            element.crowdStock = element.crowdStock - crowdStock;
            element.myWallet = element.myWallet - mywallet;
            element.save()
            console.log(element, "IF Ele");
            let adminWallet = await AdminYield.findOne().sort({createdAt:-1});
            let adminYield = adminWallet.Yield ?adminWallet.Yield:0;
            let Yields = adminYield + 100;
            let totalActivatedSlotCount = await Yield.find({status:"Activated"}).countDocuments();
            let totalActivatedSlot = await Yield.find({status:"Activated"});
            let splitYields = Yields / totalActivatedSlotCount;
            let slotcreate = await Slot.create({status:"Activated", userId:element._id,refId:element.refId })
            await Yield.create({status:"Activated", userId:element._id,refId:element.refId, slotId:slotcreate._id,totalYield:200,currentYield:0,crowdStock:0,wallet:0 })
            adminWallet.Yield = 0;
            adminWallet.save();
            for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
              const splittedYield = splitYields / 2;
              let slot = totalActivatedSlot[slots];
              slot.currentYield = slot.currentYield + splitYields;
              slot.crowdStock = slot.crowdStock + splittedYield;
              slot.wallet = slot.wallet + splittedYield;
              await Yeild_history.create({userId:slot.userId, slotId:slot.slotId, currentYield:splitYields});
              slot.save();
              if(slot.currentYield > 200){
                slot.currentYield = 200;
                slot.crowdStock = 100;
                slot.wallet = 200;
                slot.status = "Completed";
                await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
                let PlatformFee = (200 * settings.platFormFee) / 100;
               let oioi =  await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
               console.log(oioi, "updates admin");
                slot.save();
                let rem = slot.currentYield - 200;
                await Yeild_history.create({slotId:slot.slotId, userId:slot.userId,currentYield: -rem });
                let findLatestLOV = await AdminYield.findOne().sort({createdAt:-1})
                if(findLatestLOV){
                  findLatestLOV = await AdminYield.findByIdAndUpdate({_id:findLatestLOV._id}, {$inc:{Yield:rem}},{new:true});
                }
              }else if(slot.currentYield == 200){
                slot.status = "Completed";
                await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
                let PlatformFee = (200 * settings.platFormFee) / 100;
               let LPLP =  await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
               console.log(LPLP,"UPDARE");
              }
            }
          }else{
            let totalCrowdStock = 100 - crowdStock;
            console.log(totalCrowdStock, "Total Crowd Stack Else");
            element.crowdStock = 0;
            element.myWallet = totalCrowdStock;
            element.save()
            console.log(element,"ASDASD");
            let adminWallet = await AdminYield.findOne().sort({createdAt:-1});
            let adminYield = adminWallet.Yield ?adminWallet.Yield:0;
            let Yields = adminYield + 100;
            let totalActivatedSlotCount = await Yield.find({status:"Activated"}).countDocuments();
            let totalActivatedSlot = await Yield.find({status:"Activated"});
            let splitYields = Yields / totalActivatedSlotCount;
            let slotcreate = await Slot.create({status:"Activated", userId:element._id,refId:element.refId })
            await Yield.create({status:"Activated", userId:element._id,refId:element.refId, slotId:slotcreate._id,totalYield:200,currentYield:0,crowdStock:0,wallet:0 })
            adminWallet.Yield = 0;
            adminWallet.save();
            for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
              const splittedYield = splitYields / 2;
              let slot = totalActivatedSlot[slots];
              slot.currentYield = slot.currentYield + splitYields;
              slot.crowdStock = slot.crowdStock + splittedYield;
              slot.wallet = slot.wallet + splittedYield;
              await Yeild_history.create({userId:slot.userId, slotId:slot.slotId, currentYield:splitYields});
              slot.save();
              if(slot.currentYield > 200){
                slot.currentYield = 200;
                slot.crowdStock = 100;
                slot.wallet = 200;
                slot.status = "Completed";
                await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
                let PlatformFee = (200 * settings.platFormFee) / 100;
                let elup = await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
                console.log(elup, "else update IF");
                slot.save();
                let rem = slot.currentYield - 200;
                await Yeild_history.create({slotId:slot.slotId, userId:slot.userId,currentYield: -rem });
                let findLatestLOV = await AdminYield.findOne().sort({createdAt:-1})
                if(findLatestLOV){
                  findLatestLOV = await AdminYield.findByIdAndUpdate({_id:findLatestLOV._id}, {$inc:{Yield:rem}},{new:true});
                }
              }else if(slot.currentYield == 200){
                slot.status = "Completed";
                await Slot.findByIdAndUpdate({_id:slot.slotId}, { status:"Completed"}, {new:true})
                let PlatformFee = (200 * settings.platFormFee) / 100;
               let PLPL =  await AdminWallet.create({slotId:slot.slotId ,adminWallet: PlatformFee});
               console.log(PLPL, "PLPLPLPLPLPL Else Else");
              }
            }
          }
        }
      }
    }
  }
};

module.exports = {
  AutoActivateSlot,
};
