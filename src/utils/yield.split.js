const httpStatus = require("http-status");
const { Slot, Yield, AdminYield } = require("../models/payment.history");
const ApiError = require("./ApiError");

const SpliteYield = async (userId) => {
  // find Existing Active Slots Yields
  let findExistingActivatedSlots = await Yield.find({
    userId: { $ne: userId },
    status: "Activated",
  });

  let findLOY = await AdminYield.findOne().sort({ createdAt: -1 });

  let findExistingActivatedSlotsCount = await Yield.find({
    userId: { $ne: userId },
    status: "Activated",
  }).countDocuments();

  const splitAmount = findLOY.Yield + 100 / findExistingActivatedSlotsCount;
  const splitTwo = splitAmount / 2

  if (findExistingActivatedSlotsCount > 0) {
    for (let index = 0; index < findExistingActivatedSlots.length; index++) {
      let element = findExistingActivatedSlots[index];
      element = await Yield.findByIdAndUpdate(
        { _id: element._id },
        { $inc: { currentYield: splitTwo , crowdStock:splitTwo} },
        { new: true }
      );
      if (element.currentYield > 200) {
        let remaining = updateYields - 200;
        await Yield.findByIdAndUpdate(
          { _id: element._id },
          { $inc: { currentYield: 200 } },
          { $set: { status: "Completed" } },
          { new: true }
        );
        await Slot.findByIdAndUpdate(
          { _id: element.slotId },
          { $set: { status: "Completed" } },
          { new: true }
        );
        await AdminYield.updateOne(
          { _id: { $ne: null } },
          { $set: { $inc: { Yield: remaining } } },
          { new: true }
        );
      }
      let slotId = element.slotslotId;

      let findSlotByuserId = await Slot.find({ userId: userId, status: "Pending" }).sort({ no_ofSlot: 1 })
      if (findSlotByuserId.length > 0) {
        let findSlotById = await Slot.findById(slotId)
        if (findSlotById) {
          let findThreeSlot = await Slot.find({ status: "Activated", createdAt: { $gt: findSlotById } }).countDocuments()
          if (findThreeSlot >= 3) {
            await Slot.findByIdAndUpdate({ _id: findSlotByuserId[0]._id }, { status: "Activated" }, { new: true })
            await Yield.findByIdAndUpdate({ slotId: findSlotByuserId[0]._id }, { status: "Activated" }, { new: true })
          }
        }
      }
    }
  }
};

module.exports = {
  SpliteYield,
};
