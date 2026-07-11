import { Partials, ActivityType } from "discord.js";

export default {
  clientOptions: {
    intents: [3276799],
    partials: [Partials.Channel, Partials.GuildMember, Partials.User],
    presence: {
      activities: [
        {
          name: "Tüm Sunucuları",
          type: ActivityType.Watching,
          state: "💞 Cabbarxdd",
        },
      ],
    },
  },
};
