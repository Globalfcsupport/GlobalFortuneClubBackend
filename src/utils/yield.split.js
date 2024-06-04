const httpStatus = require("http-status");
const {
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
} = require("../models/payment.history");
const ApiError = require("./ApiError");

const SpliteYield = async (userId) => {
  // find Existing Active Slots Yields
  let findExistingActivatedSlots = await Yield.find({userId: { $ne: userId },status: "Activated"});
  console.log(findExistingActivatedSlots, "LLLLL");
  let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });
  let findExistingActivatedSlotsCount = await Yield.find({userId: { $ne: userId },status: "Activated"}).countDocuments();
  let splitAmount = findLOY.Yield + 100 / findExistingActivatedSlotsCount;
  findLOY.Yield = 0;
  findLOY.save();
  const splitTwo = splitAmount / 2;
  if (findExistingActivatedSlotsCount > 0) {
    for (let index = 0; index < findExistingActivatedSlots.length; index++) {
      let element = findExistingActivatedSlots[index];
      let YIELD = element.currentYield + splitAmount;
      if(YIELD >200){
        let static = 100
        let rem = YIELD - 200
        findLOY.Yield = rem.toFixed(4)
        findLOY.save()
        element.crowdStock = static.toFixed(4)
        element.currentYield = static.toFixed(4)
        element.status = "Completed";
        element.save();
        await Slot.findByIdAndUpdate({ _id: element.slotId },{ status: "Completed" },{ new: true });
        await Yeild_history.create({userId: element.userId,slotId: element.slotId,currentYield: element.splitAmount.toFixed(4)});
      }else{
        element = await Yield.findByIdAndUpdate({ _id: element._id },{$inc: { wallet: parseInt(splitTwo.toFixed(4)),crowdStock: parseInt(splitTwo.toFixed(4)), currentYield: parseInt(splitAmount.toFixed(4))}},{ new: true });
        await Yeild_history.create({userId: element.userId,slotId: element.slotId,currentYield: element.splitAmount.toFixed(4)});
      }
      if (element.currentYield == element.totalYield) {
        element.status = "Completed";
        element.save();
        await Slot.findByIdAndUpdate({ _id: element.slotId },{ status: "Completed" },{ new: true });
      }
      let slotId = element.slotslotId;
      let findSlotByuserId = await Slot.find({userId: userId,status: "Pending"}).sort({ no_ofSlot: 1 });
      if (findSlotByuserId.length > 0) {
        let findSlotById = await Slot.findById(slotId);
        if (findSlotById) {
          let findThreeSlot = await Slot.find({status: "Activated",createdAt: { $gt: findSlotById.createdAt }}).countDocuments();
          if (findThreeSlot >= 3) {
            await Slot.findByIdAndUpdate({ _id: findSlotByuserId[0]._id },{ status: "Activated" },{ new: true });
            await Yield.findByIdAndUpdate({ slotId: findSlotByuserId[0]._id },{ status: "Activated" },{ new: true });
          }
        }
      }
    }
  }
};

module.exports = {
  SpliteYield,
};
