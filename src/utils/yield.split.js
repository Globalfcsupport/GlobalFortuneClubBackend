const httpStatus = require("http-status");
const { Slot } = require("../models/payment.history");
const ApiError = require("./ApiError");

const SpliteYield = async (userId) => {
  let findActiveSlot = await Slot.findOne({
    status: "Activated",
    userId: userId,
  }).sort({ createdAt: -1 });
  if (!findActiveSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Slot Not Activated OR Exist's");
  }
  let existingActivatedSlots = Slot.find({
    _id: { $ne: findActiveSlot._id },
    status: "Activated",
  }).cursor();

  let batch = [];
  let batchCount = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    // Prepare the update operation for this document
    const updateOperation = {
      updateOne: {
        filter: { _id: { $ne: findActiveSlot._id }, status: "Activated" },
        update: { $set: { fieldToUpdate: "newValue" } },
      },
    };
    batch.push(updateOperation);
    if (batch.length === batchSize) {
      await Slot.bulkWrite(batch);
      console.log(`Batch ${++batchCount} updated`);
      batch = [];
    }
  }
  if (batch.length > 0) {
    await Slot.bulkWrite(batch);
    console.log(`Final batch updated`);
  }

  console.log("All documents updated");
};
