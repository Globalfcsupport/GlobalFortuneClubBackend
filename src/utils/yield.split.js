const httpStatus = require("http-status");
const {
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
  AdminWallet,
} = require("../models/payment.history");
const ApiError = require("./ApiError");
const { Setting } = require('../models/admin.model');
const User = require("../models/users.model");

const SpliteYield = async (userId) => {
  // find Existing Active Slots Yields
  let findExistingActivatedSlots = await Yield.find({status: "Activated", userId:{$ne:userId} });
  console.log(findExistingActivatedSlots, "Existing Active Slots");
  
  let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });
  let findExistingActivatedSlotsCount = await Yield.countDocuments({status: "Activated",userId:{$ne:userId} });
  
  if (findExistingActivatedSlotsCount > 0 && findLOY) {
    let splitAmount = (findLOY.Yield + 100) / findExistingActivatedSlotsCount;
    findLOY.Yield = 0;
    await findLOY.save();
    const splitTwo = splitAmount / 2;

    for (let element of findExistingActivatedSlots) {
      console.log(element);

      let YIELD = element.currentYield + splitAmount;
      console.log(YIELD, "Updated Yield");

      if (YIELD > 200) {
        let staticAmount = 100;
        let rem = YIELD - 200;
        findLOY.Yield = rem.toFixed(4);
        console.log(findLOY);
        await findLOY.save();
        let set = await Setting.findOne().sort({createdAt:-1})
        element.crowdStock = staticAmount.toFixed(4);
        element.currentYield = staticAmount.toFixed(4);
        element.status = "Completed";
        await element.save();
        console.log(element);
        let amount = 200;
        let percentage = set.platFormFee
        let val = amount * (percentage / 100);
        IOIOIOIO = await AdminWallet.create({slotId:element.slotId, adminWallet:val})
       console.log(IOIOIOIO,"Start IOIOIOIO");
        await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
       let huhu =  await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
       console.log(huhu,"Start HUHUHU");
      } else {
        element = await Yield.findByIdAndUpdate(
          element._id,
          {
            $inc: {
              wallet: parseFloat(splitTwo.toFixed(4)),
              crowdStock: parseFloat(splitTwo.toFixed(4)),
              currentYield: parseFloat(splitAmount.toFixed(4)),
            }
          },
          { new: true }
        );
        await User.findByIdAndUpdate({_id:element.userId}, {
          $inc: {
            myWallet: parseFloat(splitTwo.toFixed(4)),
            crowdStock: parseFloat(splitTwo.toFixed(4)),
          }
        })
        console.log(element,"element");

        await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
      }

      if (element.currentYield >= element.totalYield) {
        element.status = "Completed";
        await element.save();
        await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
      }

      let settings = await Setting.findOne({_id:{$ne:null}})
      
      let findSlotByUserId = await Slot.find({status: "Pending" }).sort({ createdAt: -1 });
      console.log(findSlotByUserId,"Slot By User");
      if (findSlotByUserId.length > 0) {
        let findSlotToActivate = await Slot.findOne({_id:findSlotByUserId[0]._id})
        await Yield.findOneAndUpdate({slotId:findSlotToActivate},{status:"Activated"},{new:true})

        // let findSlotById = await Slot.findById(element.slotId);
        // console.log(findSlotById,"SLOT");
        // if (findSlotById) {
        //   let findThreeSlot = await Slot.countDocuments({ status: "Activated", createdAt: { $gt: findSlotById.createdAt } });
        //   console.log(findThreeSlot,"LKLK");
        //   let findSpacer = await Setting.findOne({_id:{$ne:null}})
        //   if (findThreeSlot >= findSpacer.Sapcer) {
        //     await Slot.findByIdAndUpdate(findSlotByUserId[0]._id, { status: "Activated" }, { new: true });
        //     await Yield.findByIdAndUpdate(findSlotByUserId[0]._id, { status: "Activated" }, { new: true });
        //   }
        // }
      }
    }
  }
};

const SpliteYield_DSA = async (userId)=>{
   // Step 1: Fetch all necessary data
   let [findExistingActivatedSlots, findLOY, findExistingActivatedSlotsCount] = await Promise.all([
    Yield.find({ status: "Activated" }),
    AdminYield.findOne().sort({ createdAt: -1 }),
    Yield.countDocuments({ status: "Activated" })
  ]);

  if (findExistingActivatedSlotsCount > 0 && findLOY) {
    // Step 2: Calculate the split amount
    let splitAmount = (findLOY.Yield + 100) / findExistingActivatedSlotsCount;
    findLOY.Yield = 0;
    await findLOY.save();
    const splitTwo = splitAmount / 2;

    // Step 3: Process each activated slot
    for (let element of findExistingActivatedSlots) {
      let YIELD = element.currentYield + splitAmount;

      if (YIELD > 200) {
        let staticAmount = 100;
        let rem = YIELD - 200;
        findLOY.Yield = rem.toFixed(4);
        await findLOY.save();

        element.crowdStock = staticAmount.toFixed(4);
        element.currentYield = staticAmount.toFixed(4);
        element.status = "Completed";
        await element.save();

        await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
        await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
      } else {
        element = await Yield.findByIdAndUpdate(
          element._id,
          {
            $inc: {
              wallet: splitTwo.toFixed(4),
              crowdStock: splitTwo.toFixed(4),
              currentYield: splitAmount.toFixed(4),
            }
          },
          { new: true }
        );

        await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
      }

      // Step 4: Check if the yield has reached the total yield
      if (element.currentYield >= element.totalYield) {
        element.status = "Completed";
        await element.save();
        await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
      }
    }

    // Step 5: Activate pending slots for the user
    let findSlotByUserId = await Slot.find({ userId: userId, status: "Pending" }).sort({ no_ofSlot: 1 });
    if (findSlotByUserId.length > 0) {
      let findSlotById = await Slot.findById(findSlotByUserId[0]._id);
      if (findSlotById) {
        let findThreeSlot = await Slot.countDocuments({ status: "Activated", createdAt: { $gt: findSlotById.createdAt } });
        if (findThreeSlot >= 3) {
          await Slot.findByIdAndUpdate(findSlotByUserId[0]._id, { status: "Activated" }, { new: true });
          await Yield.findByIdAndUpdate(findSlotByUserId[0]._id, { status: "Activated" }, { new: true });
        }
      }
    }
  }
}


module.exports = {
  SpliteYield,
  SpliteYield_DSA
};
