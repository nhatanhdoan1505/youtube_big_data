import { HotChannelService } from "../models/channel-hot/service";
import { UserService } from "../models/user/service";
import { MainService } from "./MainService";

export class ProfileService {
  private userService: UserService = new UserService();
  private hotChannelService: HotChannelService = new HotChannelService();
  private mainService: MainService = new MainService();

  async getChannelSave(id: string) {
    if (!id) return null;
    let channelInformation;
    channelInformation = await this.hotChannelService.findHotChannel({ id });

    if (!channelInformation) {
      let channelBaseInformation =
        await this.mainService.getChannelBasicInformation([id]);
      if (channelBaseInformation.length === 0) channelInformation = null;
      else
        channelInformation = {
          ...channelBaseInformation[0],
          isAvailable: false,
        };
    }

    return channelInformation;
  }
}
