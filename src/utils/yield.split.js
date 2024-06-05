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
  let findExistingActivatedSlots = await Yield.find({status: "Activated" });
  console.log(findExistingActivatedSlots, "Existing Active Slots");
  
  let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });
  let findExistingActivatedSlotsCount = await Yield.countDocuments({status: "Activated" });
  
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
              wallet: parseFloat(splitTwo.toFixed(4)),
              crowdStock: parseFloat(splitTwo.toFixed(4)),
              currentYield: parseFloat(splitAmount.toFixed(4)),
            }
          },
          { new: true }
        );
        console.log(element);

        await Yeild_history.create({ userId: element.userId, slotId: element.slotId, currentYield: splitAmount.toFixed(4) });
      }

      if (element.currentYield >= element.totalYield) {
        element.status = "Completed";
        await element.save();
        await Slot.findByIdAndUpdate(element.slotId, { status: "Completed" }, { new: true });
      }

      let findSlotByUserId = await Slot.find({ userId: userId, status: "Pending" }).sort({ no_ofSlot: 1 });
      if (findSlotByUserId.length > 0) {
        let findSlotById = await Slot.findById(element.slotId);
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
};


module.exports = {
  SpliteYield,
};
