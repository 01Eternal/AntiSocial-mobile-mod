/** @format */

import { using } from "./ModClasses.js";

using("Terraria");

class AntiSocial {
	static Armor = true;
	static Accessory = true;
	
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
		if (player.armor[i].wingSlot > 0)
			player.wingsLogic = player.armor[i].wingSlot;
	}
	
	/**
	 * @param {Player} player - acess player properties
	 * @returns {void}
	 */
	static UpdateSocialSlot(player) {
		for (
			let i = AntiSocial.IsAccessorySlot.start;
			i < AntiSocial.IsAccessorySlot.end;
			i++
		) {
			AntiSocial.UpdateAccessorySocialSlot(i, player);
			AntiSocial.UpdateArmorSocialSlot(i, player);
		}
	}
}

Player.UpdateEquips.hook((orig, self, i) => {
	orig(self, i);
	AntiSocial.UpdateSocialSlot(self);
	/**
	 * @debug
    	Main.NewText(`wingLogic => ${self.wingsLogic}`, 255, 255, 255)
    	Main.NewText(`legs => ${self.legs}`, 255, 255, 255)
    	Main.NewText(`body => ${self.body}`, 255, 255, 255)
    	Main.NewText(`head => ${self.head}`, 255, 255, 255)
	*/
});
