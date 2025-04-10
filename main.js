import { using } from "./Lib/ModClasses.js";
import { ModConfig } from "./Lib/ModConfig.js";

using("Terraria");
using("Terraria.Chat");

class AntiSocial {
    static Armor = true;
    static Accessory = true;
    static FilePath = "Data/ModConfig.json";
    /**
     * @typedef {object} IsAccessorySlot
     * @property {number} start - start of Social Slot Index
     * @property {number} end - end of Social Slot Index
     */
    static IsAccessorySlot = {
        start: 9,
        end: 19
    };

    /**
     * @param {number} i - Social Slots Index
     * @param {Player} player - Acess Player properties
     * @returns {void}
     */
    static UpdateArmorSocialSlot(i, player) {
        if (!AntiSocial.Armor) return;
        if (player.armor[i].headSlot > 0) player.head = player.armor[i].headSlot;
        if (player.armor[i].bodySlot > 0) player.body = player.armor[i].bodySlot;
        if (player.armor[i].legSlot > 0) player.legs = player.armor[i].legSlot;
    }

    /**
     * @param {number} i - Social Slots Index
     * @param {Player} player - acess Player properties
     * @returns {void}
     */
    static UpdateAccessorySocialSlot(i, player) {
        if (!AntiSocial.Accessory) return;
        player.ApplyEquipFunctional(i, player.armor[i]);
        player.GrantPrefixBenefits(player.armor[i]);
        player.GrantArmorBenefits(player.armor[i]);
        if (player.armor[i].wingSlot > 0) player.wingsLogic = player.armor[i].wingSlot;
    }

    static ModConfigUpdate() {
        if (!tl.directory.exists("Data")) ModConfig.MakeFolder("Data");
        const Config = ModConfig.Load(AntiSocial.FilePath);
        let defaultConfig = {
            canArmor: this.Armor,
            canAcC: this.Accessory
        };
        if (!Config) return ModConfig.Save(AntiSocial.FilePath, defaultConfig);
        this.Armor = Config.canArmor;
        this.Accessory = Config.canAcC;
    }

    static AddCommand = (text, textCMD, action) => {
        if (text.includes(`/${textCMD}`)) return action();
    };

    /**
     * @param {Player} player - acess player properties
     * @returns {void}
     */
    static UpdateSocialSlot(player) {
        for (let i = AntiSocial.IsAccessorySlot.start; i < AntiSocial.IsAccessorySlot.end; i++) {
            AntiSocial.UpdateAccessorySocialSlot(i, player);
            AntiSocial.UpdateArmorSocialSlot(i, player);
            AntiSocial.ModConfigUpdate();
        }
    }
}

Player.UpdateEquips.hook((orig, self, i) => {
    orig(self, i);
    AntiSocial.UpdateSocialSlot(self);
    /**
     * @debug
     * Main.NewText(`wingLogic => ${self.wingsLogic}`, 255, 255, 255)
     * Main.NewText(`legs => ${self.legs}`, 255, 255, 255)
     * Main.NewText(`body => ${self.body}`, 255, 255, 255)
     * Main.NewText(`head => ${self.head}`, 255, 255, 255)
     */
});

ChatCommandProcessor.ProcessIncomingMessage.hook((orig, self, message, clientID) => {
    const Config = ModConfig.Load(AntiSocial.FilePath);
    let text = message.Text;

    AntiSocial.AddCommand(text, "Acc", () => {
        Config.canAcC = !Config.canAcC && !AntiSocial.Accessory;
        ModConfig.Save(AntiSocial.FilePath, Config);
        Main.NewText(`Accessory social slots are now ${Config.canAcC ? "ENABLED" : "DISABLED"}`, 150, 250, 150);
    });

    AntiSocial.AddCommand(text, "Armor", () => {
        Config.canArmor = !Config.canArmor && !AntiSocial.Armor;
        ModConfig.Save(AntiSocial.FilePath, Config);
        Main.NewText(`Armor social slots are now ${Config.canArmor ? "ENABLED" : "DISABLED"}`, 150, 200, 250);
    });
});
