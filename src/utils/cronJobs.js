const httpStatus = require("http-status");
const {
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
  AdminWallet,
  PaymentDetail,
} = require("../models/payment.history");
const User = require("../models/users.model");
const { RefferalIncome } = require("../models/refIncome.model");
const { NumberToLetters } = require("./referalIdGenerator");
const { Setting } = require("../models/admin.model");

const CronJobs = async () => {
  let LOY = await AdminYield.findOne().sort({createdAt:-1})
  let leftoveryield = LOY.Yield?LOY.Yield:0
  let setting = await Setting.findOne().sort({ createdAt: -1 });
  let values = await User.aggregate([
    {
      $match: {
        started: true,
        role: { $ne: "admin" },
      },
    },
  ]);

  for (let index = 0; index < values.length; index++) {
    const element = values[index];
    // Check Spacer
    let findLatestSlot = await Slot.findOne({userId:element._id}).sort({ createdAt: -1 });
    let findCountForSPacer = await Slot.find({createdAt: { $gt: findLatestSlot.createdAt }}).countDocuments();
    // Check Spacer Statisfied Or NOT
    console.log(findCountForSPacer >= setting.Sapcer, "For", element.userName);
    let getActivatedSlotCount = await Yield.find({status:'Activated'}).countDocuments();
    let getActivatedSlot = await Yield.find({status:'Activated'})
    console.log(index++, "INDEX");
    
    if(findCountForSPacer >= setting.Sapcer){
      console.log(`${element.userName} Going To Activate Next Slot`);
      // Check Crowd Stock And Wallet Amount
      let wallet = element.myWallet
      let crowdstock = element.crowdStock
      let rservemywallet = element.reserveMywallet
      // STEP ONE -  Check Available crowdstock Amount For Buy New Slot

      let RemAmount = 100 - crowdstock
      let amt = wallet - RemAmount
      
      if(crowdstock >= 100||amt>rservemywallet){
        console.log(`${element.userName} Condition Statisfied`);

        if(crowdstock >= 100){
          let walletUpdate = await User.findByIdAndUpdate({_id:element._id}, {$inc:{crowdStock:-100}}, {new:true})
        }
       else if(amt>rservemywallet){
          let walletUpdate = await User.findByIdAndUpdate({_id:element._id}, {$inc:{crowdStock:-crowdstock, myWallet:-RemAmount}}, {new:true})
        }
      
        let exitsSlotCount = await Slot.find({userId:element._id}).countDocuments()
        let idGen = NumberToLetters(exitsSlotCount)
        let createSlot = await Slot.create({userId:element._id, status:'Activated',slotId:idGen})
        let yieldCreation = await Yield.create({userId:element._id, slotId:createSlot._id, totalYield:200, currentYield:0, crowdStock:0,status:'Activated', wallet:0})
   
        let findRef = await User.findOneAndUpdate({refId:element.uplineId},{$inc:{myWallet:1}},{new:true})
        let RefIncome = await RefferalIncome.create({amount:1, userId:findRef._id})
        let reduceAdminWallet = await User.findOneAndUpdate({role:'admin'}, {$inc:{adminWallet:-1}},{new:true})
        // Split Dollers
        console.log(getActivatedSlotCount);
        
        let splitYield = (100 + leftoveryield) / getActivatedSlotCount;
        console.log(splitYield, "From Crowd Stock");
        
        if(LOY){
          await AdminYield.findByIdAndUpdate({_id:LOY._id}, {Yield:0}, {new:true})
        }

        for (let splitInd = 0; splitInd < getActivatedSlot.length; splitInd++) {
          const activatedSlots = getActivatedSlot[splitInd];
          let splitTwo = splitYield / 2;
          console.log(element.userName, splitTwo);
          console.log(activatedSlots);
          

          let findYeld = await Yield.findByIdAndUpdate({_id:activatedSlots._id}, {$inc:{currentYield:splitYield, crowdStock:splitTwo, wallet:splitTwo}}, {new:true})
          await Yeild_history.create({userId:activatedSlots.userId, slotId:activatedSlots.slotId, currentYield:splitYield,totalYield:200});
          let updateWalletAmount = await User.findByIdAndUpdate({_id:activatedSlots.userId}, {$inc:{myWallet:splitTwo, crowdStock:splitTwo}});
            if (findYeld.currentYield == 200){
              console.log("Completed From IF", element.userName);
              let complete =  await Yield.findByIdAndUpdate({_id:activatedSlots._id}, {status:'Completed', currentYield:200, crowdStock:100, wallet:100}, {new:true})
              await Slot.findByIdAndUpdate({_id:complete.slotId}, { status:'Completed' }, {new:true})
              await PaymentDetail.create({userId:complete.userId, amount:setting.platFormFee, amountStatus:'slotCompleted', status:'Platformfee'})
              await User.findOneAndUpdate({role:'admin'}, { $inc:{adminWallet:setting.platFormFee} }, {new:true})
              await User.findByIdAndUpdate({_id:complete.userId}, {$inc:{adminWallet: -setting.platFormFee}}, {new:true})
            }
             if(findYeld.currentYield > 200) {
              console.log("Completed From Else", element.userName);
              let complete =  await Yield.findByIdAndUpdate({_id:activatedSlots._id}, {status:'Completed'}, {new:true})
              await Slot.findByIdAndUpdate({_id:complete.slotId}, { status:'Completed' }, {new:true})
              await PaymentDetail.create({userId:complete.userId, amount:setting.platFormFee, amountStatus:'slotCompleted', status:'Platformfee'})
              await User.findOneAndUpdate({role:'admin'}, { $inc:{adminWallet:setting.platFormFee} }, {new:true})
              await User.findByIdAndUpdate({_id:complete.userId}, {$inc:{adminWallet: -setting.platFormFee}}, {new:true})
             let remYield =   findYeld.currentYield - 200
              if(LOY){
                await AdminYield.findByIdAndUpdate({_id:LOY._id}, {Yield:remYield}, {new:true})
              }else{
                await AdminYield.create({Yield:remYield})
              }
            }
        }
      }else{
        console.log(`${element.userName} Condition Unstatisfied`);
      }
      // else{
      //   let RemAmount = 100 - crowdstock
      //   let amt = wallet - RemAmount
      //   if(amt>rservemywallet){
      //     let exitsSlotCount = await Slot.find({userId:element._id}).countDocuments()
      //   let idGen = NumberToLetters(exitsSlotCount)
      //   let createSlot = await Slot.create({userId:element._id, status:'Activated',slotId:idGen})
      //   let walletUpdate = await User.findByIdAndUpdate({_id:element._id}, {$inc:{crowdStock:-crowdstock, myWallet:-RemAmount}}, {new:true})
      //   let yieldCreation = await Yield.create({userId:element._id, slotId:createSlot._id, totalYield:200, currentYield:0, crowdStock:0,status:'Activated', wallet:0})
      //   let getActivatedSlotCount = await Yield.find({status:'Activated', _id:{$ne:yieldCreation._id}}).countDocuments();
      //   let getActivatedSlot = await Yield.find({status:'Activated', _id:{$ne:yieldCreation._id}})
      //   let findRef = await User.findOneAndUpdate({refId:element.uplineId},{$inc:{myWallet:1}},{new:true})
      //   let RefIncome = await RefferalIncome.create({amount:1, userId:findRef._id})
      //   let reduceAdminWallet = await User.findOneAndUpdate({role:'admin'}, {$inc:{adminWallet:-1}},{new:true})
      //   // Split Dollers
      //   let splitYield = 100+leftoveryield / getActivatedSlotCount
      //     console.log(splitYield, "From BOTH");
      //   if(LOY){
      //     await AdminYield.findByIdAndUpdate({_id:LOY._id}, {Yield:0}, {new:true})
      //   }

      //   for (let splitInd = 0; splitInd < getActivatedSlot.length; splitInd++) {
      //     const activatedSlots = getActivatedSlot[splitInd];
      //     let splitTwo = splitYield / 2;
      //     let findYeld = await Yield.findByIdAndUpdate({_id:activatedSlots._id}, {$inc:{currentYield:splitYield, crowdStock:splitTwo, wallet:splitTwo}}, {new:true})
      //     await Yeild_history.create({userId:activatedSlots.userId, slotId:activatedSlots.slotId, currentYield:splitYield,totalYield:200});
      //     let updateWalletAmount = await User.findByIdAndUpdate({_id:activatedSlots.userId}, {$inc:{myWallet:splitTwo, crowdStock:splitTwo}});
      //       if (findYeld.currentYield ==200){
      //         let complete =  await Yield.findByIdAndUpdate({_id:activatedSlots._id}, {status:'Completed', currentYield:200, crowdStock:100, wallet:100}, {new:true})
      //         await Slot.findByIdAndUpdate({_id:complete.slotId}, { status:'Completed' }, {new:true})
      //         await PaymentDetail.create({userId:complete.userId, amount:setting.platFormFee, amountStatus:'slotCompleted', status:'Platformfee'})
      //         await User.findOneAndUpdate({role:'admin'}, { $inc:{adminWallet:setting.platFormFee} }, {new:true})
      //         await User.findByIdAndUpdate({_id:complete.userId}, {$inc:{adminWallet: -setting.platFormFee}}, {new:true})
      //       }else if(findYeld.currentYield >200){
      //         let complete =  await Yield.findByIdAndUpdate({_id:activatedSlots._id}, {status:'Completed'}, {new:true})
      //         await Slot.findByIdAndUpdate({_id:complete.slotId}, { status:'Completed' }, {new:true})
      //         await PaymentDetail.create({userId:complete.userId, amount:setting.platFormFee, amountStatus:'slotCompleted', status:'Platformfee'})
      //         await User.findOneAndUpdate({role:'admin'}, { $inc:{adminWallet:setting.platFormFee} }, {new:true})
      //         await User.findByIdAndUpdate({_id:complete.userId}, {$inc:{adminWallet: -setting.platFormFee}}, {new:true})
      //        let remYield =   findYeld.currentYield - 200
      //         if(LOY){
      //           await AdminYield.findByIdAndUpdate({_id:LOY._id}, {Yield:remYield}, {new:true})
      //         }else{
      //           await AdminYield.create({Yield:remYield})
      //         }
      //       }
          
      //   }
      //   }else{
      //     console.log(`${element.userName} Wallet Amount Not Enough To Buy New Slot`);
      //   }
      // }
    }
  }

  return values;
};

module.exports = {
  CronJobs,
};
