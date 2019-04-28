"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccountData_1 = require("./models/AccountData");
const AccountType_1 = require("./models/AccountType");
const UserData_1 = require("./models/UserData");
const User_1 = require("./models/User");
const JobTag_1 = require("./models/JobTag");
const Jobs_1 = require("./models/Jobs");
const UserProfile_1 = require("./models/UserProfile");
// function foo() {
//   for (let i = 0; i < 100000; i++) {}
// }
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("cat");
        // foo().then(() => console.log("horse!"));
        // console.log("dog");
        // User.findOne({})
        //   .populate("accountDataId userDaaId")
        //   .exec()
        //   .then(user => user.populate("test"))
        //   .then(user => user.validate())
        //   .catch(console.log);
        // await createTags();
        // await createAccountTypes();
        // await createUsers();
        // await createJobs();
        // const value = await User.find({})
        //   .populate("userProfileId accountDataId userDataId")
        //   .findOne({
        //     "accountDataId.username": {
        //       $regex: /tya/
        //     }
        //   });
        // console.log(value);
        // const admins = await AccountData.find({ accountTypeId: (await AccountType.findOne({ scope: workerUserScope }).exec()).id }).exec();
        // console.log(admins);
    });
}
exports.default = default_1;
function createUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield AccountData_1.default.deleteMany({}).exec();
        const accountData = [
            {
                username: "poopaloop",
                email: "poopa@gmail.loopa",
                password: "superpuperhash",
                avatarURL: "https://pp.userapi.com/c840225/v840225382/7839a/kQV6BpB5yAg.jpg",
                accountTypeId: (yield AccountType_1.default.findOne({ label: "admin" }).exec()).id
            },
            {
                username: "rabotyaga",
                email: "rabotyaga@gmail.loopa",
                password: "superpuperhash",
                avatarURL: "https://pp.userapi.com/c840225/v840225382/7839a/kQV6BpB5yAg.jpg",
                accountTypeId: (yield AccountType_1.default.findOne({ scope: AccountType_1.workerUserScope }).exec()).id
            }
        ];
        const accounts = yield AccountData_1.default.insertMany(accountData.map(d => new AccountData_1.default(d))).catch(console.log);
        if (!accounts)
            return;
        yield UserData_1.default.deleteMany({}).exec();
        const userData = [
            {
                dob: new Date(2000, 10, 24),
                firstName: "Daniil",
                secondName: "Bombenkov",
                thirdName: "Sergeevich"
            },
            {
                dob: new Date(1998, 2, 3),
                firstName: "Poopich",
                secondName: "Loopich",
                thirdName: "DIedied"
            }
        ];
        const users = yield UserData_1.default.insertMany(userData.map(d => new UserData_1.default(d))).catch(console.log);
        if (!users)
            return;
        yield UserProfile_1.default.deleteMany({}).exec();
        const userProfile = [
            {
                dor: new Date(1999, 20, 10)
            },
            {
                dor: new Date(1998, 20, 10)
            }
        ];
        const profile = yield UserProfile_1.default.insertMany(userProfile.map(d => new UserProfile_1.default(d))).catch(console.log);
        if (!profile)
            return;
        yield User_1.default.deleteMany({}).exec();
        for (let i = 0; i < users.length; i++) {
            const user = {
                userProfileId: profile[i].id,
                accountDataId: accounts[i].id,
                userDataId: users[i].id,
                jobTagIds: yield JobTag_1.default.find({ label: { $regex: /убо/ } })
                    .select("id")
                    .exec()
            };
            new User_1.default(user).save().catch(console.log);
            // UserProfile
        }
    });
}
function createJobs() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Jobs_1.default.deleteMany({}).exec();
        // const worker = await User  .findOne({ "userDataId.firstName": "Daniil" }).exec();
        // console.log(worker);
        const worker = yield User_1.default.findOne({ userDataId: (yield UserData_1.default.findOne({ firstName: { $regex: /Dan/ } })).id });
        const docs = [
            {
                label: "Выгул собаки",
                description: "Выгулять Жужу, очень плохо себя чувствую",
                tagIds: [(yield JobTag_1.default.findOne({ label: { $regex: /выгул/ } }).exec()).id],
                status: Jobs_1.JobStatus.TAKED,
                workerUserId: worker.id
            }
        ];
        yield Jobs_1.default.insertMany(docs.map(d => new Jobs_1.default(d))).catch(console.log);
    });
}
function createTags() {
    return __awaiter(this, void 0, void 0, function* () {
        yield JobTag_1.default.deleteMany({}).exec();
        const docs = [
            {
                label: "уборка"
            },
            {
                label: "выгул животного"
            },
            {
                label: "строительство",
                color: "#3ffffd"
            }
        ];
        yield JobTag_1.default.insertMany(docs.map(d => new JobTag_1.default(d))).catch(console.log);
    });
}
function createAccountTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        yield AccountType_1.default.deleteMany({}).exec();
        const docs = [
            {
                label: "admin",
                scope: AccountType_1.adminScope
            },
            {
                label: "worker",
                scope: AccountType_1.workerUserScope
            },
            {
                label: "full_user",
                scope: AccountType_1.fullUserScope
            }
        ];
        yield AccountType_1.default.insertMany(docs.map(d => new AccountType_1.default(d))).catch(console.log);
    });
}
