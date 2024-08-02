const httpStatus = require("http-status");
const {
  Slot,
  Yield,
  AdminYield,
  Yeild_history,
  AdminWallet,
  PaymentDetail,
} = require("../models/payment.history");
const { Setting } = require("../models/admin.model");
const User = require("../models/users.model");
const { RefferalIncome } = require("../models/refIncome.model");
const { NumberToLetters } = require("./referalIdGenerator");

const AutoActivateSlot = async () => {
  let startedUsers = await User.find({ started: true });
  let settings = await Setting.findOne().sort({ createdAt: -1 });
  if (startedUsers.length > 0) {
    for (let index = 0; index < startedUsers.length; index++) {
      const element = startedUsers[index];
      let LatestActivatedSlotByUSer = await Slot.findOne({
        userId: element._id,
      }).sort({ createdAt: -1 });
      if (LatestActivatedSlotByUSer) {
        // find whether the recent slot has fulfilled the spacer
        let findSlot = await Slot.find({
          createdAt: { $gt: LatestActivatedSlotByUSer.createdAt },
        });
        let spacerFullFIll = findSlot.length >= settings.Sapcer;
        let reserveMyWallet = element.reserveMywallet;
        let mywallet = element.myWallet;
        let crowdStock = element.crowdStock;
        console.log(element.myWallet, "kokoko");
        let totalwalletAndCrowdStock = mywallet + crowdStock;
        console.log(mywallet, "lklk");
        console.log(
          spacerFullFIll,
          totalwalletAndCrowdStock >= reserveMyWallet + 100,
          "Check sapcer"
        );
        if (
          spacerFullFIll &&
          totalwalletAndCrowdStock >= reserveMyWallet + 100
        ) {
          if (crowdStock >= 90 && mywallet >= 10) {
            element.crowdStock = element.crowdStock - crowdStock;
            element.myWallet = element.myWallet - mywallet;
            element.save();
            console.log(element, "IF Ele");
            let adminWallet = await AdminYield.findOne().sort({
              createdAt: -1,
            });
            let adminYield = adminWallet.Yield ? adminWallet.Yield : 0;
            let Yields = adminYield + 100;
            let totalActivatedSlotCount = await Yield.find({
              status: "Activated",
            }).countDocuments();
            let totalActivatedSlot = await Yield.find({
              status: "Activated",
            });
            let splitYields = Yields / totalActivatedSlotCount;
            let slotCount = await Slot.find({
              userId: element._id,
            }).countDocuments();
            let slotId_id = NumberToLetters(slotCount);
            let slotcreate = await Slot.create({
              status: "Activated",
              userId: element._id,
              refId: element.refId,
              slotId: `${element.refId}-${slotId_id}`,
            });
            await Yield.create({
              status: "Activated",
              userId: element._id,
              refId: element.refId,
              slotId: slotcreate._id,
              totalYield: 200,
              currentYield: 0,
              crowdStock: 0,
              wallet: 0,
            });
            await User.findByIdAndUpdate(
              { role: "admin" },
              { $inc: { adminWallet: -settings.platFormFee } },
              { new: true }
            );
            let findUserbyId = await User.findById(slotcreate.userId);
            let findReferenc = await User.findOne({
              refId: findUserbyId.uplineId,
            });

            if (findReferenc.role == "admin") {
              findReferenc = await User.findOneAndUpdate(
                { _id: findReferenc._id },
                { $inc: { adminWallet: settings.ReferalCommisionSlot } },
                { new: true }
              );
            } else {
              findReferenc = await User.findOneAndUpdate(
                { _id: findReferenc._id },
                { $inc: { myWallet: settings.ReferalCommisionSlot } },
                { new: true }
              );
            }

            await RefferalIncome.create({
              userId: findReferenc._id,
              amount: settings.ReferalCommisionSlot,
            });
            adminWallet.Yield = 0;
            adminWallet.save();

            for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
              const splittedYield = splitYields / 2;
              let slot = totalActivatedSlot[slots];
              slot.currentYield = slot.currentYield + splitYields;
              slot.crowdStock = slot.crowdStock + splittedYield;
              slot.wallet = slot.wallet + splittedYield;
              await Yeild_history.create({
                userId: slot.userId,
                slotId: slot.slotId,
                currentYield: splitYields,
              });
              slot.save();
              if (slot.currentYield > 200) {
                slot.currentYield = 200;
                slot.crowdStock = 100;
                slot.wallet = 200;
                slot.status = "Completed";

                await User.findOneAndUpdate(
                  { role: "admin" },
                  { $inc: { adminWallet: settings.platFormFee } },
                  { new: true }
                );
                await PaymentDetail.create({
                  userId: element._id,
                  status: "Platformfee",
                  amountStatus: "slotCompleted",
                  amount: val,
                });
                await Slot.findByIdAndUpdate(
                  { _id: slot.slotId },
                  { status: "Completed" },
                  { new: true }
                );
                let PlatformFee = (200 * settings.platFormFee) / 100;
                await User.findByIdAndUpdate(
                  { _id: slot.userId },
                  { $inc: { myWallet: -settings.platFormFee } },
                  { new: true }
                );

                let oioi = await AdminWallet.create({
                  slotId: slot.slotId,
                  adminWallet: PlatformFee,
                });
                slot.save();
                let rem = slot.currentYield - 200;
                await Yeild_history.create({
                  slotId: slot.slotId,
                  userId: slot.userId,
                  currentYield: -rem,
                });
                let findLatestLOV = await AdminYield.findOne().sort({
                  createdAt: -1,
                });
                if (findLatestLOV) {
                  findLatestLOV = await AdminYield.findByIdAndUpdate(
                    { _id: findLatestLOV._id },
                    { $inc: { Yield: rem } },
                    { new: true }
                  );
                }
              } else if (slot.currentYield == 200) {
                slot.status = "Completed";
                await Slot.findByIdAndUpdate(
                  { _id: slot.slotId },
                  { status: "Completed" },
                  { new: true }
                );
                let PlatformFee = (200 * settings.platFormFee) / 100;
                await User.findByIdAndUpdate(
                  { _id: slot.userId },
                  { $inc: { myWallet: -PlatformFee } },
                  { new: true }
                );
                let LPLP = await AdminWallet.create({
                  slotId: slot.slotId,
                  adminWallet: PlatformFee,
                });
                await User.findOneAndUpdate(
                  { role: "admin" },
                  { $inc: { adminWallet: settings.platFormFee } },
                  { new: true }
                );
                await PaymentDetail.create({
                  userId: element._id,
                  status: "Platformfee",
                  amountStatus: "slotCompleted",
                  amount: val,
                });
                await User.findByIdAndUpdate(
                  { _id: slot.userId },
                  { $inc: { myWallet: -settings.platFormFee } },
                  { new: true }
                );
                console.log(LPLP, "UPDARE");
              }
            }
          } else {
            let totalCrowdStock = 100 - crowdStock;
            console.log(totalCrowdStock, "Total Crowd Stack Else");
            element.crowdStock = 0;
            element.myWallet = element.myWallet - totalCrowdStock;
            element.save();

            let adminWallet = await AdminYield.findOne().sort({
              createdAt: -1,
            });
            let adminYield = adminWallet.Yield ? adminWallet.Yield : 0;
            let Yields = adminYield + 100;
            let totalActivatedSlotCount = await Yield.find({
              status: "Activated",
            }).countDocuments();
            let totalActivatedSlot = await Yield.find({
              status: "Activated",
            });
            let splitYields = Yields / totalActivatedSlotCount;
            let slotCount = await Slot.find({
              userId: element._id,
            }).countDocuments();
            let slotId_id = NumberToLetters(slotCount);
            let slotcreate = await Slot.create({
              status: "Activated",
              userId: element._id,
              refId: element.refId,
              slotId: `${element.refId}-${slotId_id}`,
            });
            let settingFind = await Setting.findOne().sort({ createdAt: -1 });
            let findUserbyId = await User.findById(slotcreate.userId);
            let refCommision = settingFind.ReferalCommisionSlot;
            let findReference = await User.findOne({
              refId: findUserbyId.uplineId,
            });
            let PlatformFee = (100 * refCommision) / 100;
            if(findReference.role =="admin"){
              findReference = await User.findOneAndUpdate(
                { _id: findReference._id },
                { $inc: { adminWallet: settingFind.ReferalCommisionSlot } },
                { new: true }
              );
            }else{
              findReference = await User.findOneAndUpdate(
                { _id: findReference._id },
                { $inc: { myWallet: settingFind.ReferalCommisionSlot } },
                { new: true }
              );
            }
          
            RefferalIncome.create({
              userId: findReference._id,
              amount: settingFind.ReferalCommisionSlot,
            });
            await Yield.create({
              status: "Activated",
              userId: element._id,
              refId: element.refId,
              slotId: slotcreate._id,
              totalYield: 200,
              currentYield: 0,
              crowdStock: 0,
              wallet: 0,
            });
            adminWallet.Yield = 0;
            adminWallet.save();
            for (let slots = 0; slots < totalActivatedSlot.length; slots++) {
              const splittedYield = splitYields / 2;
              let slot = totalActivatedSlot[slots];
              slot.currentYield = slot.currentYield + splitYields;
              slot.crowdStock = slot.crowdStock + splittedYield;
              slot.wallet = slot.wallet + splittedYield;
              await Yeild_history.create({
                userId: slot.userId,
                slotId: slot.slotId,
                currentYield: splitYields,
              });
              slot.save();
              if (slot.currentYield > 200) {
                slot.currentYield = 200;
                slot.crowdStock = 100;
                slot.wallet = 200;
                slot.status = "Completed";
                await Slot.findByIdAndUpdate(
                  { _id: slot.slotId },
                  { status: "Completed" },
                  { new: true }
                );
                let PlatformFee =  settings.platFormFee
                await User.findByIdAndUpdate(
                  { _id: slot.userId },
                  { $inc: { myWallet: -PlatformFee } },
                  { new: true }
                );
                await User.findOneAndUpdate(
                  { role: "admin" },
                  { $inc: { adminWallet: PlatformFee } },
                  { new: true }
                );
                let elup = await AdminWallet.create({
                  slotId: slot.slotId,
                  adminWallet: PlatformFee,
                });
                console.log(elup, "else update IF");
                slot.save();
                let rem = slot.currentYield - 200;
                await Yeild_history.create({
                  slotId: slot.slotId,
                  userId: slot.userId,
                  currentYield: -rem,
                });
                let findLatestLOV = await AdminYield.findOne().sort({
                  createdAt: -1,
                });
                if (findLatestLOV) {
                  findLatestLOV = await AdminYield.findByIdAndUpdate(
                    { _id: findLatestLOV._id },
                    { $inc: { Yield: rem } },
                    { new: true }
                  );
                }
              } else if (slot.currentYield == 200) {
                slot.status = "Completed";
                await Slot.findByIdAndUpdate(
                  { _id: slot.slotId },
                  { status: "Completed" },
                  { new: true }
                );
                let PlatformFee = settings.platFormFee
                await User.findByIdAndUpdate(
                  { _id: slot.userId },
                  { $inc: { myWallet: -PlatformFee } },
                  { new: true }
                );
                let PLPL = await AdminWallet.create({
                  slotId: slot.slotId,
                  adminWallet: PlatformFee,
                });
                await PaymentDetail.create({
                  userId: element._id,
                  status: "Platformfee",
                  amountStatus: "slotCompleted",
                  amount: PlatformFee,
                });
                await User.findOneAndUpdate(
                  { role: "admin" },
                  { $inc: { adminWallet: PlatformFee } },
                  { new: true }
                );
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
